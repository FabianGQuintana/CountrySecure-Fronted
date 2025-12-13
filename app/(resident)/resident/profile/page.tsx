"use client"

import { motion } from "framer-motion"
import { FiUser, FiMail, FiPhone, FiHome, FiSettings, FiArrowRight, FiShield, FiEdit } from "react-icons/fi"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/actions/usuariosActions"

export default function ResidentProfile() {

  const properties = [{ street: "Av. Principal", number: 123, status: "Activa" }, { street: "Calle Los Robles", number: 87, status: "Activa" },]

  const [user, setUser] = useState<{
    name: string
    lastname: string
    dni: number
    phone: string
    email: string
  } | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser()
        setUser(data)
      } catch (error) {
        console.error("Error cargando usuario", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const initials = `${user?.name[0] || ""}${user?.lastname[0] || ""}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-4 sm:p-6 lg:p-10 lg:ml-64">
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent mb-2">
              Mi Perfil
            </h1>
            <p className="text-slate-600 text-lg">Información personal y de residencia</p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/resident/profile/edit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white 
                            bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl 
                            transition duration-300 hover:from-cyan-600 hover:to-blue-700"
            >
              <FiEdit size={18} />
              Editar Perfil
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
        {/* COLUMNA IZQUIERDA - Avatar y acciones rápidas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
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
                  {user?.name} {user?.lastname}
                </h2>
                <p className="text-cyan-50 text-sm">DNI: {user?.dni}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-cyan-100 rounded-xl">
                  <FiShield className="text-cyan-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Seguridad</h3>
                  <p className="text-sm text-slate-600">Protegé tu cuenta</p>
                </div>
              </div>

              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href="/resident/profile/password"
                  className="flex items-center justify-between p-4 rounded-lg 
                                    bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300
                                    text-slate-700 hover:text-cyan-600 font-medium transition duration-200 group"
                >
                  <span>Cambiar contraseña</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition" />
                </Link>
              </motion.div>
            </CardContent>
          </Card>

          <div className="px-4 py-3 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold">Cuenta activa</span>
            </p>
          </div>
        </motion.div>

        {/* COLUMNA DERECHA - Información detallada */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          <Card className="bg-white border border-slate-200 shadow-xl">
            <CardContent className="p-8">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiUser className="text-blue-600" size={24} />
                  </div>
                  Datos Personales
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-500 mb-1">Nombre completo</p>
                  <p className="text-lg text-slate-800 font-medium">
                    {user?.name} {user?.lastname}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-500 mb-1">DNI</p>
                  <p className="text-lg text-slate-800 font-medium">{user?.dni}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-xl">
            <CardContent className="p-8">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiSettings className="text-green-600" size={24} />
                  </div>
                  Contacto y Acceso
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                    <FiMail className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Email</p>
                    <p className="text-slate-800 font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                    <FiPhone className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Teléfono</p>
                    <p className="text-slate-800 font-medium">{user?.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-xl">
            <CardContent className="p-8">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiHome className="text-purple-600" size={24} />
                  </div>
                  Mis Propiedades
                </h2>
              </div>

              {properties.length === 1 ? (
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
                  <p className="text-sm font-semibold text-slate-500 mb-1">Dirección</p>
                  <p className="text-xl text-slate-800 font-bold mb-3">
                    {properties[0].street} {properties[0].number}
                  </p>
                  {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {properties[0].status}
                  </span> */}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((prop, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition">
                        <CardContent className="p-5">
                          <p className="font-bold text-slate-800 text-lg mb-2">
                            {prop.street} {prop.number}
                          </p>
                          {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {prop.status}
                          </span> */}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
