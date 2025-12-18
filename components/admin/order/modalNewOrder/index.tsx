"use client";
import { useState } from "react";
import { newOrder } from "@/actions/orderActions";
import { FiX } from "react-icons/fi";
import { IOrderRegister, OrderStatus } from "@/types";

interface ModalNewOrderProps {
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
}

export default function ModalNewOrder({
  onClose,
  onSuccess,
}: ModalNewOrderProps) {
  const [description, setDescription] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [orderType, setOrderType] = useState<OrderStatus | "">("");
  const [requestIds, setRequestIds] = useState("");
  const [entryPermissionIds, setEntryPermissionIds] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setDescription("");
    setSupplierName("");
    setOrderType("");
    setRequestIds("");
    setEntryPermissionIds("");
    setErrorMsg(null);
  };

  const parseIds = (text: string): string[] | undefined => {
    if (!text.trim()) return undefined;
    return text.split(",").map((x) => x.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !supplierName || !orderType) {
      setErrorMsg("Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      await newOrder({
        description,
        supplierName,
        orderType: Number(orderType),
        requestIds: parseIds(requestIds),
        entryPermissionIds: parseIds(entryPermissionIds),
      } as IOrderRegister);

      if (onSuccess) await onSuccess();
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creando order:", error);
      setErrorMsg(error.message || "Error al crear la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={26} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">Nueva Orden</h2>
          <p className="text-sm text-gray-600 mt-1">
            Completa los datos para registrar una nueva orden
          </p>
          {errorMsg && <p className="mt-3 text-red-500">{errorMsg}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Reparación de pérdida de agua"
            />
          </div>

          {/* supplierName */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proveedor
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Carlos López"
            />
          </div>

          {/* orderType */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Orden
            </label>
            <select
              value={orderType}
              onChange={(e) =>
                setOrderType(e.target.value as unknown as OrderStatus)
              }
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">Selecciona un tipo...</option>
              {Object.entries(OrderStatus)
                .filter(([, v]) => typeof v === "number")
                .map(([key, value]) => (
                  <option key={value} value={value}>
                    {key}
                  </option>
              ))}

            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-500 transition disabled:opacity-70"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
