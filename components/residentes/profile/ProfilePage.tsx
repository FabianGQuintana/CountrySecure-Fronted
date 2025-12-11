"use client";

import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiHome, FiSettings, FiArrowRight } from "react-icons/fi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/UI/card";

export default function ResidentProfile() {
    const { data: session } = useSession();

    // Simulación temporal de propiedades (hasta que tengas backend)
    const properties = [
        { street: "Av. Principal", number: 123, status: "Activa" },
        { street: "Calle Los Robles", number: 87, status: "Activa" },
    ];

    const user = {
        name: session?.user?.name || "Juan",
        lastname: session?.user?.lastname || "Pérez",
        dni: "12345678",
        phone: "+54 379 4556677",
        email: session?.user?.email || "usuario@mail.com",
    };

    const initials = `${user.name[0] || ""}${user.lastname[0] || ""}`;

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 p-10 ml-64 text-gray-900">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        Mi Perfil{" "}
                    </h1>
                    <p className="text-gray-500 text-lg">Información personal y de residencia</p>
                </div>

                {/* BOTÓN EDITAR PERFIL */}
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                        href="/resident/profile/edit"
                        className="px-6 py-3 rounded-xl font-semibold text-white 
            bg-linear-to-r from-cyan-400 to-blue-500 shadow hover:shadow-lg transition-all"
                    >
                        Editar Perfil
                    </Link>
                </motion.div>
            </div>

            {/* AVATAR */}
            <div className="flex justify-center mb-10">
                <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold
          bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-xl">
                    {initials}
                </div>
            </div>

            {/* GRID DE SECCIONES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* DATOS PERSONALES */}
                <Card className="bg-white border border-gray-200 rounded-2xl shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                                <FiUser size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Datos Personales</h2>
                        </div>

                        <div className="space-y-3 text-gray-700">
                            <p><span className="font-semibold">Nombre:</span> {user.name} {user.lastname}</p>
                            <p><span className="font-semibold">DNI:</span> {user.dni}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* CONTACTO Y ACCESO */}
                <Card className="bg-white border border-gray-200 rounded-2xl shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-green-100 text-green-600">
                                <FiSettings size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Contacto y Acceso</h2>
                        </div>

                        <div className="space-y-3 text-gray-700">
                            <p className="flex items-center gap-2">
                                <FiMail />
                                <span>{user.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <FiPhone />
                                <span>{user.phone}</span>
                            </p>
                        </div>

                        {/* LINK CAMBIAR CONTRASEÑA */}
                        <motion.div whileHover={{ x: 5 }} className="mt-6">
                            <Link
                                href="/resident/profile/change-password"
                                className="text-cyan-600 font-medium flex items-center gap-2"
                            >
                                Cambiar contraseña <FiArrowRight />
                            </Link>
                        </motion.div>
                    </CardContent>
                </Card>

                {/* PROPIEDADES */}
                <Card className="bg-white border border-gray-200 rounded-2xl shadow lg:col-span-2">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                                <FiHome size={28} />
                            </div>
                            <h2 className="text-2xl font-bold">Mis Propiedades</h2>
                        </div>

                        {properties.length === 1 ? (
                            <div className="text-gray-700">
                                <p><span className="font-semibold">Dirección:</span> {properties[0].street} {properties[0].number}</p>
                                <p><span className="font-semibold">Estado:</span> {properties[0].status}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {properties.map((prop, index) => (
                                    <Card key={index} className="border border-gray-200 rounded-xl shadow-sm bg-white">
                                        <CardContent className="p-4">
                                            <p className="font-semibold text-gray-800">{prop.street} {prop.number}</p>
                                            <p className="text-gray-600 text-sm mt-1">Estado: {prop.status}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
