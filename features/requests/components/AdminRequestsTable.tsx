"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, MapPin, RefreshCw, Wrench, XCircle } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { secondaryButtonClass } from "@/components/ui/form";
import { orderTypeLabel } from "@/types/api";
import type { RequestDto } from "@/types/models";
import { listAllRequests, setRequestStatus } from "../actions";
import { requestStatusOf } from "../status";

const isPending = (r: RequestDto) => r.baseEntityStatus !== "Inactive" && r.status === "Pending";

const FILTERS: TableFilter<RequestDto>[] = [
  { value: "pending", label: "Pendientes", predicate: isPending },
  { value: "completed", label: "Resueltas", predicate: (r) => r.baseEntityStatus !== "Inactive" && r.status === "Completed" },
  { value: "cancelled", label: "Canceladas", predicate: (r) => r.baseEntityStatus === "Inactive" || r.status === "Cancelled" },
  { value: "all", label: "Todas", predicate: () => true },
];

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });

/** Bandeja de solicitudes de servicio de los residentes: la administración las resuelve o las rechaza. */
export function AdminRequestsTable({ initialRequests }: { initialRequests: RequestDto[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, confirmDialog] = useConfirm();

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const result = await listAllRequests();
    if (result.ok) setRequests(result.data);
    else toast.error(result.error);
    setIsRefreshing(false);
  }, []);

  const changeStatus = async (r: RequestDto, status: "Completed" | "Cancelled") => {
    const resolving = status === "Completed";
    const ok = await confirm({
      title: resolving ? "¿Marcar la solicitud como resuelta?" : "¿Rechazar la solicitud?",
      message: `${r.user ? `${r.user.name} ${r.user.lastname}` : "Residente"} · ${r.order?.supplierName ?? "Servicio"}: “${r.details}”`,
      confirmLabel: resolving ? "Marcar resuelta" : "Rechazar",
      danger: !resolving,
    });
    if (!ok) return;

    setBusyId(r.id);
    const result = await setRequestStatus(r.id, status);
    setBusyId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(resolving ? "Solicitud resuelta. El residente ya ve el nuevo estado." : "Solicitud rechazada.");
    await refresh();
  };

  const columns: Column<RequestDto>[] = [
    {
      key: "resident",
      header: "Residente",
      sortValue: (r) => `${r.user?.lastname ?? ""} ${r.user?.name ?? ""}`,
      cell: (r) => (
        <>
          <p className="font-medium text-foreground">{r.user ? `${r.user.name} ${r.user.lastname}` : "—"}</p>
          <p className="text-xs text-muted-foreground">{r.user?.email}</p>
        </>
      ),
    },
    {
      key: "service",
      header: "Servicio",
      sortValue: (r) => r.order?.supplierName ?? "",
      cell: (r) => (
        <>
          <p className="font-medium text-foreground">{r.order?.supplierName ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{r.order ? orderTypeLabel(r.order.orderType) : ""}</p>
        </>
      ),
    },
    {
      key: "details",
      header: "Pedido",
      cell: (r) => (
        <div className="max-w-xs">
          <p className="break-words text-foreground">{r.details}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} aria-hidden /> {r.location}
          </p>
        </div>
      ),
    },
    { key: "created", header: "Fecha", sortValue: (r) => new Date(r.createdAt).getTime(), cell: (r) => <span className="whitespace-nowrap">{dateTime(r.createdAt)}</span> },
    {
      key: "status",
      header: "Estado",
      sortValue: (r) => requestStatusOf(r).label,
      cell: (r) => {
        const s = requestStatusOf(r);
        return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>;
      },
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      cell: (r) =>
        isPending(r) ? (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={busyId === r.id}
              onClick={() => changeStatus(r, "Completed")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-success-soft px-3 py-2 text-sm font-medium text-success hover:bg-success/20 disabled:opacity-50"
            >
              <CheckCircle2 size={16} aria-hidden /> Resolver
            </button>
            <button
              type="button"
              disabled={busyId === r.id}
              onClick={() => changeStatus(r, "Cancelled")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger hover:bg-danger/20 disabled:opacity-50"
            >
              <XCircle size={16} aria-hidden /> Rechazar
            </button>
          </div>
        ) : null,
    },
  ];

  const pendingCount = requests.filter(isPending).length;

  return (
    <PageContainer size="wide">
      {confirmDialog}
      <PageHeader
        icon={<Wrench size={24} aria-hidden />}
        title="Solicitudes de servicio"
        description={pendingCount === 0 ? "No hay solicitudes pendientes." : `${pendingCount} ${pendingCount === 1 ? "solicitud pendiente" : "solicitudes pendientes"} de los residentes.`}
        actions={
          <button type="button" onClick={refresh} disabled={isRefreshing} className={secondaryButtonClass}>
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} aria-hidden />
            {isRefreshing ? "Actualizando…" : "Actualizar"}
          </button>
        }
      />
      <DataTable
        data={requests}
        columns={columns}
        getRowId={(r) => r.id}
        itemLabel="solicitud"
        pageSize={10}
        searchPlaceholder="Buscar por residente, servicio o detalle..."
        getSearchText={(r) => `${r.user?.name ?? ""} ${r.user?.lastname ?? ""} ${r.order?.supplierName ?? ""} ${r.details} ${r.location}`}
        filters={FILTERS}
        initialSort={{ key: "created", direction: "desc" }}
        emptyMessage="No hay solicitudes en esta vista."
      />
    </PageContainer>
  );
}
