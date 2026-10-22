"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiCheck } from "react-icons/fi";
import { Estados } from "@/components/estados";
import type { AmenityDto } from "@/types/models";
import { deleteAmenity, restoreAmenity, updateAmenity } from "../actions";
import { AmenityForm } from "./AmenityForm";

const card = "bg-card/90 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 overflow-hidden";
const cardHeader = "px-6 py-4 border-b border-border/50 bg-background";

export function AmenityDetail({ amenity: initialAmenity }: { amenity: AmenityDto }) {
  const router = useRouter();
  const [amenity, setAmenity] = useState(initialAmenity);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const active = amenity.status === "Active";

  const flash = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    if (type === "success") setTimeout(() => setMessage(null), 3000);
  };

  const toggleStatus = async () => {
    setIsChangingStatus(true);
    const result = await (active ? deleteAmenity(amenity.id) : restoreAmenity(amenity.id));
    setIsChangingStatus(false);

    if (!result.ok) return flash("error", result.error);

    setAmenity(result.data);
    flash("success", `Amenity ${result.data.status === "Active" ? "activado" : "desactivado"} correctamente`);
    router.refresh();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        <button type="button" onClick={() => router.back()} className="flex items-center text-primary hover:text-primary group transition-colors">
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a amenities
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {amenity.amenityName}
            </h1>
            <p className="text-muted-foreground mt-1">
              {amenity.schedules} · capacidad {amenity.capacity}
            </p>
          </div>
          <Estados estado={amenity.status} />
        </div>

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${
              message.type === "success" ? "bg-success-soft text-success border border-success/30" : "bg-danger-soft text-danger border border-danger/30"
            }`}
          >
            {message.type === "success" && <FiCheck />} {message.text}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${card} lg:col-span-2`}>
            <div className={cardHeader}>
              <h2 className="text-xl font-semibold text-primary flex items-center">
                <FiCalendar className="mr-3 text-primary" /> Datos del amenity
              </h2>
            </div>
            <div className="p-6">
              {!active && <p className="mb-4 text-sm text-warning bg-warning-soft border border-warning/30 rounded-lg p-3">El amenity está inactivo: activalo para poder editarlo.</p>}
              <AmenityForm
                key={`${amenity.id}-${amenity.lastModifiedAt}`}
                defaultValues={{
                  amenityName: amenity.amenityName,
                  description: amenity.description,
                  schedules: amenity.schedules,
                  capacity: amenity.capacity,
                }}
                submitLabel="Guardar cambios"
                submittingLabel="Guardando..."
                disabled={!active}
                onSubmit={async (values) => {
                  const result = await updateAmenity(amenity.id, values);
                  if (!result.ok) return { ok: false, error: result.error };
                  setAmenity(result.data);
                  flash("success", "Amenity actualizado correctamente");
                  router.refresh();
                  return { ok: true };
                }}
              />
            </div>
          </div>

          <div className={card}>
            <div className={cardHeader}>
              <h2 className="text-xl font-semibold text-primary">Estado del amenity</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                {active
                  ? "Si lo desactivás, los residentes dejan de poder reservarlo."
                  : "Al activarlo vuelve a estar disponible para reservas."}
              </p>
              <button
                type="button"
                onClick={toggleStatus}
                disabled={isChangingStatus}
                className={`w-full py-3 rounded-xl font-semibold text-white transition hover:shadow-lg disabled:opacity-50 ${
                  active ? "bg-danger" : "bg-success"
                }`}
              >
                {isChangingStatus ? "Procesando..." : active ? "Desactivar amenity" : "Activar amenity"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
