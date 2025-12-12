"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { IOrder, OrderStatus } from "@/types";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiClipboard,
  FiSave,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { AltaBaja, updateOrder } from "@/actions/orderActions";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session } = useSession();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estadoOrder, setEstadoOrder] = useState(false); // true = Active
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    orderType: OrderStatus.Jardineria,
  });

  // Cargar datos de la orden
  useEffect(() => {
    if (!session) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/order/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("No se pudo obtener la orden");

        const data: IOrder = await res.json();
        setOrder(data);
        setEstadoOrder(data.status === "Active");
        setFormData({
          description: data.description,
          orderType: data.orderType,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, session]);

  // Toggle estado de la orden
  const toggleEstadoOrder = async () => {
    try {
      setIsChangingStatus(true);
      const res = await AltaBaja(id);
      const newStatus = res.order.status === "Active";
      setEstadoOrder(newStatus);

      setOrder((prev) =>
        prev ? { ...prev, status: newStatus ? "Active" : "Inactive" } : prev
      );

      setSuccessMessage(
        `Orden ${newStatus ? "activada" : "desactivada"} correctamente`
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError("No se pudo actualizar el estado de la orden");
      console.error(err);
    } finally {
      setIsChangingStatus(false);
    }
  };

  // Manejar cambios del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar cambios de la orden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      setLoading(true);
      const updated = await updateOrder(id, formData);
      setOrder(updated);
      setSuccessMessage("Orden actualizada correctamente");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError("No se pudo actualizar la orden");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!order) return null;

  const getOrderTypeName = (type: OrderStatus) => {
    switch (type) {
      case OrderStatus.Jardineria:
        return "Jardinería";
      case OrderStatus.Plomeria:
        return "Plomería";
      case OrderStatus.Electricidad:
        return "Electricidad";
      case OrderStatus.Limpieza:
        return "Limpieza";
      case OrderStatus.MantenimientoGeneral:
        return "Mantenimiento General";
      case OrderStatus.Piscina:
        return "Piscina";
      case OrderStatus.Seguridad:
        return "Seguridad";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      {/* Mensaje de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-green-500 text-white p-4 rounded-2xl shadow-2xl">
              <p>{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 max-w-4xl mx-auto"
          >
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start">
              <FiAlertCircle className="w-6 h-6 text-rose-600 mr-4 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-rose-800 mb-1">Error</h3>
                <p className="text-rose-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-rose-600 hover:text-rose-800 font-medium px-3 py-1 rounded-lg bg-rose-100 transition"
                >
                  Descartar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Volver */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <FiArrowLeft className="mr-2" />
        Volver a órdenes
      </button>

      {/* Formulario editable */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-6 space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold mb-2">{order.supplierName}</h1>
          <p className="text-gray-600 flex items-center">
            <FiClipboard className="mr-2" />
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            >
              {Object.values(OrderStatus)
                .filter((v) => typeof v === "number")
                .map((v) => (
                  <option key={v} value={v}>
                    {getOrderTypeName(v as OrderStatus)}
                  </option>
                ))}
            </select>
          </p>
        </div>

        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Estado toggle */}
        <div className="flex items-center space-x-4">
          <div
            onClick={toggleEstadoOrder}
            className={`relative inline-flex h-7 w-14 items-center rounded-full cursor-pointer transition-all duration-300 ${
              estadoOrder ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                estadoOrder ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </div>
          <span
            className={`font-semibold ${
              estadoOrder ? "text-green-600" : "text-red-600"
            }`}
          >
            {estadoOrder ? "Activo" : "Inactivo"}
          </span>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          <FiSave className="inline mr-2" /> Guardar Cambios
        </button>
      </form>
    </div>
  );
}
