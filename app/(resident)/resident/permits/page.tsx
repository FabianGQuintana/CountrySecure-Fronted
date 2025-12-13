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

type FormErrors = {
    [key: string]: string
}

export default function PermitsPage() {
    const [formData, setFormData] = useState({
        visitorName: "",
        visitorDni: "",
        visitorPhone: "",
        permissionType: "Visita",
        description: "",
        validFrom: "",
        entryTime: "",
        departureTime: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" })
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.visitorName.trim()) {
            newErrors.visitorName = "El nombre es requerido"
        }

        if (!formData.visitorDni.trim()) {
            newErrors.visitorDni = "El DNI es requerido"
        } else if (!/^\d{7,8}$/.test(formData.visitorDni.trim())) {
            newErrors.visitorDni = "DNI inválido (7 u 8 dígitos)"
        }

        if (formData.visitorPhone && !/^\d{10}$/.test(formData.visitorPhone.trim())) {
            newErrors.visitorPhone = "Teléfono inválido (10 dígitos)"
        }

        if (!formData.validFrom) {
            newErrors.validFrom = "La fecha es requerida"
        }

        if (!formData.entryTime) {
            newErrors.entryTime = "La hora de ingreso es requerida"
        }

        if (formData.departureTime && formData.entryTime && formData.departureTime <= formData.entryTime) {
            newErrors.departureTime = "Debe ser posterior al ingreso"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Solicitud de permiso:", formData)

        setIsSubmitting(false)
        setSubmitSuccess(true)

        setTimeout(() => {
            setFormData({
                visitorName: "",
                visitorDni: "",
                visitorPhone: "",
                permissionType: "Visita",
                description: "",
                validFrom: "",
                entryTime: "",
                departureTime: "",
            })
            setSubmitSuccess(false)
        }, 3000)
    }

    return (
        <div className="min-h-screen bg-background px-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4"
                    >
                        <Building2 className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-balance text-foreground">Solicitud de Permiso</h1>
                    <p className="text-muted-foreground text-pretty max-w-lg mx-auto">
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
                            className="bg-card border border-border rounded-xl shadow-lg p-8"
                        >
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
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
                            className="bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                        >
                            {/* Section 1: Datos del Visitante */}
                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="flex items-center gap-2 pb-2">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                        <span className="text-sm font-bold text-primary">1</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground">Datos del Visitante</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="visitorName" className="block text-sm font-medium text-foreground mb-2">
                                            Nombre Completo <span className="text-destructive">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                id="visitorName"
                                                name="visitorName"
                                                type="text"
                                                placeholder="Juan Pérez"
                                                value={formData.visitorName}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground transition-colors",
                                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                                                    errors.visitorName ? "border-destructive" : "border-input",
                                                )}
                                            />
                                        </div>
                                        {errors.visitorName && (
                                            <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                {errors.visitorName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="visitorDni" className="block text-sm font-medium text-foreground mb-2">
                                                DNI <span className="text-destructive">*</span>
                                            </label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <input
                                                    id="visitorDni"
                                                    name="visitorDni"
                                                    type="text"
                                                    placeholder="12345678"
                                                    maxLength={8}
                                                    value={formData.visitorDni}
                                                    onChange={handleChange}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground transition-colors",
                                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                                                        errors.visitorDni ? "border-destructive" : "border-input",
                                                    )}
                                                />
                                            </div>
                                            {errors.visitorDni && (
                                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.visitorDni}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="visitorPhone" className="block text-sm font-medium text-foreground mb-2">
                                                Teléfono
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <input
                                                    id="visitorPhone"
                                                    name="visitorPhone"
                                                    type="tel"
                                                    placeholder="1123456789"
                                                    maxLength={10}
                                                    value={formData.visitorPhone}
                                                    onChange={handleChange}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground transition-colors",
                                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                                                        errors.visitorPhone ? "border-destructive" : "border-input",
                                                    )}
                                                />
                                            </div>
                                            {errors.visitorPhone && (
                                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.visitorPhone}
                                                </p>
                                            )}
                                            <p className="mt-1.5 text-xs text-muted-foreground">Opcional - Para notificaciones</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-border" />

                            {/* Section 2: Detalles del Permiso */}
                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="flex items-center gap-2 pb-2">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                        <span className="text-sm font-bold text-primary">2</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground">Detalles del Permiso</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="permissionType" className="block text-sm font-medium text-foreground mb-2">
                                                Tipo de Permiso <span className="text-destructive">*</span>
                                            </label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                                <select
                                                    id="permissionType"
                                                    name="permissionType"
                                                    value={formData.permissionType}
                                                    onChange={handleChange}
                                                    className="w-full pl-11 pr-10 py-3 bg-background border border-input rounded-lg text-foreground appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                                >
                                                    <option value="Visita">Visita</option>
                                                    <option value="Mantenimiento">Mantenimiento</option>
                                                    <option value="Delivery">Delivery</option>
                                                    <option value="Proveedor">Proveedor</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
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
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                                <input
                                                    id="validFrom"
                                                    name="validFrom"
                                                    type="date"
                                                    value={formData.validFrom}
                                                    onChange={handleChange}
                                                    min={new Date().toISOString().split("T")[0]}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground transition-colors",
                                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                                                        errors.validFrom ? "border-destructive" : "border-input",
                                                    )}
                                                />
                                            </div>
                                            {errors.validFrom && (
                                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.validFrom}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="entryTime" className="block text-sm font-medium text-foreground mb-2">
                                                Hora de Ingreso <span className="text-destructive">*</span>
                                            </label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                                <input
                                                    id="entryTime"
                                                    name="entryTime"
                                                    type="time"
                                                    value={formData.entryTime}
                                                    onChange={handleChange}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground transition-colors",
                                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                                                        errors.entryTime ? "border-destructive" : "border-input",
                                                    )}
                                                />
                                            </div>
                                            {errors.entryTime && (
                                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.entryTime}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="departureTime" className="block text-sm font-medium text-foreground mb-2">
                                                Hora de Salida
                                            </label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                                <input
                                                    id="departureTime"
                                                    name="departureTime"
                                                    type="time"
                                                    value={formData.departureTime}
                                                    onChange={handleChange}
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground transition-colors",
                                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                                                        errors.departureTime ? "border-destructive" : "border-input",
                                                    )}
                                                />
                                            </div>
                                            {errors.departureTime && (
                                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.departureTime}
                                                </p>
                                            )}
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
                                            className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        />
                                        <p className="mt-1.5 text-xs text-muted-foreground">Proporcione detalles sobre la visita</p>
                                    </div>
                                </div>

                                {Object.keys(errors).length > 0 && (
                                    <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-destructive">Errores en el formulario</p>
                                            <p className="text-sm text-destructive/80 mt-0.5">
                                                Por favor, corrija los campos marcados antes de continuar
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full py-3.5 px-6 rounded-lg font-medium text-primary-foreground transition-all",
                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                        isSubmitting
                                            ? "bg-primary/60 cursor-not-allowed"
                                            : "bg-primary hover:bg-primary/90 active:scale-[0.98]",
                                    )}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
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
