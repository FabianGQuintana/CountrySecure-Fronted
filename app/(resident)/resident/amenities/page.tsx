"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Building2, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { createTurn } from "@/actions/turnosActions"
import { getAmenities } from "@/actions/amenitiesActions"

type Amenity = {
    id: string
    amenityName: string
}

type FormErrors = {
    [key: string]: string
}

export default function ReserveAmenityPage() {
    const [formData, setFormData] = useState({
        amenityId: "",
        date: "",
        startTime: "",
        endTime: "",
    })

    const [amenities, setAmenities] = useState<Amenity[]>([])
    const [isLoadingAmenities, setIsLoadingAmenities] = useState(true)

    const [errors, setErrors] = useState<FormErrors>({})
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function loadAmenities() {
            try {
                const data = await getAmenities()
                setAmenities(data)
            } catch (error) {
                console.error("Error cargando amenities", error)
            } finally {
                setIsLoadingAmenities(false)
            }
        }

        loadAmenities()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setIsSubmitting(true)

        const newErrors: FormErrors = {}

        if (!formData.amenityId) newErrors.amenityId = "Seleccione un amenity"
        if (!formData.date) newErrors.date = "Seleccione una fecha"
        if (!formData.startTime) newErrors.startTime = "Hora inicio requerida"
        if (!formData.endTime) newErrors.endTime = "Hora fin requerida"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsSubmitting(false)
            return
        }

        const start = new Date(`${formData.date}T${formData.startTime}:00`).toISOString()
        const end = new Date(`${formData.date}T${formData.endTime}:00`).toISOString()

        try {
            await createTurn({
                amenityId: formData.amenityId,
                startTime: start,
                endTime: end,
            })
            setSubmitSuccess(true)
        } catch (error: any) {
            setErrors({ form: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg w-full"
            >
                <AnimatePresence mode="wait">
                    {submitSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-violet-100"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <CheckCircle2 className="w-20 h-20 text-violet-600 mx-auto mb-6" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Reserva Confirmada!</h2>
                            <p className="text-gray-600">Tu amenity ha sido reservado exitosamente</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl space-y-6 border border-violet-100"
                        >
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4 shadow-lg shadow-violet-500/30">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservar Amenity</h1>
                                <p className="text-gray-600">Completa el formulario para reservar tu espacio</p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Building2 className="w-4 h-4 text-violet-600" />
                                    Amenity
                                    <span className="text-violet-600">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="amenityId"
                                        value={formData.amenityId}
                                        onChange={handleChange}
                                        className={cn(
                                            "w-full px-4 py-3.5 border-2 rounded-xl bg-white transition-all duration-200",
                                            "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
                                            "hover:border-violet-300",
                                            errors.amenityId ? "border-red-300 bg-red-50/50" : "border-gray-200",
                                        )}
                                        disabled={isLoadingAmenities}
                                    >
                                        <option value="">{isLoadingAmenities ? "Cargando..." : "Seleccione un amenity"}</option>
                                        {amenities.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.amenityName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.amenityId && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.amenityId}
                                    </motion.p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Calendar className="w-4 h-4 text-violet-600" />
                                    Fecha
                                    <span className="text-violet-600">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
                                        "hover:border-violet-300",
                                        errors.date ? "border-red-300 bg-red-50/50" : "border-gray-200",
                                    )}
                                />
                                {errors.date && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.date}
                                    </motion.p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Clock className="w-4 h-4 text-violet-600" />
                                    Horario
                                    <span className="text-violet-600">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-600 font-medium">Inicio</label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            className={cn(
                                                "w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200",
                                                "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
                                                "hover:border-violet-300",
                                                errors.startTime ? "border-red-300 bg-red-50/50" : "border-gray-200",
                                            )}
                                        />
                                        {errors.startTime && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xs text-red-600"
                                            >
                                                {errors.startTime}
                                            </motion.p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-600 font-medium">Fin</label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            className={cn(
                                                "w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200",
                                                "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
                                                "hover:border-violet-300",
                                                errors.endTime ? "border-red-300 bg-red-50/50" : "border-gray-200",
                                            )}
                                        />
                                        {errors.endTime && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xs text-red-600"
                                            >
                                                {errors.endTime}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {errors.form && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{errors.form}</p>
                                </motion.div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200",
                                    "bg-gradient-to-r from-violet-600 to-purple-600",
                                    "hover:shadow-xl hover:shadow-violet-500/30",
                                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                                    "relative overflow-hidden group",
                                )}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            Reservando...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Reservar Amenity
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
