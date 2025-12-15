"use client";

import { useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { OrderStatus, orderStatusToText } from "@/types/order";

interface ModalNewOrderProps {
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}

export default function ModalNewOrder({
  onClose,
  onSuccess,
}: ModalNewOrderProps) {
  const [description, setDescription] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [orderType, setOrderType] = useState<OrderStatus>(
    OrderStatus.Gardening
  );
  const [typeOpen, setTypeOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setDescription("");
    setSupplierName("");
    setOrderType(OrderStatus.Gardening);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !supplierName) {
      setErrorMsg("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      await newOrder({
        description,
        supplierName,
        orderType,
      });

      onClose();
      if (onSuccess) await onSuccess();
      resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600"
        >
          <FiX size={26} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">
            Nuevo Servicio
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Crear nueva orden de servicio
          </p>
          {errorMsg && <p className="mt-3 text-red-500">{errorMsg}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium">
              Descripción
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium">
              Proveedor
            </label>
            <input
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Tipo de Servicio */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Tipo de Servicio
            </label>

            <button
              type="button"
              onClick={() => setTypeOpen(!typeOpen)}
              className="w-full border p-2 rounded-lg flex justify-between"
            >
              {orderStatusToText(orderType)}
              <FiChevronDown
                className={`transition ${typeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {typeOpen && (
              <div className="absolute w-full bg-white border rounded-lg mt-1 z-10">
                {Object.values(OrderStatus)
                .filter((v): v is OrderStatus => typeof v === "number")
                .map((status) => (
                    <div
                    key={status}
                    onClick={() => {
                        setOrderType(status);
                        setTypeOpen(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                    >
                    {orderStatusToText(status)}
                    </div>
                ))}

              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-900 text-white rounded-lg"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
