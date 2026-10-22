"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, QrCode, XCircle } from "lucide-react";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { primaryButtonClass } from "@/components/ui/form";
import { PassCard } from "@/components/pass/PassCard";
import { cancelPermission, fetchPass, listMyPermissions } from "@/features/entry-permissions/actions";
import { PASS_TYPE_LABELS } from "@/types/api";
import type { EntryPermissionDto, PassDto } from "@/types/models";

type DisplayStatus = "Vigente" | "Dentro" | "Utilizado" | "Vencido" | "Cancelado";

const STATUS_STYLES: Record<DisplayStatus, string> = {
  Vigente: "bg-success-soft text-success",
  Dentro: "bg-info-soft text-info",
  Utilizado: "bg-muted text-foreground",
  Vencido: "bg-muted text-muted-foreground",
  Cancelado: "bg-danger-soft text-danger",
};

// Un pase de varios ingresos sigue vigente después de usarse, mientras no venza
function displayStatus(p: EntryPermissionDto, now: number): DisplayStatus {
  if (p.status === "Cancelled" || p.baseEntityStatus === "Inactive") return "Cancelado";
  if (p.entryTime && !p.departureTime) return "Dentro";
  if (p.entryTime && p.passType === "SingleEntry") return "Utilizado";
  if (p.status === "Expired" || (p.validTo && new Date(p.validTo).getTime() < now)) return "Vencido";
  return "Vigente";
}

const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }) : "—";

export default function MyPassesPage() {
  const [permissions, setPermissions] = useState<EntryPermissionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openPass, setOpenPass] = useState<PassDto | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, confirmDialog] = useConfirm();

  const load = useCallback(async () => {
    const result = await listMyPermissions();
    if (result.ok) setPermissions(result.data.filter((p) => p.type === "Visit"));
    else toast.error(result.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
    load();
  }, [load]);

  const showPass = async (id: string) => {
    setBusyId(id);
    const result = await fetchPass(id);
    setBusyId(null);
    if (result.ok) setOpenPass(result.data);
    else toast.error(result.error);
  };

  const cancel = async (id: string) => {
    if (!(await confirm({ title: "¿Cancelar este pase?", message: "El código QR dejará de funcionar y la visita no podrá ingresar con él.", confirmLabel: "Cancelar pase", danger: true }))) return;
    setBusyId(id);
    const result = await cancelPermission(id);
    setBusyId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Pase cancelado.");
    await load();
  };

  // eslint-disable-next-line react-hooks/purity -- el estado de cada pase depende de la hora actual
  const now = Date.now();

  const columns: Column<EntryPermissionDto>[] = [
    {
      key: "visitor",
      header: "Visitante",
      sortValue: (p) => `${p.visitor.lastNameVisit} ${p.visitor.nameVisit}`,
      cell: (p) => (
        <>
          <p className="font-medium text-foreground">
            {p.visitor.nameVisit} {p.visitor.lastNameVisit}
          </p>
          <p className="text-xs text-muted-foreground">
            DNI {p.visitor.dniVisit}
            {p.companionsCount > 0 ? ` · +${p.companionsCount}` : ""}
            {p.vehiclePlate ? ` · ${p.vehiclePlate}` : ""}
          </p>
        </>
      ),
    },
    { key: "passType", header: "Tipo de pase", cell: (p) => PASS_TYPE_LABELS[p.passType] ?? "—" },
    {
      key: "validity",
      header: "Vigencia",
      sortValue: (p) => new Date(p.validFrom).getTime(),
      cell: (p) => (
        <span className="text-xs text-muted-foreground">
          {formatDateTime(p.validFrom)}
          <br />
          hasta {formatDateTime(p.validTo)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      sortValue: (p) => displayStatus(p, now),
      cell: (p) => {
        const status = displayStatus(p, now);
        return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>{status}</span>;
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (p) => {
        const status = displayStatus(p, now);
        const canCancel = status === "Vigente" && !p.entryTime;
        return (
          <div className="flex justify-end gap-2">
            {status !== "Cancelado" && (
              <button
                type="button"
                onClick={() => showPass(p.id)}
                disabled={busyId === p.id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-soft disabled:opacity-50"
              >
                <QrCode size={16} aria-hidden /> Ver pase
              </button>
            )}
            {canCancel && (
              <button
                type="button"
                onClick={() => cancel(p.id)}
                disabled={busyId === p.id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger-soft disabled:opacity-50"
              >
                <XCircle size={16} aria-hidden /> Cancelar
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const filters: TableFilter<EntryPermissionDto>[] = [
    { value: "all", label: "Todos", predicate: () => true },
    ...(["Vigente", "Dentro", "Utilizado", "Vencido", "Cancelado"] as DisplayStatus[]).map((status) => ({
      value: status,
      label: status,
      predicate: (p: EntryPermissionDto) => displayStatus(p, now) === status,
    })),
  ];

  return (
    <PageContainer size="wide">
      <PageHeader
        icon={<QrCode size={24} aria-hidden />}
        title="Mis pases"
        description="Pases de ingreso que generaste para tus visitas. Descargalos o compartilos otra vez cuando quieras."
        actions={
          <Link href="/resident/permits" className={primaryButtonClass}>
            <Plus size={18} aria-hidden /> Nuevo pase
          </Link>
        }
      />

      {confirmDialog}
      <DataTable
        data={permissions}
        columns={columns}
        getRowId={(p) => p.id}
        getSearchText={(p) => `${p.visitor.nameVisit} ${p.visitor.lastNameVisit} ${p.visitor.dniVisit} ${p.vehiclePlate ?? ""}`}
        searchPlaceholder="Buscar por nombre, DNI o patente..."
        filters={filters}
        isLoading={isLoading}
        emptyMessage="Todavía no generaste ningún pase."
        itemLabel="pase"
        initialSort={{ key: "validity", direction: "desc" }}
      />

      {openPass && (
        <Modal title="Pase de ingreso" onClose={() => setOpenPass(null)} maxWidth="max-w-2xl">
          <PassCard pass={openPass} />
        </Modal>
      )}
    </PageContainer>
  );
}
