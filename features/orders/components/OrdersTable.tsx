"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { FiEye, FiPlus, FiRefreshCw, FiTruck } from "react-icons/fi";
import { Estados } from "@/components/estados";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { orderTypeLabel } from "@/types/api";
import type { OrderDto } from "@/types/models";
import { listAllOrders } from "../actions";
import { CreateOrderModal } from "./CreateOrderModal";

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
    cell: (o) => <span className="font-medium text-gray-900">{o.description}</span>,
  },
  {
    key: "supplier",
    header: "Proveedor",
    sortValue: (o) => o.supplierName,
    cell: (o) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100/60 rounded-lg" aria-hidden>
          <FiTruck className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{o.supplierName}</div>
          <div className="text-xs text-gray-500">Proveedor asignado</div>
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Tipo",
    sortValue: (o) => orderTypeLabel(o.orderType),
    cell: (o) => (
      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
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
        className="inline-flex items-center px-4 py-2 text-white rounded-xl text-sm font-medium bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-400 hover:shadow-lg transition-shadow"
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
    <div className="min-h-screen bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent mb-1">
            Gestión de Servicios
          </h1>
          <p className="text-gray-500">Proveedores y servicios disponibles para la comunidad</p>
        </div>
        <div className="flex items-center gap-3">
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
            Nuevo servicio
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
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
