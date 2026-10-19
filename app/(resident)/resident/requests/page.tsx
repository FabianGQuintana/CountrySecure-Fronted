"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTool, FiMapPin, FiPlus, FiX } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cancelRequest, createRequest, listMyRequests } from "@/features/requests/actions";
import { listOrders } from "@/features/orders/actions";
import type { OrderDto, RequestDto } from "@/types/models";

const STATUS: Record<string, { label: string; className: string }> = {
  Pending: { label: "Pendiente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  Completed: { label: "Resuelta", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Cancelled: { label: "Cancelada", className: "bg-slate-100 text-slate-500 border-slate-200" },
};

function statusOf(r: RequestDto) {
  if (r.baseEntityStatus === "Inactive") return STATUS.Cancelled;
  return STATUS[r.status] ?? STATUS.Pending;
}

export default function ResidentRequestsPage() {
  const [requests, setRequests] = useState<RequestDto[]>([]);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderId: "", details: "", location: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [mine, services] = await Promise.all([listMyRequests(), listOrders()]);

    if (mine.ok) {
      setRequests(mine.data);
      setError(null);
    } else {
      setError(mine.error);
    }

    if (services.ok) setOrders(services.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.orderId) return setFormError("Elegí el servicio que necesitás.");
    if (form.details.trim().length < 5) return setFormError("Contanos un poco más del problema (mínimo 5 caracteres).");
    if (!form.location.trim()) return setFormError("Indicá dónde hay que hacer el trabajo.");

    setSaving(true);
    const result = await createRequest({ ...form, details: form.details.trim(), location: form.location.trim() });
    setSaving(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setForm({ orderId: "", details: "", location: "" });
    setShowForm(false);
    await load();
  };

  const handleCancel = async (id: string) => {
    if (!confirm("¿Cancelar esta solicitud?")) return;
    const result = await cancelRequest(id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    await load();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-purple-100/20 p-4 sm:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-purple-600">Solicitudes</h1>
            <p className="text-slate-500 mt-2">Pedí servicios de mantenimiento y seguí su estado.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-white font-medium shadow hover:bg-purple-700 transition"
          >
            {showForm ? <FiX /> : <FiPlus />} {showForm ? "Cerrar" : "Nueva solicitud"}
          </button>
        </motion.div>

        {/* Formulario */}
        {showForm && (
          <Card className="bg-white border border-purple-100 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Servicio
                  <select
                    value={form.orderId}
                    onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                    className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">Seleccioná un servicio...</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.supplierName} · {o.description}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Detalle
                  <textarea
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    rows={3}
                    placeholder="Ej.: pérdida de agua en la cocina"
                    className="px-4 py-2.5 rounded-lg border border-slate-300"
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Ubicación
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Ej.: Lote 12, cocina"
                    className="px-4 py-2.5 rounded-lg border border-slate-300"
                  />
                </label>
                {formError && <p className="text-sm text-red-600">{formError}</p>}
                <button
                  type="submit"
                  disabled={saving}
                  className="justify-self-start px-5 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? "Enviando..." : "Enviar solicitud"}
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Listado */}
        {loading && <p className="text-slate-500 animate-pulse">Cargando solicitudes...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && requests.length === 0 && (
          <Card className="border-dashed border-2 bg-white/60">
            <CardContent className="p-12 text-center text-slate-500">
              Todavía no hiciste ninguna solicitud.
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {requests.map((r, i) => {
            const status = statusOf(r);
            const canCancel = r.baseEntityStatus !== "Inactive" && r.status === "Pending";
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                        <FiTool size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{r.order?.supplierName ?? "Servicio"}</p>
                        <p className="text-slate-600 text-sm">{r.details}</p>
                        <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                          <FiMapPin size={12} /> {r.location} ·{" "}
                          {new Date(r.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={status.className}>{status.label}</Badge>
                      {canCancel && (
                        <button onClick={() => handleCancel(r.id)} className="text-sm text-red-600 hover:underline">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
