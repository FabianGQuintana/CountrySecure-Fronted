"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
    User,
    Phone,
    CreditCard,
    Clock,
    Calendar,
    FileText,
    CheckCircle2,
    AlertCircle,
    Send,
    Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createEntryPermission } from "@/actions/permitsActions"
import { PermissionType } from "@/types"

type FormErrors = {
    [key: string]: string
}

export default function PermitsPage() {
    const [formData, setFormData] = useState({
        visitorName: "",
        visitorDni: "",
        visitorPhone: "",
        permissionType: PermissionType.Visit,
        validFrom: "",
        entryTime: "",
        departureTime: "",
        description: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})

    const [submitSuccess, setSubmitSuccess] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: name === "permissionType" ? Number(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        const newErrors: FormErrors = {}

        if (!formData.visitorName) newErrors.visitorName = "El nombre del visitante es requerido"
        if (!formData.visitorDni) newErrors.visitorDni = "El DNI del visitante es requerido"
        if (!formData.validFrom) newErrors.validFrom = "La fecha del permiso es requerida"
        if (!formData.entryTime) newErrors.entryTime = "La hora de ingreso es requerida"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsSubmitting(false)
            return
        }

        const validDate = new Date(
            `${formData.validFrom}T${formData.entryTime}:00`
        ).toISOString()

        const departureDate = formData.departureTime
            ? new Date(`${formData.validFrom}T${formData.departureTime}:00`).toISOString()
            : null

        const payload = {
            createDto: {
                permissionType: formData.permissionType,
                description: formData.description || null,
                validFrom: validDate,
                entryTime: validDate,
                departureTime: departureDate,
                visitId: VISIT_ID, // <-- asegurate que exista
                userId: USER_ID,   // <-- asegurate que exista
            },
        }

        console.log("PAYLOAD FINAL", payload)

        try {
            await createEntryPermission(payload)
            setSubmitSuccess(true)
        } catch (error: any) {
            setErrors({
                form: error.message || "Error inesperado al solicitar el permiso",
            })
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-indigo-50 px-4 py-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full mx-auto relative z-10"
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                        bg-gradient-to-br from-violet-600 to-purple-600 shadow-xl shadow-violet-500/30 mb-4
                        ring-4 ring-white/50"
                    >
                        <Building2 className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-balance bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
                        Solicitud de Permiso
                    </h1>
                    <p className="text-muted-foreground text-pretty max-w-lg mx-auto text-base">
                        Complete el formulario para autorizar el ingreso de visitantes a la comunidad
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {submitSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/80 backdrop-blur-xl border border-green-200 rounded-2xl shadow-2xl p-8"
                        >
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30 mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </motion.div>
                                <h2 className="text-2xl font-bold mb-2 text-foreground">¡Permiso Solicitado!</h2>
                                <p className="text-muted-foreground">
                                    El permiso para <strong className="text-foreground">{formData.visitorName}</strong> ha sido procesado
                                    correctamente
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleSubmit}
                            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-violet-500/10 overflow-hidden"
                        >
                            {/* Section 1: Datos del Visitante */}
                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-2">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                                        <span className="text-sm font-bold text-white">1</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground">Datos del Visitante</h2>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="visitorName" className="block text-sm font-medium text-foreground mb-2">
                                            Nombre Completo <span className="text-destructive">*</span>
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                                            <input
                                                id="visitorName"
                                                name="visitorName"
                                                type="text"
                                                placeholder="Juan Pérez"
                                                value={formData.visitorName}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full pl-11 pr-4 py-3.5 bg-white/50 border-2 rounded-xl text-foreground placeholder:text-muted-foreground transition-all duration-200",
                                                    "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white",
                                                    "hover:border-violet-300 hover:shadow-sm",
                                                    errors.visitorName
                                                        ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                                                        : "border-gray-200",
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="visitorDni" className="block text-sm font-medium text-foreground mb-2">
                                                DNI <span className="text-destructive">*</span>
                                            </label>
                                            <div className="relative group">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    id="visitorDni"
                                                    name="visitorDni"
                                                    type="text"
                                                    placeholder="12345678"
                                                    maxLength={8}
                                                    value={formData.visitorDni}
                                                    onChange={handleChange}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3.5 bg-white/50 border-2 rounded-xl text-foreground placeholder:text-muted-foreground transition-all duration-200",
                                                        "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white",
                                                        "hover:border-violet-300 hover:shadow-sm",
                                                        errors.visitorDni
                                                            ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                                                            : "border-gray-200",
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="visitorPhone" className="block text-sm font-medium text-foreground mb-2">
                                                Teléfono
                                            </label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    id="visitorPhone"
                                                    name="visitorPhone"
                                                    type="tel"
                                                    placeholder="1123456789"
                                                    maxLength={10}
                                                    value={formData.visitorPhone}
                                                    onChange={handleChange}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3.5 bg-white/50 border-2 rounded-xl text-foreground placeholder:text-muted-foreground transition-all duration-200",
                                                        "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white",
                                                        "hover:border-violet-300 hover:shadow-sm",
                                                        errors.visitorPhone
                                                            ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                                                            : "border-gray-200",
                                                    )}
                                                />
                                            </div>
                                            <p className="mt-1.5 text-xs text-muted-foreground">Opcional - Para notificaciones</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                            {/* Section 2: Detalles del Permiso */}
                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-2">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                                        <span className="text-sm font-bold text-white">2</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground">Detalles del Permiso</h2>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="permissionType" className="block text-sm font-medium text-foreground mb-2">
                                                Tipo de Permiso <span className="text-destructive">*</span>
                                            </label>
                                            <div className="relative group">
                                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:text-violet-500 transition-colors" />
                                                <select
                                                    id="permissionType"
                                                    name="permissionType"
                                                    value={formData.permissionType}
                                                    onChange={handleChange}
                                                    className="w-full pl-11 pr-10 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl text-foreground appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white hover:border-violet-300 hover:shadow-sm"
                                                >
                                                    <option value={PermissionType.Visit}>Visita</option>
                                                    <option value={PermissionType.Maintenance}>Mantenimiento</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-violet-500 transition-colors">
                                                    <svg
                                                        className="w-5 h-5 text-muted-foreground"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="validFrom" className="block text-sm font-medium text-foreground mb-2">
                                                Fecha <span className="text-destructive">*</span>
                                            </label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    id="validFrom"
                                                    name="validFrom"
                                                    type="date"
                                                    value={formData.validFrom}
                                                    onChange={handleChange}
                                                    min={new Date().toISOString().split("T")[0]}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3.5 bg-white/50 border-2 rounded-xl text-foreground transition-all duration-200",
                                                        "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white",
                                                        "hover:border-violet-300 hover:shadow-sm",
                                                        errors.validFrom
                                                            ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                                                            : "border-gray-200",
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="entryTime" className="block text-sm font-medium text-foreground mb-2">
                                                Hora de Ingreso <span className="text-destructive">*</span>
                                            </label>
                                            <div className="relative group">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    id="entryTime"
                                                    name="entryTime"
                                                    type="time"
                                                    value={formData.entryTime}
                                                    onChange={handleChange}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3.5 bg-white/50 border-2 rounded-xl text-foreground transition-all duration-200",
                                                        "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white",
                                                        "hover:border-violet-300 hover:shadow-sm",
                                                        errors.entryTime
                                                            ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                                                            : "border-gray-200",
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="departureTime" className="block text-sm font-medium text-foreground mb-2">
                                                Hora de Salida
                                            </label>
                                            <div className="relative group">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    id="departureTime"
                                                    name="departureTime"
                                                    type="time"
                                                    value={formData.departureTime}
                                                    onChange={handleChange}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3.5 bg-white/50 border-2 rounded-xl text-foreground transition-all duration-200",
                                                        "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white",
                                                        "hover:border-violet-300 hover:shadow-sm",
                                                        errors.departureTime
                                                            ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                                                            : "border-gray-200",
                                                    )}
                                                />
                                            </div>
                                            <p className="mt-1.5 text-xs text-muted-foreground">Opcional</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                                            Motivo del Ingreso
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Ej: Visita familiar, reparación de instalaciones, entrega de paquetería..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl text-foreground placeholder:text-muted-foreground resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:border-violet-300 hover:shadow-sm"
                                        />
                                        <p className="mt-1.5 text-xs text-muted-foreground">Proporcione detalles sobre la visita</p>
                                    </div>
                                </div>

                                {Object.keys(errors).length > 0 && (
                                    <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-red-900">Errores en el formulario</p>
                                            <p className="text-sm text-red-700 mt-0.5">
                                                Por favor, corrija los campos marcados antes de continuar
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {errors.form && (
                                    <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                        <p className="text-sm text-red-700">{errors.form}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200",
                                        "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30",
                                        "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
                                        isSubmitting
                                            ? "opacity-70 cursor-not-allowed"
                                            : "hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] hover:from-violet-700 hover:to-purple-700",
                                    )}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                            Procesando...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Send className="w-5 h-5" />
                                            Solicitar Permiso
                                        </span>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
