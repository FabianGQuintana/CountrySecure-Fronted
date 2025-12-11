// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { AltaBaja, updateAmenities } from "@/actions/amenitiesActions";
// import { useSession } from "next-auth/react";

// import { IamenitiesRegister } from "@/types";
// import {
//   FiUser,
//   FiMail,
//   FiEdit2,
//   FiSave,
//   FiX,
//   FiCheck,
//   FiAlertCircle,
// } from "react-icons/fi";

// export default function Page() {
//   const params = useParams();
//   const id = params.id as string;
//   const router = useRouter();
//   const [amenities, setAmenities] = useState<IamenitiesRegister | null>(null);
//   const [cargando, setCargando] = useState(true);
//   const [error, setError] = useState<string | null>(null);
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

//   // Estado del amenity
//   const [estadoAmenities, setEstadoAmenities] = useState(false);
//   useEffect(() => {
//     if (amenities) {
//       setEstadoAmenities(amenities.status === "Active");
//     }
//   }, [amenities]);

//   // Cambiar estado del amenity
//   const toggleEstadoAmenity = async () => {
//     try {
//       setCargando(true);
//       await AltaBaja(id);
//       setEstadoAmenities(!estadoAmenities);
//       router.refresh();
//     } catch (error) {
//       setError("No se pudo actualizar el estado del amenity");
//       console.error("Error al cambiar el estado:", error);
//     } finally {
//       setCargando(false);
//     }
//   };

//   // Manejar cambios en el formulario
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Guardar cambios
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setCargando(true);
//       await updateAmenities(formData, id);

//       // Guardar mensaje temporal
//       sessionStorage.setItem(
//         "mensajeExito",
//         "Amenity actualizado correctamente"
//       );

//       // Volver a la página anterior
//       router.back();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Error desconocido");
//       console.error("Error al actualizar amenity:", err);
//     } finally {
//       setCargando(false);
//     }
//   };

//   if (cargando) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-6"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           <FiEdit2 className="text-gray-600" />
//           Editar Amenity
//         </h1>
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-medium ${
//             estadoAmenities
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {estadoAmenities ? "Activo" : "Inactivo"}
//         </span>
//       </div>

//       {/* Formulario */}
//       <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Nombre
//           </label>
//           <input
//             type="text"
//             name="amenityName"
//             value={formData.amenityName}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Descripción
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//             rows={3}
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Horarios
//           </label>
//           <input
//             type="text"
//             name="schedules"
//             value={formData.schedules}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Estado
//           </label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//             required
//           >
//             <option value="Active">Activo</option>
//             <option value="Inactive">Inactivo</option>
//           </select>
//         </div>
//       </div>

//       {/* Botones */}
//       <div className="flex justify-end gap-3">
//         <button
//           type="button"
//           onClick={() => router.back()}
//           className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
//         >
//           Cancelar
//         </button>
//         <button
//           type="submit"
//           disabled={cargando}
//           className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
//         >
//           <FiSave /> Guardar Cambios
//         </button>
//       </div>

//       {/* Mensaje de error */}
//       {error && (
//         <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
//           <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" />
//           <div>
//             <h3 className="font-medium">Error</h3>
//             <p className="text-sm">{error}</p>
//           </div>
//         </div>
//       )}
//     </form>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateAmenities } from "@/actions/amenitiesActions";
import { useSession } from "next-auth/react";

import { IamenitiesRegister } from "@/types";
import { FiEdit2, FiSave, FiAlertCircle } from "react-icons/fi";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [amenities, setAmenities] = useState<IamenitiesRegister | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCargando(true);
      await updateAmenities(formData, id);

      sessionStorage.setItem(
        "mensajeExito",
        "Amenity actualizado correctamente"
      );

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiEdit2 className="text-gray-600" />
          Editar Amenity
        </h1>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            formData.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {formData.status === "Active" ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Formulario */}
      <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="amenityName"
            value={formData.amenityName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horarios
          </label>
          <input
            type="text"
            name="schedules"
            value={formData.schedules}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            required
          >
            <option value="Active">Activo</option>
            <option value="Inactive">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={cargando}
          className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <FiSave /> Guardar Cambios
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
          <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </form>
  );
}
