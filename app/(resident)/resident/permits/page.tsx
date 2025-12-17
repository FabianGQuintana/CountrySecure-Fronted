"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    CheckCircle2,
    AlertCircle,
    Send,
    User,
    CreditCard,
    Calendar,
    Wrench,
    FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { PermissionType } from "@/types"
import { createEntryPermission } from "@/actions/permitsActions"
import { createVisit, getVisitsByDni } from "@/actions/visitActions"
import { getOrders } from "@/actions/orderActions"
import { VisitResponseDto } from "@/types/visits"
import { OrderResponseDto, OrderStatusText } from "@/types/order"
import { useSession } from "next-auth/react"

type FormErrors = Record<string, string>

export default function PermitsPage() {

    const { data: session, status } = useSession()

    if (status === "loading") {
        return null
    }

    const [formData, setFormData] = useState({
        permissionType: PermissionType.Visit,
        nameVisit: "",
        lastNameVisit: "",
        dniVisit: "",
        orderId: "",
        description: "",
        validFrom: "",
        validTo: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [resolvedVisit, setResolvedVisit] = useState<VisitResponseDto | null>(null)
    const [isResolvingVisit, setIsResolvingVisit] = useState(false)

    const [orders, setOrders] = useState<OrderResponseDto[]>([])
    const [isLoadingOrders, setIsLoadingOrders] = useState(false)

    const isMaintenance = formData.permissionType === PermissionType.Maintenance

    const setField = (key: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
        setErrors((prev) => {
            const next = { ...prev }
            delete next[key as string]
            return next
        })
        setSubmitError(null)
    }

    const minDateTimeLocal = useMemo(() => {
        const d = new Date()
        d.setSeconds(0, 0)
        const pad = (n: number) => String(n).padStart(2, "0")
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
            d.getHours(),
        )}:${pad(d.getMinutes())}`
    }, [])

    useEffect(() => {
        if (!isMaintenance) return
            ; (async () => {
                try {
                    setIsLoadingOrders(true)
                    setOrders(await getOrders())
                } catch (e: any) {
                    setSubmitError(e?.message ?? "No se pudieron cargar los servicios.")
                } finally {
                    setIsLoadingOrders(false)
                }
            })()
    }, [isMaintenance])

    useEffect(() => {
        setResolvedVisit(null)
        setErrors({})
        setSubmitError(null)
        setSubmitSuccess(false)
        if (!isMaintenance) setFormData((p) => ({ ...p, orderId: "" }))
    }, [formData.permissionType, isMaintenance])

    useEffect(() => {
        const dni = formData.dniVisit.trim()
        const dniNum = Number(dni)
        setResolvedVisit(null)
        if (!dni || Number.isNaN(dniNum) || dni.length < 7) return

        let cancelled = false
        const t = setTimeout(async () => {
            try {
                setIsResolvingVisit(true)
                const v = await getVisitsByDni(dniNum)
                if (!cancelled) setResolvedVisit(v.length > 0 ? v[0] : null)
            } finally {
                if (!cancelled) setIsResolvingVisit(false)
            }
        }, 500)

        return () => {
            cancelled = true
            clearTimeout(t)
        }
    }, [formData.dniVisit])

    const validate = () => {
        const next: FormErrors = {}

        if (!formData.validFrom) next.validFrom = "Ingresá fecha/hora de inicio."
        if (!formData.validTo) next.validTo = "Ingresá fecha/hora de fin."

        if (formData.validFrom && formData.validTo) {
            if (new Date(formData.validTo) <= new Date(formData.validFrom)) {
                next.validTo = "Debe ser posterior a la fecha de inicio."
            }
        }

        if (!formData.nameVisit.trim()) next.nameVisit = "Ingresá nombre."
        if (!formData.lastNameVisit.trim()) next.lastNameVisit = "Ingresá apellido."
        if (!formData.dniVisit.trim()) next.dniVisit = "Ingresá DNI."
        if (isMaintenance && !formData.orderId) next.orderId = "Seleccioná un servicio."

        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(false)

        try {
            const dniNum = Number(formData.dniVisit)
            let visitId = resolvedVisit?.visitId

            if (!visitId) {
                const v = await createVisit({
                    nameVisit: formData.nameVisit.trim(),
                    lastNameVisit: formData.lastNameVisit.trim(),
                    dniVisit: dniNum,
                })
                visitId = v.visitId
            }

            const userId = session?.user?.id
            if (!userId) throw new Error("Usuario no autenticado.")

            await createEntryPermission({
                permissionType: formData.permissionType,
                description: formData.description || null,
                validFrom: new Date(formData.validFrom).toISOString(),
                validTo: new Date(formData.validTo).toISOString(),
                visitId,
                userId,
                orderId: isMaintenance ? formData.orderId : null,
            })

            setSubmitSuccess(true)
        } catch (e: any) {
            setSubmitError(e?.message ?? "Error al crear el permiso.")
        } finally {
            setIsSubmitting(false)
        }
    }


    const inputBase =
        "w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200 bg-white"
    const inputOk =
        "border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 hover:border-violet-300"
    const inputErr = "border-red-300 bg-red-50/50"

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 px-4 py-12">
            <motion.div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-violet-100 p-10 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Permiso de ingreso</h1>
                <p className="text-gray-600">Completá los datos para generar el permiso.</p>

                {/* Tipo */}
                <select
                    value={formData.permissionType}
                    onChange={(e) => setField("permissionType", Number(e.target.value))}
                    className={cn(inputBase, inputOk)}
                >
                    <option value={PermissionType.Visit}>Visita</option>
                    <option value={PermissionType.Maintenance}>Mantenimiento</option>
                </select>

                {/* Fechas */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Desde */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Válido desde
                        </label>
                        <input
                            type="datetime-local"
                            min={minDateTimeLocal}
                            value={formData.validFrom}
                            onChange={(e) => setField("validFrom", e.target.value)}
                            className={cn(inputBase, errors.validFrom ? inputErr : inputOk)}
                        />
                        {errors.validFrom && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.validFrom}
                            </p>
                        )}
                    </div>

                    {/* Hasta */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Válido hasta
                        </label>
                        <input
                            type="datetime-local"
                            min={minDateTimeLocal}
                            value={formData.validTo}
                            onChange={(e) => setField("validTo", e.target.value)}
                            className={cn(inputBase, errors.validTo ? inputErr : inputOk)}
                        />
                        {errors.validTo && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.validTo}
                            </p>
                        )}
                    </div>
                </div>


                {/* Datos visita */}
                <div className="grid md:grid-cols-3 gap-4">
                    <input
                        placeholder="Nombre"
                        value={formData.nameVisit}
                        onChange={(e) => setField("nameVisit", e.target.value)}
                        className={cn(inputBase, errors.nameVisit ? inputErr : inputOk)}
                    />
                    <input
                        placeholder="Apellido"
                        value={formData.lastNameVisit}
                        onChange={(e) => setField("lastNameVisit", e.target.value)}
                        className={cn(inputBase, errors.lastNameVisit ? inputErr : inputOk)}
                    />
                    <input
                        placeholder="DNI"
                        value={formData.dniVisit}
                        onChange={(e) => setField("dniVisit", e.target.value)}
                        className={cn(inputBase, errors.dniVisit ? inputErr : inputOk)}
                    />
                </div>

                {/* Mantenimiento */}
                {isMaintenance && (
                    <select
                        value={formData.orderId}
                        onChange={(e) => setField("orderId", e.target.value)}
                        className={cn(inputBase, errors.orderId ? inputErr : inputOk)}
                    >
                        <option value="">Seleccionar servicio</option>
                        {orders.map((o) => (
                            <option key={o.id} value={o.id}>
                                {OrderStatusText[o.orderType]} — {o.supplierName}
                            </option>
                        ))}
                    </select>
                )}

                {/* Feedback */}
                {submitError && (
                    <div className="flex gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        {submitError}
                    </div>
                )}

                {submitSuccess && (
                    <div className="flex gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
                        <CheckCircle2 className="w-5 h-5" />
                        Permiso creado correctamente.
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? "Creando permiso..." : "Crear permiso"}
                </button>
            </motion.div>
        </div>
    )
}
