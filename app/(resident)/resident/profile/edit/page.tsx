"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FiUser, FiMail, FiPhone, FiSave, FiArrowLeft, FiEdit, FiShield, FiCheckCircle, FiLock } from "react-icons/fi"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrentUser, updateCurrentUser, updateUser } from "@/actions/usuariosActions"

export default function EditResidentProfile() {

    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        phone: "",
        email: "",
    })

    const [userId, setUserId] = useState<string | null>(null)
    const [dni, setDni] = useState<number | null>(null)

    const [loading, setLoading] = useState(true)

    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getCurrentUser()

                setFormData({
                    name: user.name,
                    lastname: user.lastname,
                    phone: user.phone,
                    email: user.email,
                })

                setUserId(user.id)
                setDni(user.dni)
            } catch (error) {
                console.error("Error cargando usuario", error)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        if (!userId) {
            alert("No se pudo identificar al usuario")
            setIsSaving(false)
            return
        }

        try {
            await updateUser(formData, userId)

            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (error) {
            console.error("Error al guardar cambios", error)
            alert("Ocurrió un error al guardar los cambios")
        } finally {
            setIsSaving(false)
        }
    }

    const initials = `${formData.name[0] || "U"}${formData.lastname[0] || "S"}`

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-4 sm:p-6 lg:p-10 lg:ml-64">
            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent mb-2">
                            Editar Perfil
                        </h1>
                        <p className="text-slate-600 text-lg">Actualiza tu información personal</p>
                    </div>

                    <motion.div whileHover={{ x: -5 }}>
                        <Link
                            href="/resident/profile"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-600 
                            hover:text-cyan-600 bg-white border border-slate-200 hover:border-cyan-300
                            shadow-sm hover:shadow transition duration-200"
                        >
                            <FiArrowLeft size={18} />
                            Volver al perfil
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
                {/* COLUMNA IZQUIERDA - Vista previa y consejos */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Avatar Preview */}
                    <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 border-0 shadow-xl">
                        <CardContent className="p-8">
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold
                                    bg-white/20 backdrop-blur-sm text-white shadow-2xl mb-4 border-4 border-white/30"
                                >
                                    {initials}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {formData.name || "Nombre"} {formData.lastname || "Apellido"}
                                </h2>
                                <p className="text-cyan-50 text-sm">Vista previa de tu perfil</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información de seguridad */}
                    <Card className="bg-white border border-slate-200 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <FiShield className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Seguridad de Datos</h3>
                                    <p className="text-sm text-slate-600">Tu información está protegida</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-500 flex-shrink-0" size={16} />
                                    <span>Todos los datos están encriptados</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-500 flex-shrink-0" size={16} />
                                    <span>Solo vos podés ver esta información</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-500 flex-shrink-0" size={16} />
                                    <span>Cumplimos con normativas de privacidad</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips de edición */}
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg mt-1">
                                    <FiEdit className="text-amber-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-2">Consejos de edición</h4>
                                    <ul className="text-sm text-slate-700 space-y-1.5">
                                        <li>• Usá tu nombre real para mayor confianza</li>
                                        <li>• El email debe ser válido para notificaciones</li>
                                        <li>• El teléfono es importante para emergencias</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Success message */}
                    {saveSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-green-50 border border-green-200 rounded-xl"
                        >
                            <p className="text-sm text-green-700 flex items-center gap-2 font-medium">
                                <FiCheckCircle className="text-green-500" size={18} />
                                Cambios guardados exitosamente
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                {/* COLUMNA DERECHA - Formulario */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3"
                >
                    <form onSubmit={handleSubmit}>
                        <Card className="bg-white border border-slate-200 shadow-xl">
                            <CardContent className="p-8">
                                <div className="border-b border-slate-200 pb-4 mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <FiUser className="text-cyan-600" size={24} />
                                        </div>
                                        Información Personal
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Nombre y Apellido en grid */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                <FiUser size={16} className="text-slate-500" />
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50
                                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                                  transition duration-200 text-slate-800 font-medium"
                                                placeholder="Tu nombre"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                <FiUser size={16} className="text-slate-500" />
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                name="lastname"
                                                value={formData.lastname}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50
                                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                                  transition duration-200 text-slate-800 font-medium"
                                                placeholder="Tu apellido"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                <FiShield size={16} className="text-slate-500" />
                                                DNI
                                            </label>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={dni ?? ""}
                                                    disabled
                                                    className="
                                                        w-full px-4 py-3 rounded-xl
                                                        border-2 border-slate-200
                                                        bg-slate-100 text-slate-500 font-medium
                                                        cursor-not-allowed
                                                        focus:outline-none
                                                    "
                                                />

                                                <FiLock
                                                    size={18}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                                />
                                            </div>

                                            <p className="text-xs text-slate-400 mt-2 leading-snug">
                                                El DNI no puede modificarse.
                                                Si el dato es incorrecto, comunicate con el administrador.
                                            </p>
                                        </div>

                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                            <FiMail size={16} className="text-slate-500" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50
                                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                                transition duration-200 text-slate-800 font-medium"
                                            placeholder="tu@email.com"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">Usaremos este email para notificaciones importantes</p>
                                    </div>

                                    {/* Teléfono */}
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                            <FiPhone size={16} className="text-slate-500" />
                                            Teléfono
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50
                                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                                transition duration-200 text-slate-800 font-medium"
                                            placeholder="+54 379 4556677"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">Incluí código de área para mejor contacto</p>
                                    </div>

                                    {/* Botón Guardar */}
                                    <div className="pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full flex items-center justify-center gap-3
                                bg-gradient-to-r from-cyan-500 to-blue-600 text-white
                                py-4 rounded-xl font-bold shadow-lg hover:shadow-xl 
                                transition duration-300 hover:from-cyan-600 hover:to-blue-700
                                disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    >
                                                        <FiSave size={20} />
                                                    </motion.div>
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSave size={20} />
                                                    Guardar Cambios
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información adicional */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                        >
                            <p className="text-sm text-slate-600 text-center">
                                ¿Necesitás cambiar tu contraseña?{" "}
                                <Link
                                    href="/resident/profile/password"
                                    className="text-cyan-600 font-semibold hover:text-cyan-700 hover:underline transition"
                                >
                                    Cambiar contraseña
                                </Link>
                            </p>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
