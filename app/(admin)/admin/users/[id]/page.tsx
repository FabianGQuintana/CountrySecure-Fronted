// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { AltaBaja, updateUser } from "@/actions/usuariosActions";
// import { useSession } from "next-auth/react";
// import { Iusuario } from "@/types";
// import {
//   FiUser,
//   FiMail,
//   FiEdit2,
//   FiSave,
//   FiX,
//   FiCheck,
//   FiAlertCircle,
//   FiArrowLeft,
//   FiShield,
//   FiHome,
//   FiKey,
//   FiCalendar,
//   FiPhone,
//   FiMapPin,
//   FiClock,
// } from "react-icons/fi";
// import {
//   HiOutlineUserCircle,
//   HiOutlineStatusOnline,
//   HiOutlineStatusOffline,
//   HiOutlineExclamationCircle,
// } from "react-icons/hi";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Page() {
//   const params = useParams();
//   const id = params.id as string;
//   const router = useRouter();
//   const [usuario, setUsuario] = useState<Iusuario | null>(null);
//   const [cargando, setCargando] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { data: session } = useSession();

//   const [formData, setFormData] = useState({
//     name: "",
//     lastname: "",
//     email: "",
//     role: "",
//   });

//   const [estadoUsuario, setEstadoUsuario] = useState(false);
//   const [isChangingStatus, setIsChangingStatus] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   useEffect(() => {
//     if (!session) return;

//     const cargarDatos = async () => {
//       try {
//         setCargando(true);
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_HOST}/api/Users/${id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${session.user.accessToken}`,
//             },
//           }
//         );

//         if (!response.ok) throw new Error("No se pudo obtener el usuario");

//         const data = await response.json();
//         setUsuario(data);
//         setFormData({
//           name: data.name || "",
//           lastname: data.lastname || "",
//           email: data.email || "",
//           role: data.role || "",
//         });
//         setEstadoUsuario(data.active === true);
//       } catch (err) {
//         setError("Error al cargar datos del usuario");
//         console.error("Error:", err);
//       } finally {
//         setCargando(false);
//       }
//     };

//     cargarDatos();
//   }, [id, session]);

//   const toggleEstadoUsuario = async () => {
//     try {
//       setIsChangingStatus(true);
//       await AltaBaja(id);
//       setEstadoUsuario(!estadoUsuario);

//       // Mostrar mensaje de éxito
//       setSuccessMessage(
//         `Usuario ${!estadoUsuario ? "activado" : "desactivado"} correctamente`
//       );
//       setShowSuccess(true);

//       // Ocultar mensaje después de 3 segundos
//       setTimeout(() => setShowSuccess(false), 3000);

//       router.refresh();
//     } catch (error) {
//       setError("No se pudo actualizar el estado del usuario");
//       console.error("Error al cambiar el estado:", error);
//     } finally {
//       setIsChangingStatus(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateUser({ role: formData.role }, id);

//       // Mostrar mensaje de éxito
//       setSuccessMessage("Rol actualizado correctamente");
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 3000);

//       router.refresh();

//       // Redirección condicional
//       if (formData.role === "Resident") {
//         setTimeout(() => router.push("/admin/users/residentes"), 1500);
//       } else if (formData.role === "Security") {
//         setTimeout(() => router.push("/admin/users/seguridad"), 1500);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Error desconocido");
//       console.error("Error al cambiar rol de usuario:", err);
//     }
//   };

//   if (cargando) {
//     return (
//       <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="animate-pulse">
//             <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6"></div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 space-y-6">
//                 <div className="h-64 bg-white rounded-2xl shadow-lg"></div>
//                 <div className="h-48 bg-white rounded-2xl shadow-lg"></div>
//               </div>
//               <div className="h-64 bg-white rounded-2xl shadow-lg"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       {/* Notificaciones */}
//       <AnimatePresence>
//         {showSuccess && (
//           <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -50 }}
//             className="fixed top-4 right-4 z-50 max-w-md"
//           >
//             <div className="bg-linear-to-r from-emerald-500 to-teal-400 text-white p-4 rounded-2xl shadow-2xl">
//               <div className="flex items-center">
//                 <FiCheck className="w-6 h-6 mr-3" />
//                 <div>
//                   <p className="font-semibold">¡Éxito!</p>
//                   <p className="text-sm opacity-90">{successMessage}</p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="max-w-6xl mx-auto">
//         {/* Header con navegación */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-gray-600 hover:text-gray-800 mb-6 group transition-colors"
//           >
//             <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
//             Volver a usuarios
//           </button>

//           <div className="flex flex-col md:flex-row md:items-center justify-between">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
//                 Editar Usuario
//               </h1>
//               <p className="text-gray-500 flex items-center">
//                 <HiOutlineUserCircle className="mr-2" />
//                 Nombre: {usuario?.name} • Última actualización:{" "}
//                 {new Date().toLocaleDateString()}
//               </p>
//             </div>

//             <div className="mt-4 md:mt-0">
//               <div
//                 className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
//                   estadoUsuario
//                     ? "bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200"
//                     : "bg-linear-to-r from-rose-100 to-red-100 text-rose-800 border border-rose-200"
//                 }`}
//               >
//                 {estadoUsuario ? (
//                   <>
//                     <HiOutlineStatusOnline className="mr-2" />
//                     Activo
//                   </>
//                 ) : (
//                   <>
//                     <HiOutlineStatusOffline className="mr-2" />
//                     Inactivo
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Columna izquierda - Información del usuario */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1 }}
//             className="lg:col-span-2 space-y-6"
//           >
//             {/* Tarjeta de información principal */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//               <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                   <FiUser className="mr-3 text-gray-500" />
//                   Información Personal
//                 </h2>
//               </div>

//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
//                       <div className="flex items-center mb-2">
//                         <div className="p-2 bg-blue-100 rounded-lg mr-3">
//                           <FiUser className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">
//                             Nombre
//                           </p>
//                           <p className="text-lg font-semibold text-gray-800">
//                             {usuario?.name || "No disponible"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
//                       <div className="flex items-center mb-2">
//                         <div className="p-2 bg-purple-100 rounded-lg mr-3">
//                           <FiUser className="w-5 h-5 text-purple-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">
//                             Apellido
//                           </p>
//                           <p className="text-lg font-semibold text-gray-800">
//                             {usuario?.lastname || "No disponible"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="bg-linear-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
//                       <div className="flex items-center mb-2">
//                         <div className="p-2 bg-amber-100 rounded-lg mr-3">
//                           <FiMail className="w-5 h-5 text-amber-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
//                             Email
//                           </p>
//                           <p className="text-lg font-semibold text-gray-800 truncate">
//                             {usuario?.email || "No disponible"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-linear-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
//                       <div className="flex items-center mb-2">
//                         <div className="p-2 bg-emerald-100 rounded-lg mr-3">
//                           <FiCalendar className="w-5 h-5 text-emerald-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">
//                             Miembro desde
//                           </p>
//                           {/* <p className="text-lg font-semibold text-gray-800">
//                             {usuario?.createdAt
//                               ? new Date(usuario.createdAt).toLocaleDateString()
//                               : "No disponible"}
//                           </p> */}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Tarjeta de configuración del rol */}
//             <motion.form
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               onSubmit={handleSubmit}
//               className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
//             >
//               <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                   <FiEdit2 className="mr-3 text-gray-500" />
//                   Configuración del Rol
//                 </h2>
//               </div>

//               <div className="p-6">
//                 <div className="space-y-6">
//                   <div>
//                     <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FiKey className="mr-2" />
//                       Rol del Usuario
//                     </label>
//                     <div className="relative">
//                       <select
//                         name="role"
//                         value={formData.role}
//                         onChange={handleChange}
//                         className="w-full p-4 bg-linear-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
//                         required
//                       >
//                         <option value="" disabled className="text-gray-400">
//                           Seleccione un rol
//                         </option>
//                         <option value="Resident" className="py-2">
//                           Residente
//                         </option>
//                         <option value="Security" className="py-2">
//                           Personal de Seguridad
//                         </option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                         <svg
//                           className="w-5 h-5 text-gray-400"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 9l-7 7-7-7"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div
//                         className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                           formData.role === "Resident"
//                             ? "border-blue-500 bg-blue-50"
//                             : "border-gray-200 hover:border-gray-300"
//                         }`}
//                         onClick={() =>
//                           setFormData((prev) => ({ ...prev, role: "Resident" }))
//                         }
//                       >
//                         <div className="flex items-center">
//                           <div
//                             className={`p-3 rounded-lg mr-4 ${
//                               formData.role === "Resident"
//                                 ? "bg-blue-100"
//                                 : "bg-gray-100"
//                             }`}
//                           >
//                             <FiHome
//                               className={`w-6 h-6 ${
//                                 formData.role === "Resident"
//                                   ? "text-blue-600"
//                                   : "text-gray-500"
//                               }`}
//                             />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">
//                               Residente
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               Acceso a amenities y servicios
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div
//                         className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                           formData.role === "Security"
//                             ? "border-purple-500 bg-purple-50"
//                             : "border-gray-200 hover:border-gray-300"
//                         }`}
//                         onClick={() =>
//                           setFormData((prev) => ({ ...prev, role: "Security" }))
//                         }
//                       >
//                         <div className="flex items-center">
//                           <div
//                             className={`p-3 rounded-lg mr-4 ${
//                               formData.role === "Security"
//                                 ? "bg-purple-100"
//                                 : "bg-gray-100"
//                             }`}
//                           >
//                             <FiShield
//                               className={`w-6 h-6 ${
//                                 formData.role === "Security"
//                                   ? "text-purple-600"
//                                   : "text-gray-500"
//                               }`}
//                             />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">
//                               Seguridad
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               Control de acceso y monitoreo
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="pt-4 border-t border-gray-200">
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       type="submit"
//                       className="w-full py-4 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
//                     >
//                       <FiSave className="mr-3" />
//                       Guardar Cambios de Rol
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>
//             </motion.form>
//           </motion.div>

//           {/* Columna derecha - Estado y acciones */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="space-y-6"
//           >
//             {/* Tarjeta de estado */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//               <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                   <HiOutlineStatusOnline className="mr-3 text-gray-500" />
//                   Estado de la Cuenta
//                 </h2>
//               </div>

//               <div className="p-6">
//                 <div className="text-center mb-6">
//                   <div className="relative inline-block mb-4">
//                     <div
//                       className={`w-24 h-24 rounded-full flex items-center justify-center ${
//                         estadoUsuario
//                           ? "bg-linear-to-r from-emerald-100 to-teal-100"
//                           : "bg-linear-to-r from-rose-100 to-red-100"
//                       }`}
//                     >
//                       {estadoUsuario ? (
//                         <HiOutlineStatusOnline className="w-12 h-12 text-emerald-600" />
//                       ) : (
//                         <HiOutlineStatusOffline className="w-12 h-12 text-rose-600" />
//                       )}
//                     </div>
//                     <div
//                       className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center ${
//                         estadoUsuario
//                           ? "bg-linear-to-r from-emerald-500 to-teal-400"
//                           : "bg-linear-to-r from-rose-500 to-red-400"
//                       }`}
//                     >
//                       {estadoUsuario ? (
//                         <FiCheck className="w-5 h-5 text-white" />
//                       ) : (
//                         <FiX className="w-5 h-5 text-white" />
//                       )}
//                     </div>
//                   </div>

//                   <h3
//                     className={`text-2xl font-bold mb-2 ${
//                       estadoUsuario ? "text-emerald-700" : "text-rose-700"
//                     }`}
//                   >
//                     {estadoUsuario ? "Cuenta Activa" : "Cuenta Inactiva"}
//                   </h3>
//                   <p className="text-gray-500">
//                     {estadoUsuario
//                       ? "El usuario puede acceder a todos los servicios"
//                       : "El usuario no puede acceder al sistema"}
//                   </p>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={toggleEstadoUsuario}
//                   disabled={isChangingStatus}
//                   className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
//                     estadoUsuario
//                       ? "bg-linear-to-r from-rose-500 to-red-400 text-white hover:shadow-xl hover:from-rose-600 hover:to-red-500"
//                       : "bg-linear-to-r from-emerald-500 to-teal-400 text-white hover:shadow-xl hover:from-emerald-600 hover:to-teal-500"
//                   }`}
//                 >
//                   {isChangingStatus ? (
//                     <div className="flex items-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
//                       Procesando...
//                     </div>
//                   ) : estadoUsuario ? (
//                     <>
//                       <FiX className="mr-3" />
//                       Deshabilitar Cuenta
//                     </>
//                   ) : (
//                     <>
//                       <FiCheck className="mr-3" />
//                       Habilitar Cuenta
//                     </>
//                   )}
//                 </motion.button>

//                 <div className="mt-6 p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl">
//                   <div className="flex items-start">
//                     <HiOutlineExclamationCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
//                     <div>
//                       <p className="text-sm text-gray-600">
//                         {estadoUsuario
//                           ? "Al deshabilitar la cuenta, el usuario perderá acceso inmediato al sistema."
//                           : "Al habilitar la cuenta, el usuario podrá acceder al sistema inmediatamente."}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Mensaje de error */}
//         <AnimatePresence>
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="mt-6"
//             >
//               <div className="bg-linear-to-r from-rose-50 to-red-50 border border-rose-200 rounded-2xl p-6">
//                 <div className="flex items-start">
//                   <div className="p-3 bg-linear-to-r from-rose-100 to-red-100 rounded-xl mr-4">
//                     <FiAlertCircle className="w-6 h-6 text-rose-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-rose-800 mb-1">Error</h3>
//                     <p className="text-rose-700">{error}</p>
//                     <button
//                       onClick={() => setError(null)}
//                       className="mt-3 text-sm text-rose-600 hover:text-rose-800 font-medium"
//                     >
//                       Descartar
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AltaBaja, updateUser } from "@/actions/usuariosActions";
import { useSession } from "next-auth/react";
import { Iusuario } from "@/types";
import {
  FiUser,
  FiMail,
  FiEdit2,
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiShield,
  FiHome,
  FiKey,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import {
  HiOutlineUserCircle,
  HiOutlineStatusOnline,
  HiOutlineStatusOffline,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [usuario, setUsuario] = useState<Iusuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    role: "",
  });

  const [estadoUsuario, setEstadoUsuario] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!session) return;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/Users/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("No se pudo obtener el usuario");

        const data = await response.json();
        setUsuario(data);
        setFormData({
          name: data.name || "",
          lastname: data.lastname || "",
          email: data.email || "",
          role: data.role || "",
        });
        setEstadoUsuario(data.active === true);
      } catch (err) {
        setError("Error al cargar datos del usuario");
        console.error("Error:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id, session]);

  const toggleEstadoUsuario = async () => {
    try {
      setIsChangingStatus(true);
      await AltaBaja(id);
      setEstadoUsuario(!estadoUsuario);

      // Mostrar mensaje de éxito
      setSuccessMessage(
        `Usuario ${!estadoUsuario ? "activado" : "desactivado"} correctamente`
      );
      setShowSuccess(true);

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);

      router.refresh();
    } catch (error) {
      setError("No se pudo actualizar el estado del usuario");
      console.error("Error al cambiar el estado:", error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({ role: formData.role }, id);

      // Mostrar mensaje de éxito
      setSuccessMessage("Rol actualizado correctamente");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      router.refresh();

      // Redirección condicional
      if (formData.role === "Resident") {
        setTimeout(() => router.push("/admin/users/residentes"), 1500);
      } else if (formData.role === "Security") {
        setTimeout(() => router.push("/admin/users/seguridad"), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error al cambiar rol de usuario:", err);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gradient-to-r from-purple-200 to-violet-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50"></div>
                <div className="h-48 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50"></div>
              </div>
              <div className="h-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8">
      {/* Notificaciones */}
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
                <FiCheck className="w-6 h-6 mr-3" />
                <div>
                  <p className="font-semibold">¡Éxito!</p>
                  <p className="text-sm opacity-90">{successMessage}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header con navegación */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-6 group transition-colors"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver a usuarios
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent mb-2">
                Editar Usuario
              </h1>
              <p className="text-gray-500 flex items-center">
                <HiOutlineUserCircle className="mr-2" />
                Nombre: {usuario?.name} • Última actualización:{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                  estadoUsuario
                    ? "bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 text-emerald-800 border border-emerald-200/50"
                    : "bg-gradient-to-r from-rose-100 via-pink-100 to-red-100 text-rose-800 border border-rose-200/50"
                }`}
              >
                {estadoUsuario ? (
                  <>
                    <HiOutlineStatusOnline className="mr-2" />
                    Activo
                  </>
                ) : (
                  <>
                    <HiOutlineStatusOffline className="mr-2" />
                    Inactivo
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del usuario */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Tarjeta de información principal */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 px-6 py-4 border-b border-purple-200/50">
                <h2 className="text-xl font-semibold text-purple-800 flex items-center">
                  <FiUser className="mr-3 text-purple-600" />
                  Información Personal
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50/90 via-violet-50/90 to-pink-50/90 p-4 rounded-xl border border-purple-200/30">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg mr-3">
                          <FiUser className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">
                            Nombre
                          </p>
                          <p className="text-lg font-semibold text-gray-800">
                            {usuario?.name || "No disponible"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-fuchsia-50/90 via-pink-50/90 to-rose-50/90 p-4 rounded-xl border border-fuchsia-200/30">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-gradient-to-r from-fuchsia-100 to-pink-100 rounded-lg mr-3">
                          <FiUser className="w-5 h-5 text-fuchsia-600" />
                        </div>
                        <div>
                          <p className="text-xs text-fuchsia-600 font-medium uppercase tracking-wider">
                            Apellido
                          </p>
                          <p className="text-lg font-semibold text-gray-800">
                            {usuario?.lastname || "No disponible"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/90 to-yellow-50/90 p-4 rounded-xl border border-amber-200/30">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg mr-3">
                          <FiMail className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
                            Email
                          </p>
                          <p className="text-lg font-semibold text-gray-800 truncate">
                            {usuario?.email || "No disponible"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-cyan-50/90 p-4 rounded-xl border border-emerald-200/30">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg mr-3">
                          <FiCalendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">
                            Miembro desde
                          </p>
                          {/* <p className="text-lg font-semibold text-gray-800">
                            {usuario?.createdAt
                              ? new Date(usuario.createdAt).toLocaleDateString()
                              : "No disponible"}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de configuración del rol */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 px-6 py-4 border-b border-purple-200/50">
                <h2 className="text-xl font-semibold text-purple-800 flex items-center">
                  <FiEdit2 className="mr-3 text-purple-600" />
                  Configuración del Rol
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiKey className="mr-2" />
                      Rol del Usuario
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-4 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 border border-purple-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled className="text-gray-400">
                          Seleccione un rol
                        </option>
                        <option value="Resident" className="py-2">
                          Residente
                        </option>
                        <option value="Security" className="py-2">
                          Personal de Seguridad
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          formData.role === "Resident"
                            ? "border-purple-500 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80"
                            : "border-purple-200/50 hover:border-purple-300/70"
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: "Resident" }))
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-3 rounded-lg mr-4 ${
                              formData.role === "Resident"
                                ? "bg-gradient-to-r from-purple-100 to-violet-100"
                                : "bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80"
                            }`}
                          >
                            <FiHome
                              className={`w-6 h-6 ${
                                formData.role === "Resident"
                                  ? "text-purple-600"
                                  : "text-purple-500"
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Residente
                            </h3>
                            <p className="text-sm text-gray-500">
                              Acceso a amenities y servicios
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          formData.role === "Security"
                            ? "border-violet-500 bg-gradient-to-r from-violet-50/80 via-indigo-50/80 to-purple-50/80"
                            : "border-violet-200/50 hover:border-violet-300/70"
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: "Security" }))
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-3 rounded-lg mr-4 ${
                              formData.role === "Security"
                                ? "bg-gradient-to-r from-violet-100 to-indigo-100"
                                : "bg-gradient-to-r from-violet-50/80 via-indigo-50/80 to-purple-50/80"
                            }`}
                          >
                            <FiShield
                              className={`w-6 h-6 ${
                                formData.role === "Security"
                                  ? "text-violet-600"
                                  : "text-violet-500"
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Seguridad
                            </h3>
                            <p className="text-sm text-gray-500">
                              Control de acceso y monitoreo
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-200/50">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                    >
                      <FiSave className="mr-3" />
                      Guardar Cambios de Rol
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.form>
          </motion.div>

          {/* Columna derecha - Estado y acciones */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Tarjeta de estado */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 px-6 py-4 border-b border-purple-200/50">
                <h2 className="text-xl font-semibold text-purple-800 flex items-center">
                  <HiOutlineStatusOnline className="mr-3 text-purple-600" />
                  Estado de la Cuenta
                </h2>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center ${
                        estadoUsuario
                          ? "bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100"
                          : "bg-gradient-to-r from-rose-100 via-pink-100 to-red-100"
                      }`}
                    >
                      {estadoUsuario ? (
                        <HiOutlineStatusOnline className="w-12 h-12 text-emerald-600" />
                      ) : (
                        <HiOutlineStatusOffline className="w-12 h-12 text-rose-600" />
                      )}
                    </div>
                    <div
                      className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center ${
                        estadoUsuario
                          ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400"
                          : "bg-gradient-to-r from-rose-500 via-pink-500 to-red-400"
                      }`}
                    >
                      {estadoUsuario ? (
                        <FiCheck className="w-5 h-5 text-white" />
                      ) : (
                        <FiX className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>

                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      estadoUsuario ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {estadoUsuario ? "Cuenta Activa" : "Cuenta Inactiva"}
                  </h3>
                  <p className="text-gray-500">
                    {estadoUsuario
                      ? "El usuario puede acceder a todos los servicios"
                      : "El usuario no puede acceder al sistema"}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleEstadoUsuario}
                  disabled={isChangingStatus}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                    estadoUsuario
                      ? "bg-gradient-to-r from-rose-500 via-pink-500 to-red-400 text-white hover:shadow-xl hover:from-rose-600 hover:via-pink-600 hover:to-red-500"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white hover:shadow-xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-500"
                  }`}
                >
                  {isChangingStatus ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Procesando...
                    </div>
                  ) : estadoUsuario ? (
                    <>
                      <FiX className="mr-3" />
                      Deshabilitar Cuenta
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-3" />
                      Habilitar Cuenta
                    </>
                  )}
                </motion.button>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 rounded-xl border border-purple-200/30">
                  <div className="flex items-start">
                    <HiOutlineExclamationCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {estadoUsuario
                          ? "Al deshabilitar la cuenta, el usuario perderá acceso inmediato al sistema."
                          : "Al habilitar la cuenta, el usuario podrá acceder al sistema inmediatamente."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mensaje de error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <div className="bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-red-50/90 border border-rose-200/50 rounded-2xl p-6">
                <div className="flex items-start">
                  <div className="p-3 bg-gradient-to-r from-rose-100 to-red-100 rounded-xl mr-4">
                    <FiAlertCircle className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-rose-800 mb-1">Error</h3>
                    <p className="text-rose-700">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-3 text-sm text-rose-600 hover:text-rose-800 font-medium"
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
    </div>
  );
}
