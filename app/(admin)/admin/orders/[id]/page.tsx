"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { IOrder, OrderStatus } from "@/types";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiClipboard,
  FiSave,
  FiEdit2,
  FiCheck,
  FiX,
  FiAlignLeft,
  FiShield,
  FiUser,
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
  const [estadoOrder, setEstadoOrder] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    orderType: OrderStatus.Gardening,
  });

  // Cargar datos
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

  // Cambiar estado Alta/Baja
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

      // Si está INACTIVA → volvemos atrás
      if (!newStatus) {
        setTimeout(() => router.back(), 800);
      }

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError("No se pudo actualizar el estado de la orden");
      console.error(err);
    } finally {
      setIsChangingStatus(false);
    }
  };

  // Inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!estadoOrder) {
      setError("No se puede editar una orden inactiva.");
      return;
    }

    try {
      setLoading(true);
      await updateOrder(id, formData);

      setSuccessMessage("Orden actualizada correctamente");
      setShowSuccess(true);

      // Volvemos atrás después de editar
      setTimeout(() => router.back(), 800);
    } catch (err) {
      setError("No se pudo actualizar la orden");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderTypeName = (type: OrderStatus) => {
    switch (type) {
      case OrderStatus.Gardening:
        return "Jardinería";
      case OrderStatus.Plumbing:
        return "Plomería";
      case OrderStatus.Electrical:
        return "Electricidad";
      case OrderStatus.Cleaning:
        return "Limpieza";
      case OrderStatus.GeneralMaintenance:
        return "Mantenimiento General";
      case OrderStatus.Pool:
        return "Piscina";
      case OrderStatus.Security:
        return "Seguridad";
      default:
        return "Desconocido";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white/90 to-pink-50/80 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-600 font-medium">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white/90 to-gray-100 p-4 md:p-8">
      {/* Notificación de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white p-4 rounded-2xl shadow-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg mr-3">
                  <FiCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">¡Éxito!</p>
                  <p className="text-sm opacity-90">{successMessage}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto"
      >
        {/* Header con navegación */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 group transition-colors"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver a órdenes
          </button>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Editar Servicio
                </h1>
                <p className="text-white/90 text-sm">
                  Proveedor: {order.supplierName} • Última actualización:{" "}
                  {new Date().toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                    estadoOrder
                      ? "bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 text-emerald-800 border border-emerald-200/50"
                      : "bg-gradient-to-r from-rose-100 via-pink-100 to-red-100 text-rose-800 border border-rose-200/50"
                  }`}
                >
                  {estadoOrder ? "Activo" : "Inactivo"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor principal con layout de 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información principal (2/3 del ancho) */}
          <div className="lg:col-span-2">
            {/* Tarjeta principal */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6">
              {/* Sección de Información */}
              <div className="px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiClipboard className="mr-3 text-purple-600" />
                  Información del Servicio
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Proveedor */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                      <FiUser className="mr-2" />
                      PROVEEDOR
                    </label>
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                      <span className="text-gray-800 font-medium">
                        {order.supplierName}
                      </span>
                      <p className="text-sm text-gray-500 mt-2">
                        Responsable del servicio
                      </p>
                    </div>
                  </div>

                  {/* Rubro/Área de servicio */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                      <FiEdit2 className="mr-2" />
                      RUBRO/ÁREA DE SERVICIO
                    </label>
                    <select
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleChange}
                      disabled={!estadoOrder}
                      className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 ${
                        estadoOrder
                          ? "bg-gray-50 border-gray-300"
                          : "bg-gray-100 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {Object.values(OrderStatus)
                        .filter((v) => typeof v === "number")
                        .map((v) => (
                          <option key={v} value={v}>
                            {getOrderTypeName(v as OrderStatus)}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                      <FiAlignLeft className="mr-2" />
                      DESCRIPCIÓN
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={!estadoOrder}
                      className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[140px] text-gray-800 ${
                        estadoOrder
                          ? "bg-gray-50 border-gray-300"
                          : "bg-gray-100 border-gray-200 cursor-not-allowed"
                      }`}
                      placeholder="Describe los detalles del servicio requerido..."
                      required
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Especifica los requerimientos del servicio
                      </p>
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg">
                        <span className="text-xs text-purple-600 font-medium">
                          {formData.description.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de Configuración del Estado */}
              <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiShield className="mr-3 text-purple-600" />
                  Configuración del Estado
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Prioridad */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      PRIORIDAD
                    </label>
                    <div className="p-4 bg-gradient-to-r from-purple-50 via-violet-50 to-pink-50 border border-purple-300/50 rounded-lg">
                      <span className="text-gray-800 font-medium">Media</span>
                      <p className="text-sm text-gray-500 mt-2">
                        Revisión cada 48 horas
                      </p>
                    </div>
                  </div>

                  {/* Seguimiento */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      SEGUIMIENTO
                    </label>
                    <div className="p-4 bg-gradient-to-r from-purple-50 via-violet-50 to-pink-50 border border-purple-300/50 rounded-lg">
                      <span className="text-gray-800 font-medium">
                        Control de cumplimiento
                      </span>
                    </div>
                  </div>

                  {/* Estado de la Orden */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      ESTADO DEL SERVICIO
                    </label>
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            onClick={toggleEstadoOrder}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full cursor-pointer transition-all duration-300 ${
                              estadoOrder ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                                estadoOrder ? "translate-x-8" : "translate-x-1"
                              }`}
                            />
                          </div>
                          <span
                            className={`font-semibold ${
                              estadoOrder ? "text-green-600" : "text-gray-600"
                            }`}
                          >
                            {estadoOrder ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        {isChangingStatus && (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <motion.button
                type="button"
                onClick={() => router.back()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 border border-gray-300 font-medium shadow-sm"
              >
                Cancelar
              </motion.button>

              <motion.button
                type="submit"
                disabled={!estadoOrder || loading}
                whileHover={{ scale: estadoOrder ? 1.02 : 1 }}
                whileTap={{ scale: estadoOrder ? 0.98 : 1 }}
                className={`px-8 py-3 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 font-medium ${
                  estadoOrder
                    ? "bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 text-white hover:from-purple-700 hover:via-violet-700 hover:to-pink-600 hover:shadow-xl"
                    : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Guardar Cambios
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Columna derecha - Estado del servicio (1/3 del ancho) */}
          <div className="lg:col-span-1">
            {estadoOrder ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiCheck className="mr-2 text-green-500" />
                    Estado del Servicio
                  </h2>

                  <div className="mt-4">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-green-600">
                        Servicio Activo
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      El servicio está activo y puede ser procesado por el
                      proveedor.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <button
                          type="button"
                          onClick={toggleEstadoOrder}
                          className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-red-400 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:scale-[1.02]"
                        >
                          Desactivar Servicio
                        </button>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-gray-500 text-sm">
                          Al desactivar el servicio, el proveedor no podrá
                          continuar con el trabajo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-rose-50 via-pink-50/80 to-red-50/80 rounded-2xl shadow-xl border border-rose-200 overflow-hidden sticky top-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-rose-800 mb-4 flex items-center">
                    <FiX className="mr-2 text-rose-600" />
                    Estado del Servicio
                  </h2>

                  <div className="mt-4">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-rose-500 rounded-full mr-3"></div>
                      <h3 className="text-lg font-semibold text-rose-600">
                        Servicio Inactivo
                      </h3>
                    </div>
                    <p className="text-rose-700 mb-6">
                      El servicio no está disponible para procesamiento.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <button
                          type="button"
                          onClick={toggleEstadoOrder}
                          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:scale-[1.02]"
                        >
                          Activar Servicio
                        </button>
                      </div>

                      <div className="pt-4 border-t border-rose-200">
                        <p className="text-rose-600 text-sm">
                          Al activar el servicio, el proveedor podrá continuar
                          con el trabajo inmediatamente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.form>

      {/* Mensaje de error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 max-w-6xl mx-auto"
          >
            <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 border border-rose-200 rounded-2xl p-6">
              <div className="flex items-start">
                <div className="p-3 bg-gradient-to-r from-rose-100 to-red-100 rounded-xl mr-4">
                  <FiAlertCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-rose-800 mb-1">Error</h3>
                  <p className="text-rose-700 mb-3">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-sm text-rose-600 hover:text-rose-800 font-medium bg-gradient-to-r from-rose-100 to-red-100 px-4 py-2 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
