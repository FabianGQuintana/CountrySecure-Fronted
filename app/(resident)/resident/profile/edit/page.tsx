"use client";

import { toast } from "sonner";
import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiSave,
  FiArrowLeft,
  FiEdit,
  FiShield,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchCurrentUser, updateCurrentUser } from "@/features/users/actions";
import { profileSchema, type ProfileFormValues } from "@/features/users/schemas";
import { FieldError } from "@/components/ui/FieldError";

export default function EditResidentProfile() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", lastname: "", phone: "", email: "" },
  });

  const [dni, setDni] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const result = await fetchCurrentUser();
      if (result.ok) {
        const user = result.data;
        reset({ name: user.name, lastname: user.lastname, phone: user.phone, email: user.email });
        setDni(user.dni);
      } else {
        toast.error(result.error);
      }
      setLoading(false);
    };

    loadUser();
  }, [reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSaveSuccess(false);
    const result = await updateCurrentUser(values);

    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const formData = watch();

  const initials = `${formData.name[0] || "U"}${formData.lastname[0] || "S"}`;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-linear-to-br from-slate-50 via-purple-50/30 to-purple-50/20 p-4 sm:p-6 lg:p-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent mb-2">
              Editar Perfil
            </h1>
            <p className="text-slate-600 text-lg">
              Actualiza tu información personal
            </p>
          </div>

          <motion.div whileHover={{ x: -5 }}>
            <Link
              href="/resident/profile"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-600 
                            hover:text-purple-600 bg-white border border-slate-200 hover:border-purple-300
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
          <Card className="bg-linear-to-br from-purple-500 to-purple-600 border-0 shadow-xl">
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
                <p className="text-purple-50 text-sm">
                  Vista previa de tu perfil
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Información de seguridad */}
          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FiShield className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    Seguridad de Datos
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tu información está protegida
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FiCheckCircle
                    className="text-green-500 shrink-0"
                    size={16}
                  />
                  <span>Todos los datos están encriptados</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle
                    className="text-green-500 shrink-0"
                    size={16}
                  />
                  <span>Solo vos podés ver esta información</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle
                    className="text-green-500 shrink-0"
                    size={16}
                  />
                  <span>Cumplimos con normativas de privacidad</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips de edición */}
          <Card className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg mt-1">
                  <FiEdit className="text-amber-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">
                    Consejos de edición
                  </h4>
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
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card className="bg-white border border-slate-200 shadow-xl">
              <CardContent className="p-8">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiUser className="text-purple-600" size={24} />
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
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50
                                  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                  transition duration-200 text-slate-800 font-medium"
                        placeholder="Tu nombre"
                      />
                      <FieldError message={errors.name?.message} />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <FiUser size={16} className="text-slate-500" />
                        Apellido
                      </label>
                      <input
                        type="text"
                        {...register("lastname")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50
                                  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                  transition duration-200 text-slate-800 font-medium"
                        placeholder="Tu apellido"
                      />
                      <FieldError message={errors.lastname?.message} />
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
                        El DNI no puede modificarse. Si el dato es incorrecto,
                        comunicate con el administrador.
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
                      {...register("email")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50
                                focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                transition duration-200 text-slate-800 font-medium"
                      placeholder="tu@email.com"
                    />
                    <FieldError message={errors.email?.message} />
                    <p className="text-xs text-slate-500 mt-2">
                      Usaremos este email para notificaciones importantes
                    </p>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <FiPhone size={16} className="text-slate-500" />
                      Teléfono
                    </label>
                    <input
                      type="text"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50
                                focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                transition duration-200 text-slate-800 font-medium"
                      placeholder="+54 379 4556677"
                    />
                    <FieldError message={errors.phone?.message} />
                    <p className="text-xs text-slate-500 mt-2">
                      Incluí código de área para mejor contacto
                    </p>
                  </div>

                  {errors.root?.message && (
                    <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {errors.root.message}
                    </p>
                  )}

                  {/* Botón Guardar */}
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3
                                bg-linear-to-r from-purple-500 to-purple-600 text-white
                                py-4 rounded-xl font-bold shadow-lg hover:shadow-xl 
                                transition duration-300 hover:from-purple-600 hover:to-purple-700
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
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
                  className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition"
                >
                  Cambiar contraseña
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
