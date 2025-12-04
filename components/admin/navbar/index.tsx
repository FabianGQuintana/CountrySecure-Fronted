// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// // import { logOut } from '@/utils/logOut';

// export default function MenuResidente() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const { data: session } = useSession();

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsMobileMenuOpen(false);
//         setOpenSubMenu(null);
//       }
//     }

//     function handleResize() {
//       if (window.innerWidth >= 1024) {
//         setIsMobileMenuOpen(false);
//         setOpenSubMenu(null);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     window.addEventListener("resize", handleResize);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const toggleSubMenu = (menuName: string) => {
//     setOpenSubMenu((prev) => (prev === menuName ? null : menuName));
//   };

//   return (
//     <>
//       {/* Botón de hamburguesa */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
//         aria-label="Toggle menu"
//       >
//         {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       <div
//         ref={menuRef}
//         className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-gray-900 p-6
//         transform transition-transform duration-300 ease-in-out
//         ${
//           isMobileMenuOpen
//             ? "translate-x-0"
//             : "-translate-x-full lg:translate-x-0"
//         }
//         flex flex-col justify-between overflow-y-auto`}
//       >
//         <div>
//           <h1 className="my-4 text-2xl text-gray-50 font-bold flex justify-center">
//             Bienvenido
//           </h1>
//           <p className="text-gray-400 text-sm mb-8 flex justify-center">
//             {/* {session?.user.nombre} {session?.user.apellido} */}
//           </p>

//           {/* Turnos */}
//           <div className="mb-8 border-t border-gray-500 my-4 py-1">
//             <button
//               className="w-full flex justify-between items-center text-white py-2 px-4 rounded-lg hover:bg-gray-700"
//               onClick={() => toggleSubMenu("turnos")}
//             >
//               <span>Permiso</span>
//               {openSubMenu === "turnos" ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </button>
//             {openSubMenu === "turnos" && (
//               <ul className="mt-2 space-y-1 pl-4">
//                 <li>
//                   <Link
//                     href={`/resident/permiso/`}
//                     className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Lista Permiso
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href={`/PerfilVendedor/usuarios/activos`}
//                     className="block text-gray-300 hover:text-white px-4 py-1 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Pendientes
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href={`/PerfilAdmin/usuarios/inactivos`}
//                     className="block text-gray-300 hover:text-white px-4 py-1  rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     En proceso
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href={`/PerfilAdmin/usuarios/inactivos`}
//                     className="block text-gray-300 hover:text-white px-4  py-1 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Finalizado
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </div>

//           {/* Servicios */}
//           <div className="mb-8 border-t border-gray-500 my-4 py-1">
//             <button
//               className="w-full flex justify-between items-center text-white py-2 px-4 rounded-lg hover:bg-gray-700"
//               onClick={() => toggleSubMenu("servicios")}
//             >
//               <span>Servicios</span>
//               {openSubMenu === "servicios" ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </button>
//             {openSubMenu === "servicios" && (
//               <ul className="mt-2 space-y-1 pl-4">
//                 <li>
//                   <Link
//                     href={`/PerfilVendedor/servicios/`}
//                     className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Lista de Servicios
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href={`/PerfilVendedor/servicios/activos`}
//                     className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Activos
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href={`/PerfilVendedor/servicios/inactivos`}
//                     className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Inactivos
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </div>

//           {/* <div className="mb-8 border-t border-gray-500 my-4 py-1">
//             <button
//               className="w-full flex justify-between items-center text-white py-2 px-4 rounded-lg hover:bg-gray-700"
//               onClick={() => toggleSubMenu('productos')}
//             >
//               <span>Productos</span>
//               {openSubMenu === 'productos' ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </button>
//             {openSubMenu === 'productos' && (
//               <ul className="mt-2 space-y-1 pl-4">
//                 <li>
//                   <Link
//                     href={`/PerfilVendedor/productos/`}
//                     className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Lista de Productos
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href={`/PerfilVendedor/productos/activos`}
//                     className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Activos
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href={`/PerfilVendedor/productos/inactivos`}
//                     className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Inactivos
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </div> */}
//         </div>

//         <div className="mb-4 border-t border-gray-500 my-4 mt-10 ">
//           <ul className="space-y-2 ">
//             <li className="text-white py-2 px-4 rounded-lg hover:bg-gray-700 cursor-pointer">
//               {/* <Link
//                 // href={`/residente/${session?.user?.id}`}
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Perfil
//               </Link> */}
//             </li>
//           </ul>
//           <button
//             className="text-white py-2 px-4 rounded-lg hover:bg-gray-700 cursor-pointer w-full text-left"
//             // onClick={() => logOut()}
//           >
//             Cerrar sesión
//           </button>
//         </div>
//       </div>

//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MenuAdmin() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  // si existe id del usuario en la sesión, armamos la base path con el id dinámico
  const userId = (session as any)?.user?.id; // ajustalo al tipo real si hace falta
  const basePath = userId ? `/resident/${userId}` : "/resident";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setOpenSubMenu(null);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setOpenSubMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSubMenu = (menuName: string) => {
    setOpenSubMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menú lateral */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-gray-900 p-6
        transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        flex flex-col justify-between overflow-y-auto`}
      >
        <div>
          <h1 className="my-4 text-2xl text-gray-50 font-bold flex justify-center">
            Bienvenido
          </h1>

          {/* ======== VISITAS ======== */}
          <div className="mb-8 border-t border-gray-500 my-4 py-1">
            <button
              className="w-full flex justify-between items-center text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              onClick={() => toggleSubMenu("visitas")}
            >
              <span>Usuarios</span>
              {openSubMenu === "visitas" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {openSubMenu === "visitas" && (
              <ul className="mt-2 space-y-1 pl-4">
                <li>
                  <Link
                    href="/admin/usuarios"
                    className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Residen
                  </Link>
                </li>

                <li>
                  <Link
                    href="/admin/usuarios"
                    className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Personal Seguridad
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* ======== AMENITIES ======== */}
          <div className="mb-8 border-t border-gray-500 my-4 py-1">
            <button
              className="w-full flex justify-between items-center text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              onClick={() => toggleSubMenu("amenities")}
            >
              <span>Amenities</span>
              {openSubMenu === "amenities" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {openSubMenu === "amenities" && (
              <ul className="mt-2 space-y-1 pl-4">
                <li>
                  <Link
                    href="/admin/usuarios"
                    className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mis solicitudes
                  </Link>
                </li>

                <li>
                  <Link
                    href="/admin/usuarios"
                    className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Solicitar turno
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* ======== SERVICIOS ======== */}
          <div className="mb-8 border-t border-gray-500 my-4 py-1">
            <button
              className="w-full flex justify-between items-center text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              onClick={() => toggleSubMenu("servicios_res")}
            >
              <span>Servicios</span>
              {openSubMenu === "servicios_res" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {openSubMenu === "servicios_res" && (
              <ul className="mt-2 space-y-1 pl-4">
                <li>
                  <Link
                    href={`${basePath}/servicios`}
                    className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mis solicitudes
                  </Link>
                </li>

                <li>
                  <Link
                    href={`${basePath}/servicios/solicitar`}
                    className="block text-gray-300 hover:text-white py-1 px-4 rounded-lg hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Solicitar Servicio
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Pie: cerrar sesión */}
        <div className="mb-4 border-t border-gray-500 my-4 mt-10 ">
          <button className="text-white py-2 px-4 rounded-lg hover:bg-gray-700 cursor-pointer w-full text-left">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Sombra fondo móvil */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
