"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FiEye, FiPlus, FiRefreshCw, FiTruck } from "react-icons/fi";
import { Estados } from "@/components/estados";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { orderTypeLabel } from "@/types/api";
import type { OrderDto } from "@/types/models";
import { listAllOrders } from "../actions";

// El modal (react-hook-form + zod) se descarga recién cuando se abre
const CreateOrderModal = dynamic(() => import("./CreateOrderModal").then((m) => m.CreateOrderModal));

const FILTERS: TableFilter<OrderDto>[] = [
  { value: "all", label: "Todos", predicate: () => true },
  { value: "active", label: "Activos", predicate: (o) => o.status === "Active" },
  { value: "inactive", label: "Inactivos", predicate: (o) => o.status === "Inactive" },
];

const columns: Column<OrderDto>[] = [
  {
    key: "description",
    header: "Descripción",
    sortValue: (o) => o.description,
    cell: (o) => <span className="font-medium text-foreground">{o.description}</span>,
  },
  {
    key: "supplier",
    header: "Proveedor",
    sortValue: (o) => o.supplierName,
    cell: (o) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-soft/60 rounded-lg" aria-hidden>
          <FiTruck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="font-medium text-foreground">{o.supplierName}</div>
          <div className="text-xs text-muted-foreground">Proveedor asignado</div>
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Tipo",
    sortValue: (o) => orderTypeLabel(o.orderType),
    cell: (o) => (
      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-primary-soft text-primary border border-border">
        {orderTypeLabel(o.orderType)}
      </span>
    ),
  },
  { key: "status", header: "Estado", sortValue: (o) => o.status, cell: (o) => <Estados estado={o.status} /> },
  {
    key: "actions",
    header: "Acciones",
    align: "right",
    cell: (o) => (
      <Link
        href={`/admin/orders/${o.id}`}
        className="inline-flex items-center px-4 py-2 text-on-status rounded-xl text-sm font-medium hover:shadow-lg transition-shadow bg-success"
      >
        <FiEye className="mr-2" /> Ver detalles
      </Link>
    ),
  },
];

export function OrdersTable({ initialOrders }: { initialOrders: OrderDto[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const result = await listAllOrders();
    if (result.ok) {
      setOrders(result.data);
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
            Gestión de Servicios
          </h1>
          <p className="text-muted-foreground">Proveedores y servicios disponibles para la comunidad</p>
        </div>
        <div className="flex items-center gap-3">
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
            Nuevo servicio
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">
          {error}
        </p>
      )}

      <DataTable
        data={orders}
        columns={columns}
        getRowId={(o) => o.id}
        itemLabel="servicio"
        pageSize={8}
        searchPlaceholder="Buscar por descripción o proveedor..."
        getSearchText={(o) => `${o.description} ${o.supplierName} ${orderTypeLabel(o.orderType)}`}
        filters={FILTERS}
        initialSort={{ key: "supplier", direction: "asc" }}
        emptyMessage="No se encontraron servicios."
        rowClassName={(o) => (o.status === "Inactive" ? "opacity-60" : undefined)}
      />

      {modalOpen && <CreateOrderModal onClose={() => setModalOpen(false)} onSuccess={refresh} />}
    </div>
  );
}
