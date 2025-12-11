// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { updateAmenities } from "@/actions/amenitiesActions";
// import { useSession } from "next-auth/react";
// import { IamenitiesRegister } from "@/types";
// import {
//   FiEdit2,
//   FiSave,
//   FiAlertCircle,
//   FiArrowLeft,
//   FiCalendar,
//   FiAlignLeft,
//   FiToggleLeft,
//   FiToggleRight,
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Page() {
//   const params = useParams();
//   const id = params.id as string;
//   const router = useRouter();
//   const [amenities, setAmenities] = useState<IamenitiesRegister | null>(null);
//   const [cargando, setCargando] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const { data: session } = useSession();

//   // Cargar datos del amenity
//   useEffect(() => {
//     if (!session) return;

//     const cargarDatos = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_HOST}/api/Amenity/${id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${session.user.accessToken}`,
//             },
//           }
//         );

//         if (!response.ok)
//           throw new Error("No se pudo obtener datos de amenities");

//         const data = await response.json();
//         setAmenities(data);
//       } catch (err) {
//         setError("Error al cargar datos de Amenities");
//       } finally {
//         setCargando(false);
//       }
//     };

//     cargarDatos();
//   }, [id, session]);

//   // Estado del formulario
//   const [formData, setFormData] = useState({
//     amenityName: "",
//     description: "",
//     schedules: "",
//     status: "",
//   });

//   useEffect(() => {
//     if (amenities) {
//       setFormData({
//         amenityName: amenities.amenityName || "",
//         description: amenities.description || "",
//         schedules: amenities.schedules || "",
//         status: amenities.status || "",
//       });
//     }
//   }, [amenities]);

//   // Manejar cambios
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Toggle estado
//   const toggleStatus = () => {
//     setFormData((prev) => ({
//       ...prev,
//       status: prev.status === "Active" ? "Inactive" : "Active",
//     }));
//   };

//   // Guardar cambios
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setCargando(true);
//       await updateAmenities(formData, id);

//       setSuccess(true);
//       setTimeout(() => {
//         router.back();
//       }, 1500);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Error desconocido");
//     } finally {
//       setCargando(false);
//     }
//   };

//   if (cargando) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8 flex items-center justify-center">
//         <div className="max-w-4xl w-full">
//           <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 p-8">
//             <div className="flex flex-col items-center justify-center h-64">
//               <div className="relative mb-6">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//               <p className="text-purple-600 font-medium">Cargando amenity...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8">
//       {/* Notificación de éxito */}
//       <AnimatePresence>
//         {success && (
//           <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -50 }}
//             className="fixed top-4 right-4 z-50 max-w-md"
//           >
//             <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white p-4 rounded-2xl shadow-2xl">
//               <div className="flex items-center">
//                 <div className="p-2 bg-white/20 rounded-lg mr-3">
//                   <FiSave className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="font-semibold">¡Éxito!</p>
//                   <p className="text-sm opacity-90">
//                     Amenity actualizado correctamente
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.form
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         onSubmit={handleSubmit}
//         className="max-w-4xl mx-auto"
//       >
//         {/* Header con navegación */}
//         <div className="mb-8">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="flex items-center text-purple-600 hover:text-purple-800 mb-6 group transition-colors"
//           >
//             <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
//             Volver a amenities
//           </button>

//           <div className="flex flex-col md:flex-row md:items-center justify-between">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent mb-2">
//                 Editar Amenity
//               </h1>
//               <p className="text-gray-500 flex items-center">
//                 <FiEdit2 className="mr-2" />
//                 Modifica los detalles del amenity
//               </p>
//             </div>

//             <div className="mt-4 md:mt-0">
//               <div
//                 className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
//                   formData.status === "Active"
//                     ? "bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 text-emerald-800 border border-emerald-200/50"
//                     : "bg-gradient-to-r from-rose-100 via-pink-100 to-red-100 text-rose-800 border border-rose-200/50"
//                 }`}
//               >
//                 {formData.status === "Active" ? "Activo" : "Inactivo"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tarjeta principal */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 overflow-hidden">
//           {/* Encabezado de la tarjeta */}
//           <div className="bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 px-6 py-4 border-b border-purple-200/50">
//             <h2 className="text-xl font-semibold text-purple-800 flex items-center">
//               <FiEdit2 className="mr-3 text-purple-600" />
//               Información del Amenity
//             </h2>
//           </div>

//           <div className="p-6 md:p-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Columna izquierda */}
//               <div className="space-y-6">
//                 {/* Nombre del amenity */}
//                 <div>
//                   <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center">
//                     <span className="mr-2">🏛️</span>
//                     Nombre del Amenity
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="amenityName"
//                       value={formData.amenityName}
//                       onChange={handleChange}
//                       className="w-full p-4 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 border border-purple-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-purple-400/60"
//                       placeholder="Ej: Piscina, Gimnasio, Sala de Juegos..."
//                       required
//                     />
//                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                       <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
//                         <span className="text-white text-xs">A</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Horarios */}
//                 <div>
//                   <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center">
//                     <FiCalendar className="mr-2" />
//                     Horarios
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="schedules"
//                       value={formData.schedules}
//                       onChange={handleChange}
//                       className="w-full p-4 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 border border-purple-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-purple-400/60"
//                       placeholder="Ej: Lunes a Viernes 8:00 - 22:00"
//                       required
//                     />
//                   </div>
//                   <p className="text-xs text-purple-500 mt-2">
//                     Especifica los días y horarios de disponibilidad
//                   </p>
//                 </div>
//               </div>

//               {/* Columna derecha */}
//               <div className="space-y-6">
//                 {/* Estado */}
//                 <div>
//                   <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center">
//                     {formData.status === "Active" ? (
//                       <FiToggleRight className="mr-2 text-emerald-500" />
//                     ) : (
//                       <FiToggleLeft className="mr-2 text-rose-500" />
//                     )}
//                     Estado del Amenity
//                   </label>
//                   <div className="relative">
//                     <div className="flex items-center space-x-4">
//                       <div
//                         onClick={toggleStatus}
//                         className={`relative inline-flex h-8 w-16 items-center rounded-full cursor-pointer transition-all duration-300 ${
//                           formData.status === "Active"
//                             ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400"
//                             : "bg-gradient-to-r from-rose-500 via-pink-500 to-red-400"
//                         }`}
//                       >
//                         <span
//                           className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
//                             formData.status === "Active"
//                               ? "translate-x-9"
//                               : "translate-x-1"
//                           }`}
//                         />
//                       </div>
//                       <span
//                         className={`font-semibold ${
//                           formData.status === "Active"
//                             ? "text-emerald-600"
//                             : "text-rose-600"
//                         }`}
//                       >
//                         {formData.status === "Active" ? "Activo" : "Inactivo"}
//                       </span>
//                     </div>
//                     <div className="mt-2">
//                       <select
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         className="w-full p-3 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 border border-purple-300/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-purple-700"
//                         required
//                       >
//                         <option value="Active" className="text-emerald-600">
//                           Activo
//                         </option>
//                         <option value="Inactive" className="text-rose-600">
//                           Inactivo
//                         </option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Descripción */}
//                 <div>
//                   <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center">
//                     <FiAlignLeft className="mr-2" />
//                     Descripción
//                   </label>
//                   <div className="relative">
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       className="w-full p-4 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 border border-purple-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-purple-400/60 min-h-[120px]"
//                       placeholder="Describe las características, servicios y normas del amenity..."
//                       rows={4}
//                       required
//                     />
//                     <div className="absolute bottom-3 right-3">
//                       <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg">
//                         <span className="text-xs text-purple-600 font-medium">
//                           {formData.description.length}/500
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Botones de acción */}
//             <div className="mt-8 pt-6 border-t border-purple-200/50">
//               <div className="flex flex-col sm:flex-row gap-4 justify-end">
//                 <motion.button
//                   type="button"
//                   onClick={() => router.back()}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="px-8 py-3 bg-gradient-to-r from-purple-100/80 to-violet-100/80 text-purple-700 rounded-xl hover:from-purple-200 hover:to-violet-200 transition-all duration-300 shadow-sm border border-purple-200/50 font-medium"
//                 >
//                   Cancelar
//                 </motion.button>

//                 <motion.button
//                   type="submit"
//                   disabled={cargando}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="px-8 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 text-white rounded-xl hover:from-purple-700 hover:via-violet-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {cargando ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                       Guardando...
//                     </>
//                   ) : (
//                     <>
//                       <FiSave />
//                       Guardar Cambios
//                     </>
//                   )}
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.form>

//       {/* Mensaje de error */}
//       <AnimatePresence>
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="mt-6 max-w-4xl mx-auto"
//           >
//             <div className="bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-red-50/90 border border-rose-200/50 rounded-2xl p-6">
//               <div className="flex items-start">
//                 <div className="p-3 bg-gradient-to-r from-rose-100 to-red-100 rounded-xl mr-4">
//                   <FiAlertCircle className="w-6 h-6 text-rose-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-rose-800 mb-1">Error</h3>
//                   <p className="text-rose-700 mb-3">{error}</p>
//                   <button
//                     onClick={() => setError(null)}
//                     className="text-sm text-rose-600 hover:text-rose-800 font-medium bg-gradient-to-r from-rose-100 to-red-100 px-4 py-2 rounded-lg hover:shadow-sm transition-shadow"
//                   >
//                     Descartar
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateAmenities } from "@/actions/amenitiesActions";
import { useSession } from "next-auth/react";
import { IamenitiesRegister } from "@/types";
import {
  FiEdit2,
  FiSave,
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiAlignLeft,
  FiToggleLeft,
  FiToggleRight,
  FiUser,
  FiMail,
  FiShield,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [amenities, setAmenities] = useState<IamenitiesRegister | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();

  // Cargar datos del amenity
  useEffect(() => {
    if (!session) return;

    const cargarDatos = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/Amenity/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("No se pudo obtener datos de amenities");

        const data = await response.json();
        setAmenities(data);
      } catch (err) {
        setError("Error al cargar datos de Amenities");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id, session]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    amenityName: "",
    description: "",
    schedules: "",
    status: "",
  });

  useEffect(() => {
    if (amenities) {
      setFormData({
        amenityName: amenities.amenityName || "",
        description: amenities.description || "",
        schedules: amenities.schedules || "",
        status: amenities.status || "",
      });
    }
  }, [amenities]);

  // Manejar cambios
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle estado
  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active",
    }));
  };

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCargando(true);
      await updateAmenities(formData, id);

      setSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 p-8">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-purple-600 font-medium">Cargando amenity...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white/90 to-gray-100 p-4 md:p-8">
      {/* Notificación de éxito */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white p-4 rounded-2xl shadow-2xl">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg mr-3">
                  <FiSave className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">¡Éxito!</p>
                  <p className="text-sm opacity-90">
                    Amenity actualizado correctamente
                  </p>
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
        className="max-w-4xl mx-auto"
      >
        {/* Header con navegación */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 group transition-colors"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver a amenities
          </button>

          <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 text-white p-6 rounded-2xl mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Editor Amenity
                </h1>
                <p className="text-white/90 text-sm flex items-center">
                  <FiEdit2 className="mr-2" />
                  Nombre: {amenities?.amenityName || "Amenity"} • Última
                  actualización: {new Date().toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6">
          {/* Sección de Información Personal */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Información del Amenity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  NOMBRE
                </label>
                <input
                  type="text"
                  name="amenityName"
                  value={formData.amenityName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Ingrese el nombre del amenity"
                  required
                />
              </div>

              {/* Horarios */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiCalendar className="mr-2" />
                  HORARIOS
                </label>
                <input
                  type="text"
                  name="schedules"
                  value={formData.schedules}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Ej: Lunes a Viernes 8:00 - 22:00"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiAlignLeft className="mr-2" />
                  DESCRIPCIÓN
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[100px]"
                  placeholder="Describe las características del amenity..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Sección de Configuración del Rol */}
          <div className="px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Configuración del Estado
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rol del Amenity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  TIPO DE AMENITY
                </label>
                <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <span className="text-gray-800">Área Común</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Acceso a residentes y visitantes
                  </p>
                </div>
              </div>

              {/* Seguridad */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  SEGURIDAD
                </label>
                <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <span className="text-gray-800">
                    Control de acceso y monitoreo
                  </span>
                </div>
              </div>

              {/* Estado de la Cuenta */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ESTADO DEL AMENITY
                </label>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <div
                    onClick={toggleStatus}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full cursor-pointer transition-all duration-300 ${
                      formData.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                        formData.status === "Active"
                          ? "translate-x-8"
                          : "translate-x-1"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-semibold ${
                      formData.status === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formData.status === "Active" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Estado - Similar a la imagen */}
        <div
          className={`rounded-2xl shadow-xl border overflow-hidden mb-8 ${
            formData.status === "Active"
              ? "bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200"
              : "bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-red-200"
          }`}
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h3
                  className={`text-xl font-semibold ${
                    formData.status === "Active"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {formData.status === "Active"
                    ? "Amenity Activo"
                    : "Amenity Inactivo"}
                </h3>
                <p
                  className={`mt-1 ${
                    formData.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.status === "Active"
                    ? "El amenity está disponible para los residentes."
                    : "El amenity no está disponible temporalmente."}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <div
                  className={`flex items-center ${
                    formData.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.status === "Active" ? (
                    <>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <FiCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-semibold">Disponible</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                        <FiX className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-semibold">No Disponible</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                formData.status === "Active"
                  ? "bg-green-100/50 border border-green-200"
                  : "bg-red-100/50 border border-red-200"
              }`}
            >
              <p
                className={`text-sm ${
                  formData.status === "Active"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {formData.status === "Active"
                  ? "Los residentes pueden acceder al amenity según los horarios establecidos."
                  : "Al habilitar el amenity, estará disponible inmediatamente para los residentes."}
              </p>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={toggleStatus}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  formData.status === "Active"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {formData.status === "Active"
                  ? "Deshabilitar Amenity"
                  : "Habilitar Amenity"}
              </button>
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
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm border border-gray-300 font-medium"
          >
            Cancelar
          </motion.button>

          <motion.button
            type="submit"
            disabled={cargando}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 text-white rounded-xl hover:from-purple-700 hover:via-violet-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {cargando ? (
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
      </motion.form>

      {/* Mensaje de error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-red-50/90 border border-rose-200/50 rounded-2xl p-6">
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
