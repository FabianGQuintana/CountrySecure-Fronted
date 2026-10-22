"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiCheckCircle, FiPlus, FiRefreshCw, FiUserCheck, FiXCircle } from "react-icons/fi";
import { Estados } from "@/components/estados";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { FieldError } from "@/components/ui/FieldError";
import { Modal, formInputClass, formLabelClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/Modal";
import type { LotDto, PropertyDto, UserDto } from "@/types/models";
import { createProperty, deleteProperty, listProperties, restoreProperty, updateProperty } from "../actions";
import { propertySchema, type PropertyFormOutput, type PropertyFormValues } from "../schemas";

const STATUS_LABELS: Record<string, string> = {
  Inactive: "Inactiva",
  Occupied: "Ocupada",
  Available: "Disponible",
  NewBrand: "A estrenar",
};

const FILTERS: TableFilter<PropertyDto>[] = [
  { value: "all", label: "Todas", predicate: () => true },
  { value: "assigned", label: "Con propietario", predicate: (p) => Boolean(p.ownerName) },
  { value: "free", label: "Sin propietario", predicate: (p) => !p.ownerName },
];

function CreatePropertyForm({ lots, onDone, onCancel }: { lots: LotDto[]; onDone: () => Promise<void>; onCancel: () => void }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues, unknown, PropertyFormOutput>({
    resolver: zodResolver(propertySchema),
    defaultValues: { street: "", propertyNumber: "", lotId: "" },
  });

  const onSubmit = async (values: PropertyFormOutput) => {
    const result = await createProperty(values);
    if (!result.ok) return setError("root", { message: result.error });
    await onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="street" className={formLabelClass}>Calle</label>
          <input id="street" className={formInputClass} {...register("street")} />
          <FieldError message={errors.street?.message} />
        </div>
        <div>
          <label htmlFor="propertyNumber" className={formLabelClass}>Número</label>
          <input id="propertyNumber" inputMode="numeric" className={formInputClass} {...register("propertyNumber")} />
          <FieldError message={errors.propertyNumber?.message} />
        </div>
      </div>
      <div>
        <label htmlFor="lotId" className={formLabelClass}>Lote</label>
        <select id="lotId" className={formInputClass} {...register("lotId")}>
          <option value="">Seleccioná un lote...</option>
          {lots.map((lot) => (
            <option key={lot.lotId} value={lot.lotId}>{lot.blockName} · {lot.lotName}</option>
          ))}
        </select>
        <FieldError message={errors.lotId?.message} />
      </div>
      {errors.root?.message && <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">{errors.root.message}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>Cancelar</button>
        <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>{isSubmitting ? "Creando..." : "Crear propiedad"}</button>
      </div>
    </form>
  );
}

function AssignOwnerForm({
  property,
  residents,
  onDone,
  onCancel,
}: {
  property: PropertyDto;
  residents: UserDto[];
  onDone: () => Promise<void>;
  onCancel: () => void;
}) {
  const [ownerId, setOwnerId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) return setError("Elegí un residente.");
    setSaving(true);
    const result = await updateProperty(property.propertyId, { userId: ownerId });
    setSaving(false);
    if (!result.ok) return setError(result.error);
    await onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {property.street} {property.propertyNumber} · {property.lotName}
        {property.ownerName ? <> · propietario actual: <b>{property.ownerName}</b></> : null}
      </p>
      <div>
        <label htmlFor="owner" className={formLabelClass}>Nuevo propietario</label>
        <select id="owner" className={formInputClass} value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
          <option value="">Seleccioná un residente...</option>
          {residents.filter((r) => r.active).map((r) => (
            <option key={r.id} value={r.id}>{r.lastname}, {r.name} ({r.email})</option>
          ))}
        </select>
      </div>
      {error && <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>Cancelar</button>
        <button type="submit" disabled={saving} className={primaryButtonClass}>{saving ? "Guardando..." : "Asignar"}</button>
      </div>
    </form>
  );
}

export function PropertiesTable({
  initialProperties,
  lots,
  residents,
}: {
  initialProperties: PropertyDto[];
  lots: LotDto[];
  residents: UserDto[];
}) {
  const [properties, setProperties] = useState(initialProperties);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [assigning, setAssigning] = useState<PropertyDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const result = await listProperties();
    if (result.ok) {
      setProperties(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setIsRefreshing(false);
  }, []);

  const toggle = useCallback(
    async (p: PropertyDto) => {
      const result = await (p.statusAuditoria === "Active" ? deleteProperty(p.propertyId) : restoreProperty(p.propertyId));
      if (!result.ok) setError(`${p.street} ${p.propertyNumber}: ${result.error}`);
      await refresh();
    },
    [refresh]
  );

  const columns: Column<PropertyDto>[] = [
    {
      key: "address",
      header: "Dirección",
      sortValue: (p) => `${p.street} ${String(p.propertyNumber).padStart(6, "0")}`,
      cell: (p) => <span className="font-semibold text-foreground">{p.street} {p.propertyNumber}</span>,
    },
    { key: "lot", header: "Lote", sortValue: (p) => p.lotName ?? "", cell: (p) => <span className="text-foreground">{p.lotName ?? "—"}</span> },
    { key: "owner", header: "Propietario", sortValue: (p) => p.ownerName ?? "", cell: (p) => <span className="text-foreground">{p.ownerName ?? "Sin asignar"}</span> },
    {
      key: "state",
      header: "Estado",
      sortValue: (p) => p.propertyStatus,
      cell: (p) => (
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-primary-soft text-primary">
          {STATUS_LABELS[p.propertyStatus] ?? p.propertyStatus}
        </span>
      ),
    },
    { key: "status", header: "Registro", sortValue: (p) => p.statusAuditoria, cell: (p) => <Estados estado={p.statusAuditoria} /> },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      cell: (p) => (
        <div className="flex justify-end gap-2">
          {p.statusAuditoria === "Active" && (
            <button type="button" onClick={() => setAssigning(p)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary-soft text-primary hover:bg-primary-soft transition">
              <FiUserCheck /> Asignar
            </button>
          )}
          <button
            type="button"
            onClick={() => toggle(p)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              p.statusAuditoria === "Active" ? "bg-danger-soft text-danger hover:bg-danger-soft" : "bg-success-soft text-success hover:bg-success-soft"
            }`}
          >
            {p.statusAuditoria === "Active" ? <FiXCircle /> : <FiCheckCircle />}
            {p.statusAuditoria === "Active" ? "Dar de baja" : "Reactivar"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6 bg-background">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 text-primary">
            Gestión de Propiedades
          </h1>
          <p className="text-muted-foreground">Viviendas de la comunidad y su propietario</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={refresh} disabled={isRefreshing} className="flex items-center px-4 py-2 bg-primary-soft/80 text-primary rounded-xl hover:bg-primary-soft transition disabled:opacity-50">
            <FiRefreshCw className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </button>
          <button type="button" onClick={() => setCreateOpen(true)} className="flex items-center px-5 py-2.5 text-white rounded-xl font-medium hover:shadow-lg transition bg-primary">
            <FiPlus className="mr-2" /> Nueva propiedad
          </button>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">{error}</p>}

      <DataTable
        data={properties}
        columns={columns}
        getRowId={(p) => p.propertyId}
        itemLabel="propiedad"
        pageSize={10}
        searchPlaceholder="Buscar por calle, lote o propietario..."
        getSearchText={(p) => `${p.street} ${p.propertyNumber} ${p.lotName ?? ""} ${p.ownerName ?? ""}`}
        filters={FILTERS}
        initialSort={{ key: "address", direction: "asc" }}
        emptyMessage="No se encontraron propiedades."
        rowClassName={(p) => (p.statusAuditoria === "Inactive" ? "opacity-60" : undefined)}
      />

      {createOpen && (
        <Modal title="Nueva propiedad" onClose={() => setCreateOpen(false)}>
          <CreatePropertyForm
            lots={lots.filter((l) => l.status === "Active")}
            onCancel={() => setCreateOpen(false)}
            onDone={async () => {
              setCreateOpen(false);
              await refresh();
            }}
          />
        </Modal>
      )}

      {assigning && (
        <Modal title="Asignar propietario" onClose={() => setAssigning(null)}>
          <AssignOwnerForm
            property={assigning}
            residents={residents}
            onCancel={() => setAssigning(null)}
            onDone={async () => {
              setAssigning(null);
              await refresh();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
