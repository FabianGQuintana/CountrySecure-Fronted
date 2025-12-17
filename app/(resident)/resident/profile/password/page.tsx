"use client"

import type React from "react"

import { motion } from "framer-motion"
import { FiLock, FiArrowLeft, FiSave, FiShield, FiCheckCircle, FiAlertCircle } from "react-icons/fi"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { changePassword } from "@/actions/usuariosActions"

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    try {
      setIsSaving(true)

      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      setSuccess(true)
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña")
    } finally {
      setIsSaving(false)
    }
  }

  const passwordRequirements = [
    { text: "Mínimo 8 caracteres", met: formData.newPassword.length >= 8 },
    { text: "Al menos una mayúscula", met: /[A-Z]/.test(formData.newPassword) },
    { text: "Al menos un número", met: /[0-9]/.test(formData.newPassword) },
    {
      text: "Las contraseñas coinciden",
      met: formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-purple-50/20 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent mb-2">
              Seguridad de la Cuenta
            </h1>
            <p className="text-slate-600 text-lg">Mantené tu cuenta protegida con una contraseña segura</p>
          </div>

          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/resident/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium hover:text-purple-600 hover:border-purple-300 transition shadow-sm"
            >
              <FiArrowLeft /> Volver
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
        {/* COLUMNA IZQUIERDA - Información de seguridad */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Card de seguridad */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl">
            <CardContent className="p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FiShield size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Protegé tu cuenta</h3>
                  <p className="text-purple-50 leading-relaxed">
                    Una contraseña fuerte es tu primera línea de defensa contra accesos no autorizados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips de seguridad */}
          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-amber-500" />
                Consejos de seguridad
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>Usá una combinación única de letras, números y símbolos</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>Evitá usar información personal obvia</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>No reutilices contraseñas de otras cuentas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>Cambiá tu contraseña regularmente</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Badge de última actualización */}
          {/* <div className="px-4 py-3 bg-slate-100 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Última actualización:</span> 15 de enero, 2025
            </p>
          </div> */}
        </motion.div>

        {/* COLUMNA DERECHA - Formulario */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card principal del formulario */}
            <Card className="bg-white border border-slate-200 shadow-xl">
              <CardContent className="p-8 space-y-6">
                <div className="border-b border-slate-200 pb-4 mb-2">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiLock className="text-purple-600" size={24} />
                    </div>
                    Cambiar Contraseña
                  </h2>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    Contraseña actualizada correctamente
                  </div>
                )}

                {/* Contraseña actual */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Contraseña actual</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-slate-200
                                            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                            transition duration-200 bg-slate-50 hover:bg-white"
                      placeholder="Ingresá tu contraseña actual"
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                {/* Nueva contraseña */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-slate-200
                                            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                            transition duration-200 bg-slate-50 hover:bg-white"
                      placeholder="Creá una contraseña segura"
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Confirmar nueva contraseña</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-slate-200
                                            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                            transition duration-200 bg-slate-50 hover:bg-white"
                      placeholder="Confirmá tu nueva contraseña"
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                {/* Botón de guardar */}
                <motion.button
                  whileHover={{ scale: isSaving ? 1 : 1.02 }}
                  whileTap={{ scale: isSaving ? 1 : 0.98 }}
                  type="submit"
                  disabled={isSaving}
                  className={`w-full mt-4 flex items-center justify-center gap-3
    py-4 rounded-xl font-semibold shadow-lg transition duration-300
    ${isSaving
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                    }`}
                >
                  <FiSave size={20} />
                  {isSaving ? "Actualizando..." : "Actualizar contraseña"}
                </motion.button>
              </CardContent>
            </Card>

            {/* Requisitos de contraseña */}
            <Card className="bg-white border border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
                  Requisitos de contraseña
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {passwordRequirements.map((req, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className={`flex items-center gap-2 text-sm p-3 rounded-lg transition ${req.met ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-600"
                        }`}
                    >
                      <FiCheckCircle className={req.met ? "text-green-500" : "text-slate-300"} size={16} />
                      <span className="font-medium">{req.text}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
