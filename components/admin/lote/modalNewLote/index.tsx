"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

import { newLote } from "@/actions/propiedadLoteActions";
import { LotState, ILoteForm } from "@/types/";

interface ModalNewLoteProps {
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
}

export default function ModalNewLote({
  onClose,
  onSuccess,
}: ModalNewLoteProps) {
  // 👉 Estado del formulario (frontend)
  const [form, setForm] = useState<ILoteForm>({
    lotName: "",
    blockName: "",
    lotStatus: LotState.Available,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      lotName: "",
      blockName: "",
      lotStatus: LotState.Available,
    });
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.lotName || !form.blockName) {
      setErrorMsg("Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      await newLote({
        lotName: form.lotName,
        blockName: form.blockName,
        lotState: form.lotStatus,
      });

      resetForm();
      onClose();
      if (onSuccess) await onSuccess();
    } catch (error: any) {
      console.error("Error creando lote:", error);
      setErrorMsg(error.message || "Error al crear el lote");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={26} />
        </button>

        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">Nuevo Lote</h2>
          <p className="text-sm text-gray-600 mt-1">
            Completa los datos del lote
          </p>
          {errorMsg && <p className="mt-3 text-red-500">{errorMsg}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del lote
            </label>
            <input
              type="text"
              value={form.lotName}
              onChange={(e) => setForm({ ...form, lotName: e.target.value })}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Lote 12"
            />
          </div>

          {/* Bloque */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manzana / Bloque
            </label>
            <input
              type="text"
              value={form.blockName}
              onChange={(e) => setForm({ ...form, blockName: e.target.value })}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Manzana B"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado del lote
            </label>
            <select
              value={form.lotStatus}
              onChange={(e) =>
                setForm({
                  ...form,
                  lotStatus: Number(e.target.value) as LotState,
                })
              }
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value={LotState.Available}>Disponible</option>
              <option value={LotState.Inactive}>Inactivo</option>
              <option value={LotState.Full}>Completo</option>
              <option value={LotState.Maintenance}>Mantenimiento</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-500 disabled:opacity-70"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
