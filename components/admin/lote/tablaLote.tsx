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
    color: "bg-linear-to-r from-gray-100 to-gray-200 text-gray-700",
    icon: XCircle,
  },
  [LotState.Available]: {
    label: "Disponible",
    color: "bg-linear-to-r from-purple-50 to-violet-100 text-purple-700",
    icon: CheckCircle,
  },
  [LotState.Full]: {
    label: "Lleno",
    color: "bg-linear-to-r from-violet-50 to-indigo-100 text-violet-700",
    icon: Users,
  },
  [LotState.Maintenance]: {
    label: "Mantenimiento",
    color: "bg-linear-to-r from-amber-50 to-orange-100 text-amber-700",
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
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-linear-to-r from-gray-100 to-gray-200 text-gray-700">
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
    <div className="flex-1 p-4 md:p-6 bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              Gestión de Lotes
            </h1>
            <p className="text-gray-600 mt-1">
              Administra todos los lotes registrados
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="hover:cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:via-violet-700 hover:to-pink-600 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Nuevo Lote
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-purple-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  {processedLotes.length}
                </p>
              </div>
              <div className="p-2 bg-linear-to-r from-purple-100 to-violet-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-purple-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Disponibles</p>
                <p className="text-xl font-bold text-purple-600">
                  {
                    processedLotes.filter(
                      (l) => l.LotStatus === LotState.Available
                    ).length
                  }
                </p>
              </div>
              <div className="p-2 bg-linear-to-r from-purple-100 to-violet-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-purple-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600">Llenos</p>
                <p className="text-xl font-bold text-violet-600">
                  {
                    processedLotes.filter((l) => l.LotStatus === LotState.Full)
                      .length
                  }
                </p>
              </div>
              <div className="p-2 bg-linear-to-r from-violet-100 to-indigo-100 rounded-lg">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-purple-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Mantenimiento</p>
                <p className="text-xl font-bold text-amber-600">
                  {
                    processedLotes.filter(
                      (l) => l.LotStatus === LotState.Maintenance
                    ).length
                  }
                </p>
              </div>
              <div className="p-2 bg-linear-to-r from-amber-100 to-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-purple-200/50 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o manzana..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-linear-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 border border-purple-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tabla compacta */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-purple-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-purple-50 via-violet-50 to-pink-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-purple-700">
                  Nombre
                </th>
                <th className="p-4 text-left text-sm font-semibold text-purple-700">
                  Manzana
                </th>
                <th className="p-4 text-left text-sm font-semibold text-purple-700">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-purple-100">
              {filteredLotes.length > 0 ? (
                filteredLotes.map((lote) => (
                  <tr
                    key={lote.lotId}
                    className="hover:bg-linear-to-r hover:from-purple-50/30 hover:to-violet-50/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-linear-to-r from-purple-100 to-violet-100 rounded">
                          <Building className="w-4 h-4 text-purple-600" />
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
                      <Search className="w-12 h-12 mb-3 text-purple-300" />
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
          <div className="px-4 py-3 border-t border-purple-200 bg-linear-to-r from-purple-50 via-violet-50 to-pink-50 text-sm text-purple-600">
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
