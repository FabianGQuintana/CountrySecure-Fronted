"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Search,
  FileText,
  Building,
} from "lucide-react";
import ModalNewLote from "./modalNewLote";
import { LotState } from "@/types";

interface TablaLotesProps {
  lotes: any[];
}

// Configuración de estados del lote - version compacta
const LOT_STATE_CONFIG = {
  [LotState.Inactive]: {
    label: "Inactivo",
    color: "bg-gray-100 text-gray-700",
    icon: XCircle,
  },
  [LotState.Available]: {
    label: "Disponible",
    color: "bg-green-50 text-green-700",
    icon: CheckCircle,
  },
  [LotState.Full]: {
    label: "Lleno",
    color: "bg-blue-50 text-blue-700",
    icon: Users,
  },
  [LotState.Maintenance]: {
    label: "Mantenimiento",
    color: "bg-amber-50 text-amber-700",
    icon: AlertCircle,
  },
} as const;

const getLotStatusValue = (lote: any): LotState => {
  const possibleStates = [
    lote.LotStatus,
    lote.lotStatus,
    lote.lotState,
    lote.status,
    lote.LotState,
  ];

  for (const state of possibleStates) {
    if (state !== undefined && state !== null) {
      const numericValue = Number(state);
      if (
        !isNaN(numericValue) &&
        Object.values(LotState).includes(numericValue)
      ) {
        return numericValue as LotState;
      }
      if (typeof state === "string") {
        const lowerState = state.toLowerCase();
        if (lowerState === "available" || lowerState === "disponible")
          return LotState.Available;
        if (lowerState === "full" || lowerState === "lleno")
          return LotState.Full;
        if (lowerState === "maintenance" || lowerState === "mantenimiento")
          return LotState.Maintenance;
        if (lowerState === "inactive" || lowerState === "inactivo")
          return LotState.Inactive;
      }
    }
  }

  return LotState.Inactive;
};

const EstadoBadge = ({ estado }: { estado: LotState }) => {
  const stateConfig = LOT_STATE_CONFIG[estado];

  if (!stateConfig) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
        <XCircle className="w-3 h-3" />
        Inactivo
      </span>
    );
  }

  const Icon = stateConfig.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${stateConfig.color}`}
    >
      <Icon className="w-3 h-3" />
      {stateConfig.label}
    </span>
  );
};

export default function TablaLotes({ lotes }: TablaLotesProps) {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const processedLotes = lotes.map((lote) => ({
    ...lote,
    lotName: lote.lotName || lote.LotName || "Sin nombre",
    blockName: lote.blockName || "No asignada",
    LotStatus: getLotStatusValue(lote),
  }));

  const filteredLotes = processedLotes.filter((lote) => {
    const matchesSearch =
      lote.lotName?.toLowerCase().includes(search.toLowerCase()) ||
      lote.blockName?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-1 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Lotes
            </h1>
            <p className="text-gray-600 mt-1">
              Administra todos los lotes registrados
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Nuevo Lote
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  {processedLotes.length}
                </p>
              </div>
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-xl font-bold text-green-600">
                  {
                    processedLotes.filter(
                      (l) => l.LotStatus === LotState.Available
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Llenos</p>
                <p className="text-xl font-bold text-blue-600">
                  {
                    processedLotes.filter((l) => l.LotStatus === LotState.Full)
                      .length
                  }
                </p>
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mantenimiento</p>
                <p className="text-xl font-bold text-amber-600">
                  {
                    processedLotes.filter(
                      (l) => l.LotStatus === LotState.Maintenance
                    ).length
                  }
                </p>
              </div>
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o manzana..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tabla compacta */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Nombre
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Manzana
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredLotes.length > 0 ? (
                filteredLotes.map((lote) => (
                  <tr key={lote.lotId} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 rounded">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="font-medium text-gray-900">
                          {lote.lotName}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-700">{lote.blockName}</span>
                    </td>
                    <td className="p-4">
                      <EstadoBadge estado={lote.LotStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="font-medium text-gray-600 mb-1">
                        No se encontraron lotes
                      </p>
                      <p className="text-sm text-gray-500">
                        {search
                          ? "Intenta con otros términos de búsqueda"
                          : "No hay lotes registrados"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer simple */}
        {filteredLotes.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
            Mostrando {filteredLotes.length} de {processedLotes.length} lotes
          </div>
        )}
      </div>

      {/* Modal */}
      {openModal && (
        <ModalNewLote
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
