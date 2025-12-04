// "use client";

// import { useState } from "react";
// import { newUsers } from "@/actions/usuariosActions";
// import { FiX, FiMapPin, FiCalendar } from "react-icons/fi";
// import { IusuarioRegisterForm } from "@/types";

// /**
//  * Componente ModalNuevaCampana
//  * Este componente representa un modal para crear un nuevo usuario.
//  * Refresca la lista de usuarios en la página padre al crear el nuevo usuario
//  * Props:
//  * - onClose: función para cerrar el modal
//  * - onSuccess: función que se ejecuta después de crear la campaña (ej: recargar lista)
//  */
// export default function ModalRegisterUser({
//   onClose,
//   onSuccess,
// }: IusuarioRegisterForm) {
//   // -----------------------------------
//   // ESTADOS DEL COMPONENTE
//   // -----------------------------------

//   const [name, setName] = useState("");
//   const [lastname, setLastName] = useState("");
//   const [dni, setDni] = useState<number | undefined>(undefined);
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [loading, setLoading] = useState(false); // Estado de carga mientras se envía
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   /**
//    * resetForm
//    * Limpia todos los campos del formulario y el mensaje de error
//    */
//   const resetForm = () => {
//     setName("");
//     setLastName("");
//     setDni(undefined);
//     setPhone("");
//     setEmail(""), setPassword("");
//     setRole("");
//     setErrorMsg(null);
//   };

//   /**
//    * handleSubmit
//    * Se ejecuta al enviar el formulario
//    * Valida que todos los campos estén completos
//    * Valida que la fecha sea hoy o futura
//    * Llama a la acción newCampana para enviar datos al backend
//    * Cierra el modal y ejecuta onSuccess para refrescar la lista
//    */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ✅ Validación de campos obligatorios
//     if (!name || !lastname || !dni || !phone || !email || !password || !role) {
//       setErrorMsg("Por favor completa todos los campos");
//       return;
//     }

//     setLoading(true);
//     setErrorMsg(null);

//     try {
//       // Llamada al backend para crear la campaña
//       await newUsers({
//         name,
//         lastname,
//         dni, // Se envía como string, backend puede convertir a Date
//         phone,
//         email,
//         password,
//         role,
//       });

//       onClose(); // Cierra el modal

//       // Refresca la lista de usuarios en la página padre
//       if (onSuccess) await onSuccess();

//       // Limpia el formulario
//       resetForm();
//     } catch (error: any) {
//       console.error("Error creando usuario:", error);
//       setErrorMsg(error.message || "Error al crear la usuario");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * handleCancel
//    * Cancela la creación del usuario y cierra el modal
//    */
//   const handleCancel = () => {
//     resetForm();
//     onClose();
//   };

//   // -----------------------------------
//   // RENDER DEL COMPONENTE
//   // -----------------------------------

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
//       <div className="bg-orange-50 rounded-2xl shadow-xl p-8 w-full max-w-xl relative">
//         {/* Botón para cerrar modal */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-orange-600 hover:text-orange-800 cursor-pointer"
//         >
//           <FiX size={24} />
//         </button>

//         {/* Título y mensaje */}
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-extrabold text-orange-700">
//             🐾 Nuevo Usuario
//           </h2>
//           <p className="text-sm text-orange-600 mt-1">
//             Completa los datos del Usuario
//           </p>
//           {errorMsg && <p className="mt-2 text-red-600 text-sm">{errorMsg}</p>}
//         </div>

//         {/* FORMULARIO */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Campo Título */}
//           <div>
//             <label className="block text-sm font-medium text-orange-700 mb-1">
//               Nombre
//             </label>
//             <input
//               type="text"
//               required
//               placeholder="Nombre"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full border border-orange-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//             />
//           </div>

//           {/* Campo Descripción */}
//           <div>
//             <label className="block text-sm font-medium text-orange-700 mb-1">
//               Apellido
//             </label>
//             <textarea
//               required
//               placeholder="Apellido"
//               value={lastname}
//               onChange={(e) => setLastName(e.target.value)}
//               className="w-full border border-orange-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none resize-none h-20"
//             />
//           </div>

//           {/* Campos Fecha y Ubicación */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-orange-700 mb-1">
//                 Correo Electronico
//               </label>
//               <div className="relative">
//                 <FiMapPin className="absolute left-2 top-2 text-orange-400" />
//                 <input
//                   type="email"
//                   required
//                   placeholder="Ej: Ciudad, Barrio"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-8 border border-orange-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-orange-700 mb-1">
//                 Fecha
//               </label>
//               <div className="relative">
//                 <FiCalendar className="absolute left-2 top-2 text-orange-400" />
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-8 border border-orange-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//                   min={new Date().toISOString().split("T")[0]} // deshabilita fechas pasadas
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Botones Cancelar y Guardar */}
//           <div className="flex justify-end gap-3 mt-6">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="cursor-pointer px-5 py-2 rounded-lg bg-orange-200 text-orange-700 hover:bg-orange-300 transition"
//             >
//               Cancelar
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="cursor-pointer px-5 py-2 rounded-lg bg-orange-400 text-white hover:bg-orange-500 transition disabled:opacity-70"
//             >
//               {loading ? "Guardando..." : "Guardar"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { newUsers } from "@/actions/usuariosActions";
// import { FiX, FiChevronDown } from "react-icons/fi";
// import { IusuarioRegisterForm } from "@/types";

// export default function ModalRegisterUser({
//   onClose,
//   onSuccess,
// }: IusuarioRegisterForm) {
//   // ESTADOS
//   const [name, setName] = useState("");
//   const [lastname, setLastName] = useState("");
//   const [dni, setDni] = useState<number | undefined>(undefined);
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [roleOpen, setRoleOpen] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   const resetForm = () => {
//     setName("");
//     setLastName("");
//     setDni(undefined);
//     setPhone("");
//     setEmail("");
//     setPassword("");
//     setRole("");
//     setErrorMsg(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!name || !lastname || !dni || !phone || !email || !password || !role) {
//       setErrorMsg("Por favor completa todos los campos");
//       return;
//     }

//     setLoading(true);
//     try {
//       await newUsers({
//         name,
//         lastname,
//         dni,
//         phone,
//         email,
//         password,
//         role,
//       });

//       onClose();
//       if (onSuccess) await onSuccess();
//       resetForm();
//     } catch (error: any) {
//       console.error("Error creando usuario:", error);
//       setErrorMsg(error.message || "Error al crear el usuario");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative">
//         {/* Botón cerrar */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
//         >
//           <FiX size={26} />
//         </button>

//         {/* Título */}
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-orange-600">Nuevo Usuario</h2>
//           <p className="text-sm text-gray-600 mt-1">
//             Completa los datos del usuario
//           </p>
//           {errorMsg && <p className="mt-3 text-red-500">{errorMsg}</p>}
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Nombre */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Nombre
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//             />
//           </div>

//           {/* Apellido */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Apellido
//             </label>
//             <input
//               type="text"
//               value={lastname}
//               onChange={(e) => setLastName(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//             />
//           </div>

//           {/* DNI y Teléfono */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 DNI
//               </label>
//               <input
//                 type="number"
//                 value={dni ?? ""}
//                 onChange={(e) => setDni(Number(e.target.value))}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Teléfono
//               </label>
//               <input
//                 type="text"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Correo electrónico
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Contraseña
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
//             />
//           </div>

//           {/* SELECT de ROLE */}
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Rol
//             </label>

//             <button
//               type="button"
//               onClick={() => setRoleOpen(!roleOpen)}
//               className="w-full border border-gray-300 p-2 rounded-lg bg-white flex justify-between items-center hover:bg-gray-50"
//             >
//               {role || "Seleccionar rol"}
//               <FiChevronDown
//                 size={18}
//                 className={`transition ${roleOpen ? "rotate-180" : ""}`}
//               />
//             </button>

//             {roleOpen && (
//               <div className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
//                 {["Admin", "Resident", "Security"].map((r) => (
//                   <div
//                     key={r}
//                     onClick={() => {
//                       setRole(r);
//                       setRoleOpen(false);
//                     }}
//                     className="p-2 cursor-pointer hover:bg-orange-100"
//                   >
//                     {r}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
//             >
//               Cancelar
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-70"
//             >
//               {loading ? "Guardando..." : "Guardar"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { newUsers } from "@/actions/usuariosActions";
import { FiX, FiChevronDown } from "react-icons/fi";
import { IusuarioRegisterForm } from "@/types";

export default function ModalRegisterUser({
  onClose,
  onSuccess,
}: IusuarioRegisterForm) {
  // VALIDADORES
  const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
  const regexNumeros = /^[0-9]+$/;

  // ESTADOS
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Resident"); // ✔ Rol por defecto
  const [roleOpen, setRoleOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🔄 Reset
  const resetForm = () => {
    setName("");
    setLastName("");
    setDni("");
    setPhone("");
    setEmail("");
    setPassword("");
    setRole("Resident");
    setErrorMsg(null);
  };

  // 📌 HANDLERS DE VALIDACIÓN
  const handleName = (value: string) => {
    if (value === "" || regexLetras.test(value)) setName(value);
  };

  const handleLastName = (value: string) => {
    if (value === "" || regexLetras.test(value)) setLastName(value);
  };

  const handleDni = (value: string) => {
    if ((value === "" || regexNumeros.test(value)) && value.length <= 8) {
      setDni(value);
    }
  };

  const handlePhone = (value: string) => {
    if (value === "" || regexNumeros.test(value)) setPhone(value);
  };

  // 📌 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDACIÓN FINAL
    if (!name || !lastname || !dni || !phone || !email || !password || !role) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    if (dni.length !== 8) {
      setErrorMsg("El DNI debe tener exactamente 8 números");
      return;
    }

    setLoading(true);

    try {
      await newUsers({
        name,
        lastname,
        dni: Number(dni),
        phone,
        email,
        password,
        role,
      });

      onClose();
      if (onSuccess) await onSuccess();
      resetForm();
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      setErrorMsg(error.message || "Error al crear el usuario");
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
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={26} />
        </button>

        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-orange-600">Nuevo Usuario</h2>
          <p className="text-sm text-gray-600 mt-1">
            Completa los datos del usuario
          </p>
          {errorMsg && <p className="mt-3 text-red-500">{errorMsg}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Juan"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => handleLastName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Pérez"
            />
          </div>

          {/* DNI y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            {/* DNI */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                DNI
              </label>
              <input
                type="text"
                value={dni}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => handleDni(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="8 dígitos"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="text"
                value={phone}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => handlePhone(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Ej: 1122334455"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="ejemplo@mail.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="*******"
            />
          </div>

          {/* ROLE SELECT */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>

            <button
              type="button"
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-full border border-gray-300 p-2 rounded-lg bg-white flex justify-between items-center hover:bg-gray-50"
            >
              {role}
              <FiChevronDown
                size={18}
                className={`transition ${roleOpen ? "rotate-180" : ""}`}
              />
            </button>

            {roleOpen && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                {["Admin", "Resident", "Security"].map((r) => (
                  <div
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleOpen(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-orange-100"
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-70"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
