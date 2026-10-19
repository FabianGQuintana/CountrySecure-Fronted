"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiTruck } from "react-icons/fi";
import { Estados } from "@/components/estados";
import { orderTypeLabel } from "@/types/api";
import type { OrderDto } from "@/types/models";
import { deleteOrder, restoreOrder, updateOrder } from "../actions";
import { OrderForm } from "./OrderForm";

const card = "bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 overflow-hidden";
const cardHeader = "bg-linear-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 px-6 py-4 border-b border-purple-200/50";

export function OrderDetail({ order: initialOrder }: { order: OrderDto }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const active = order.status === "Active";

  const flash = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    if (type === "success") setTimeout(() => setMessage(null), 3000);
  };

  const toggleStatus = async () => {
    setIsChangingStatus(true);
    const result = await (active ? deleteOrder(order.id) : restoreOrder(order.id));
    setIsChangingStatus(false);

    if (!result.ok) return flash("error", result.error);

    setOrder(result.data);
    flash("success", `Servicio ${result.data.status === "Active" ? "activado" : "desactivado"} correctamente`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button type="button" onClick={() => router.back()} className="flex items-center text-purple-600 hover:text-purple-800 group transition-colors">
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a servicios
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              {order.supplierName}
            </h1>
            <p className="text-gray-500 mt-1">
              {orderTypeLabel(order.orderType)} · {order.description}
            </p>
          </div>
          <Estados estado={order.status} />
        </div>

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${
              message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" && <FiCheck />} {message.text}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${card} lg:col-span-2`}>
            <div className={cardHeader}>
              <h2 className="text-xl font-semibold text-purple-800 flex items-center">
                <FiTruck className="mr-3 text-purple-600" /> Datos del servicio
              </h2>
            </div>
            <div className="p-6">
              {!active && <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">El servicio está inactivo: activalo para poder editarlo.</p>}
              <OrderForm
                key={order.id + order.supplierName + order.description + order.orderType}
                defaultValues={{ supplierName: order.supplierName, description: order.description, orderType: order.orderType }}
                submitLabel="Guardar cambios"
                submittingLabel="Guardando..."
                disabled={!active}
                onSubmit={async (values) => {
                  const result = await updateOrder(order.id, values);
                  if (!result.ok) return { ok: false, error: result.error };
                  setOrder(result.data);
                  flash("success", "Servicio actualizado correctamente");
                  router.refresh();
                  return { ok: true };
                }}
              />
            </div>
          </div>

          <div className={card}>
            <div className={cardHeader}>
              <h2 className="text-xl font-semibold text-purple-800">Estado del servicio</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                {active
                  ? "Si lo desactivás, deja de aparecer para los residentes al pedir servicios y permisos."
                  : "Al activarlo vuelve a estar disponible para los residentes."}
              </p>
              <button
                type="button"
                onClick={toggleStatus}
                disabled={isChangingStatus}
                className={`w-full py-3 rounded-xl font-semibold text-white transition hover:shadow-lg disabled:opacity-50 ${
                  active ? "bg-linear-to-r from-rose-500 via-pink-500 to-red-400" : "bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-400"
                }`}
              >
                {isChangingStatus ? "Procesando..." : active ? "Desactivar servicio" : "Activar servicio"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
