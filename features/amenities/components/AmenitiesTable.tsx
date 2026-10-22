"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FiCalendar, FiEye, FiPlus, FiRefreshCw, FiUsers } from "react-icons/fi";
import { Estados } from "@/components/estados";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import type { AmenityDto } from "@/types/models";
import { createAmenity, listAllAmenities } from "../actions";

// El formulario (react-hook-form + zod) se descarga recién cuando se abre el modal
const AmenityForm = dynamic(() => import("./AmenityForm").then((m) => m.AmenityForm));

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
        <div className="p-2 bg-primary-soft/60 rounded-lg" aria-hidden>
          <FiCalendar className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-foreground">{a.amenityName}</div>
          <div className="text-xs text-muted-foreground max-w-xs truncate">{a.description}</div>
        </div>
      </div>
    ),
  },
  { key: "schedules", header: "Horarios", sortValue: (a) => a.schedules, cell: (a) => <span className="text-foreground">{a.schedules}</span> },
  {
    key: "capacity",
    header: "Capacidad",
    sortValue: (a) => a.capacity,
    cell: (a) => (
      <span className="inline-flex items-center gap-1.5 text-foreground">
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
        className="inline-flex items-center px-4 py-2 text-on-status rounded-xl text-sm font-medium hover:shadow-lg transition-shadow bg-success"
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
    <div className="min-h-screen p-4 md:p-8 space-y-6 bg-background">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 text-primary">
            Gestión de Amenities
          </h1>
          <p className="text-muted-foreground">Espacios comunes disponibles para reservar</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/reservas" className="px-4 py-2 rounded-xl border border-border text-primary hover:bg-primary-soft transition">
            Ver reservas
          </Link>
          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-primary-soft/80 text-primary rounded-xl hover:bg-primary-soft transition disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center px-5 py-2.5 text-white rounded-xl font-medium hover:shadow-lg transition bg-primary"
          >
            <FiPlus className="mr-2" />
            Nuevo amenity
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">
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
