"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiCheckCircle, FiPlus, FiRefreshCw, FiXCircle } from "react-icons/fi";
import { Estados } from "@/components/estados";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { FieldError } from "@/components/ui/FieldError";
import { Modal, formInputClass, formLabelClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/Modal";
import { LOT_STATE_LABELS, LotState } from "@/types/api";
import type { LotDto } from "@/types/models";
import { createLot, deleteLot, listLots, restoreLot } from "../actions";
import { lotSchema, type LotFormOutput, type LotFormValues } from "../schemas";

const STATE_STYLES: Record<LotState, string> = {
  Inactive: "bg-muted text-foreground",
  Available: "bg-primary-soft text-primary",
  Full: "bg-primary-soft text-primary",
  Maintenance: "bg-warning-soft text-warning",
};

const FILTERS: TableFilter<LotDto>[] = [
  { value: "all", label: "Todos", predicate: () => true },
  ...Object.values(LotState).map((state) => ({
    value: state,
    label: LOT_STATE_LABELS[state],
    predicate: (l: LotDto) => l.lotState === state,
  })),
];

function CreateLotForm({ onDone, onCancel }: { onDone: () => Promise<void>; onCancel: () => void }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LotFormValues, unknown, LotFormOutput>({
    resolver: zodResolver(lotSchema),
    defaultValues: { lotName: "", blockName: "", lotState: LotState.Available },
  });

  const onSubmit = async (values: LotFormOutput) => {
    const result = await createLot(values);
    if (!result.ok) return setError("root", { message: result.error });
    await onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="lotName" className={formLabelClass}>Nombre del lote</label>
        <input id="lotName" className={formInputClass} {...register("lotName")} />
        <FieldError message={errors.lotName?.message} />
      </div>
      <div>
        <label htmlFor="blockName" className={formLabelClass}>Manzana</label>
        <input id="blockName" className={formInputClass} {...register("blockName")} />
        <FieldError message={errors.blockName?.message} />
      </div>
      <div>
        <label htmlFor="lotState" className={formLabelClass}>Estado inicial</label>
        <select id="lotState" className={formInputClass} {...register("lotState")}>
          {Object.values(LotState).map((state) => (
            <option key={state} value={state}>{LOT_STATE_LABELS[state]}</option>
          ))}
        </select>
        <FieldError message={errors.lotState?.message} />
      </div>
      {errors.root?.message && (
        <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">{errors.root.message}</p>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>Cancelar</button>
        <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>{isSubmitting ? "Creando..." : "Crear lote"}</button>
      </div>
    </form>
  );
}

export function LotsTable({ initialLots }: { initialLots: LotDto[] }) {
  const [lots, setLots] = useState(initialLots);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const result = await listLots();
    if (result.ok) {
      setLots(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setIsRefreshing(false);
  }, []);

  const toggle = useCallback(
    async (lot: LotDto) => {
      const result = await (lot.status === "Active" ? deleteLot(lot.lotId) : restoreLot(lot.lotId));
      if (!result.ok) setError(`${lot.lotName}: ${result.error}`);
      await refresh();
    },
    [refresh]
  );

  const columns: Column<LotDto>[] = [
    { key: "name", header: "Lote", sortValue: (l) => l.lotName, cell: (l) => <span className="font-semibold text-foreground">{l.lotName}</span> },
    { key: "block", header: "Manzana", sortValue: (l) => l.blockName, cell: (l) => <span className="text-foreground">{l.blockName}</span> },
    {
      key: "state",
      header: "Estado del lote",
      sortValue: (l) => l.lotState,
      cell: (l) => (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${STATE_STYLES[l.lotState] ?? STATE_STYLES.Inactive}`}>
          {LOT_STATE_LABELS[l.lotState] ?? l.lotState}
        </span>
      ),
    },
    { key: "status", header: "Registro", sortValue: (l) => l.status, cell: (l) => <Estados estado={l.status} /> },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      cell: (l) => (
        <button
          type="button"
          onClick={() => toggle(l)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
            l.status === "Active" ? "bg-danger-soft text-danger hover:bg-danger-soft" : "bg-success-soft text-success hover:bg-success-soft"
          }`}
        >
          {l.status === "Active" ? <FiXCircle /> : <FiCheckCircle />}
          {l.status === "Active" ? "Dar de baja" : "Reactivar"}
        </button>
      ),
    },
  ];

  const count = (state: LotState) => lots.filter((l) => l.status === "Active" && l.lotState === state).length;

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6 bg-background">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 text-primary">
            Gestión de Lotes
          </h1>
          <p className="text-muted-foreground">Lotes y manzanas de la comunidad</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={refresh} disabled={isRefreshing} className="flex items-center px-4 py-2 bg-primary-soft/80 text-primary rounded-xl hover:bg-primary-soft transition disabled:opacity-50">
            <FiRefreshCw className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </button>
          <button type="button" onClick={() => setModalOpen(true)} className="flex items-center px-5 py-2.5 text-white rounded-xl font-medium hover:shadow-lg transition bg-primary">
            <FiPlus className="mr-2" /> Nuevo lote
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total activos", value: lots.filter((l) => l.status === "Active").length },
          { label: "Disponibles", value: count(LotState.Available) },
          { label: "Completos", value: count(LotState.Full) },
          { label: "En mantenimiento", value: count(LotState.Maintenance) },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card/90 p-4 rounded-xl border border-border/50">
            <p className="text-sm text-primary">{kpi.label}</p>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {error && <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">{error}</p>}

      <DataTable
        data={lots}
        columns={columns}
        getRowId={(l) => l.lotId}
        itemLabel="lote"
        pageSize={10}
        searchPlaceholder="Buscar por lote o manzana..."
        getSearchText={(l) => `${l.lotName} ${l.blockName}`}
        filters={FILTERS}
        initialSort={{ key: "block", direction: "asc" }}
        emptyMessage="No se encontraron lotes."
        rowClassName={(l) => (l.status === "Inactive" ? "opacity-60" : undefined)}
      />

      {modalOpen && (
        <Modal title="Nuevo lote" onClose={() => setModalOpen(false)}>
          <CreateLotForm
            onCancel={() => setModalOpen(false)}
            onDone={async () => {
              setModalOpen(false);
              await refresh();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
