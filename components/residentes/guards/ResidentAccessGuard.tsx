// "use client";

// import { useSession } from "next-auth/react";
// import { ReactNode } from "react";
// import Link from "next/link";

// interface Props {
//     children: ReactNode;
// }

// export default function ResidentAccessGuard({ children }: Props) {
//     const { data: session, status } = useSession();

//     // ⏳ Cargando sesión
//     if (status === "loading") {
//         return (
//             <div className="flex justify-center items-center h-screen bg-blue-50">
//                 <p className="text-xl text-gray-500 animate-pulse">
//                     Verificando sesión...
//                 </p>
//             </div>
//         );
//     }

//     // 🚫 No autenticado o rol incorrecto
//     if (!session || session.user.role !== "Resident") {
//         return (
//             <div className="flex justify-center items-center h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
//                 <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-lg border border-gray-200">
//                     <div className="text-6xl mb-6">🚫</div>

//                     <h1 className="text-3xl font-bold text-red-500 mb-4">
//                         Acceso denegado
//                     </h1>

//                     <p className="text-gray-500 mb-8 text-lg">
//                         {!session
//                             ? "Debes iniciar sesión para acceder."
//                             : "No tienes permisos para acceder a esta sección."}
//                     </p>

//                     <Link
//                         href={!session ? "/auth/login" : "/"}
//                         className="inline-block bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow"
//                     >
//                         {!session ? "Iniciar sesión" : "Volver al inicio"}
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     // ✅ Autorizado
//     return <>{children}</>;
// }
