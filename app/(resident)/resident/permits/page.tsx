"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
    User,
    CreditCard,
    Calendar,
    FileText,
    AlertCircle,
    Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createEntryPermission } from "@/actions/permitsActions"
import { PermissionType } from "@/types"

import { FormInput } from "@/components/permits/FormInput"
import { FormTextarea } from "@/components/permits/FormTextArea"
import { PermitsSuccess } from "@/components/permits/PermitsSuccess"

type FormErrors = {
    [key: string]: string
}

export default function PermitsPage() {
    const [formData, setFormData] = useState({
        nameVisit: "",
        lastNameVisit: "",
        dniVisit: "",
        permissionType: PermissionType.Visit,
        validFrom: "",
        validTo: "",
        description: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "permissionType" ? Number(value) : value,
        }))

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setIsSubmitting(true)

        const newErrors: FormErrors = {}

        if (!formData.nameVisit) newErrors.nameVisit = "El nombre es requerido"
        if (!formData.lastNameVisit) newErrors.lastNameVisit = "El apellido es requerido"
        if (!formData.dniVisit) newErrors.dniVisit = "El DNI es requerido"
        if (!formData.validFrom) newErrors.validFrom = "Fecha desde requerida"
        if (!formData.validTo) newErrors.validTo = "Fecha hasta requerida"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsSubmitting(false)
            return
        }

        const payload = {
            permissionType: formData.permissionType,
            description: formData.description,
            validFrom: formData.validFrom,
            validTo: formData.validTo,
            nameVisit: formData.nameVisit,
            lastNameVisit: formData.lastNameVisit,
            dniVisit: Number(formData.dniVisit),
        }

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

    const resetForm = () => {
        setFormData({
            nameVisit: "",
            lastNameVisit: "",
            dniVisit: "",
            permissionType: PermissionType.Visit,
            validFrom: "",
            validTo: "",
            description: "",
        })
        setErrors({})
        setSubmitSuccess(false)
    }

    const now = new Date()
    const minDateTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 16)

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
                        <PermitsSuccess
                            name={`${formData.nameVisit} ${formData.lastNameVisit}`}
                            onReset={resetForm}
                        />
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl space-y-6 border border-violet-100"
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4 shadow-lg shadow-violet-500/30">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Solicitud de Permiso
                                </h1>
                                <p className="text-gray-600">
                                    Completa el formulario para autorizar el ingreso
                                </p>
                            </div>

                            <FormInput
                                label="Nombre del visitante"
                                icon={User}
                                required
                                name="nameVisit"
                                value={formData.nameVisit}
                                onChange={handleChange}
                                error={errors.nameVisit}
                            />

                            <FormInput
                                label="Apellido del visitante"
                                icon={User}
                                required
                                name="lastNameVisit"
                                value={formData.lastNameVisit}
                                onChange={handleChange}
                                error={errors.lastNameVisit}
                            />

                            <FormInput
                                label="DNI del visitante"
                                icon={CreditCard}
                                required
                                name="dniVisit"
                                value={formData.dniVisit}
                                onChange={handleChange}
                                error={errors.dniVisit}
                            />

                            {/* Tipo */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FileText className="w-4 h-4 text-violet-600" />
                                    Tipo de permiso
                                    <span className="text-violet-600">*</span>
                                </label>
                                <select
                                    name="permissionType"
                                    value={formData.permissionType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white
                  focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                >
                                    <option value={PermissionType.Visit}>Visita</option>
                                    <option value={PermissionType.Maintenance}>
                                        Mantenimiento
                                    </option>
                                </select>
                            </div>

                            {/* Fechas */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Calendar className="w-4 h-4 text-violet-600" />
                                    Vigencia
                                    <span className="text-violet-600">*</span>
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        type="datetime-local"
                                        name="validFrom"
                                        value={formData.validFrom}
                                        min={minDateTime}
                                        onChange={handleChange}
                                        error={errors.validFrom}
                                    />

                                    <FormInput
                                        type="datetime-local"
                                        name="validTo"
                                        value={formData.validTo}
                                        min={formData.validFrom || minDateTime}
                                        onChange={handleChange}
                                        error={errors.validTo}
                                    />
                                </div>
                            </div>

                            <FormTextarea
                                label="Motivo del ingreso"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />

                            {errors.form && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                    <p className="text-sm text-red-700">{errors.form}</p>
                                </div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "w-full py-4 rounded-xl font-semibold text-white shadow-lg",
                                    "bg-gradient-to-r from-violet-600 to-purple-600",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                {isSubmitting ? "Enviando..." : "Solicitar Permiso"}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
