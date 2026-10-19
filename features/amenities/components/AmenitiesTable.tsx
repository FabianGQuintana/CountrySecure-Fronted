"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { FiCalendar, FiEye, FiPlus, FiRefreshCw, FiUsers } from "react-icons/fi";
import { Estados } from "@/components/estados";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import type { AmenityDto } from "@/types/models";
import { createAmenity, listAllAmenities } from "../actions";
import { AmenityForm } from "./AmenityForm";

const FILTERS: TableFilter<AmenityDto>[] = [
  { value: "all", label: "Todos", predicate: () => true },
  { value: "active", label: "Activos", predicate: (a) => a.status === "Active" },
  { value: "inactive", label: "Inactivos", predicate: (a) => a.status === "Inactive" },
];

const columns: Column<AmenityDto>[] = [
  {
    key: "name",
    header: "Amenity",
    sortValue: (a) => a.amenityName,
    cell: (a) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100/60 rounded-lg" aria-hidden>
          <FiCalendar className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{a.amenityName}</div>
          <div className="text-xs text-gray-500 max-w-xs truncate">{a.description}</div>
        </div>
      </div>
    ),
  },
  { key: "schedules", header: "Horarios", sortValue: (a) => a.schedules, cell: (a) => <span className="text-gray-700">{a.schedules}</span> },
  {
    key: "capacity",
    header: "Capacidad",
    sortValue: (a) => a.capacity,
    cell: (a) => (
      <span className="inline-flex items-center gap-1.5 text-gray-700">
        <FiUsers aria-hidden /> {a.capacity}
      </span>
    ),
  },
  { key: "status", header: "Estado", sortValue: (a) => a.status, cell: (a) => <Estados estado={a.status} /> },
  {
    key: "actions",
    header: "Acciones",
    align: "right",
    cell: (a) => (
      <Link
        href={`/admin/amenities/${a.id}`}
        className="inline-flex items-center px-4 py-2 text-white rounded-xl text-sm font-medium bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-400 hover:shadow-lg transition-shadow"
      >
        <FiEye className="mr-2" /> Ver detalles
      </Link>
    ),
  },
];

export function AmenitiesTable({ initialAmenities }: { initialAmenities: AmenityDto[] }) {
  const [amenities, setAmenities] = useState(initialAmenities);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const result = await listAllAmenities();
    if (result.ok) {
      setAmenities(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setIsRefreshing(false);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent mb-1">
            Gestión de Amenities
          </h1>
          <p className="text-gray-500">Espacios comunes disponibles para reservar</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/amenities/solicitudes" className="px-4 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition">
            Ver reservas
          </Link>
          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-purple-100/80 text-purple-700 rounded-xl hover:bg-purple-200 transition disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center px-5 py-2.5 text-white rounded-xl font-medium bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 hover:shadow-lg transition"
          >
            <FiPlus className="mr-2" />
            Nuevo amenity
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <DataTable
        data={amenities}
        columns={columns}
        getRowId={(a) => a.id}
        itemLabel="amenity"
        pageSize={8}
        searchPlaceholder="Buscar por nombre o descripción..."
        getSearchText={(a) => `${a.amenityName} ${a.description} ${a.schedules}`}
        filters={FILTERS}
        initialSort={{ key: "name", direction: "asc" }}
        emptyMessage="No se encontraron amenities."
        rowClassName={(a) => (a.status === "Inactive" ? "opacity-60" : undefined)}
      />

      {modalOpen && (
        <Modal title="Nuevo amenity" onClose={() => setModalOpen(false)}>
          <AmenityForm
            submitLabel="Crear amenity"
            submittingLabel="Creando..."
            onCancel={() => setModalOpen(false)}
            onSubmit={async (values) => {
              const result = await createAmenity(values);
              if (!result.ok) return { ok: false, error: result.error };
              setModalOpen(false);
              await refresh();
              return { ok: true };
            }}
          />
        </Modal>
      )}
    </div>
  );
}
