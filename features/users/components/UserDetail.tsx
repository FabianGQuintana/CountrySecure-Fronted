"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft, FiCheck, FiEdit2, FiMail, FiPhone, FiSave, FiShield, FiUser } from "react-icons/fi";
import { HiOutlineStatusOffline, HiOutlineStatusOnline } from "react-icons/hi";
import { FieldError } from "@/components/ui/FieldError";
import type { UserDto } from "@/types/models";
import { deactivateUser, restoreUser, updateUser } from "../actions";
import { ROLE_OPTIONS, updateUserSchema, type UpdateUserFormValues, type UpdateUserInput } from "../schemas";

const card = "bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 overflow-hidden";
const cardHeader = "bg-linear-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 px-6 py-4 border-b border-purple-200/50";
const inputClass =
  "w-full px-4 py-3 rounded-xl border border-purple-300/50 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export function UserDetail({ user: initialUser }: { user: UserDto }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateUserFormValues, unknown, UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: toFormValues(initialUser),
  });

  const flash = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    if (type === "success") setTimeout(() => setMessage(null), 3000);
  };

  const onSubmit = async (values: UpdateUserInput) => {
    const result = await updateUser(user.id, values);
    if (!result.ok) return flash("error", result.error);

    setUser(result.data);
    reset(toFormValues(result.data));
    flash("success", "Datos actualizados correctamente");
    router.refresh();
  };

  const toggleStatus = async () => {
    setIsChangingStatus(true);
    const result = await (user.active ? deactivateUser(user.id) : restoreUser(user.id));
    setIsChangingStatus(false);

    if (!result.ok) return flash("error", result.error);

    setUser(result.data);
    flash("success", `Usuario ${result.data.active ? "activado" : "desactivado"} correctamente`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <button type="button" onClick={() => router.back()} className="flex items-center text-purple-600 hover:text-purple-800 group transition-colors">
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a usuarios
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              {user.name} {user.lastname}
            </h1>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <FiMail aria-hidden /> {user.email} <FiPhone className="ml-2" aria-hidden /> {user.phone || "Sin teléfono"}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
              user.active ? "bg-emerald-100 text-emerald-800 border border-emerald-200/50" : "bg-rose-100 text-rose-800 border border-rose-200/50"
            }`}
          >
            {user.active ? <HiOutlineStatusOnline className="mr-2" /> : <HiOutlineStatusOffline className="mr-2" />}
            {user.active ? "Activo" : "Inactivo"}
          </span>
        </div>

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${
              message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" && <FiCheck />} {message.text}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className={`${card} lg:col-span-2`}>
            <div className={cardHeader}>
              <h2 className="text-xl font-semibold text-purple-800 flex items-center">
                <FiEdit2 className="mr-3 text-purple-600" /> Datos del usuario
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelClass}>Nombre</label>
                  <input id="name" className={inputClass} {...register("name")} />
                  <FieldError message={errors.name?.message} />
                </div>
                <div>
                  <label htmlFor="lastname" className={labelClass}>Apellido</label>
                  <input id="lastname" className={inputClass} {...register("lastname")} />
                  <FieldError message={errors.lastname?.message} />
                </div>
                <div>
                  <label htmlFor="dni" className={labelClass}>DNI</label>
                  <input id="dni" inputMode="numeric" className={inputClass} {...register("dni")} />
                  <FieldError message={errors.dni?.message} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Teléfono</label>
                  <input id="phone" inputMode="tel" className={inputClass} {...register("phone")} />
                  <FieldError message={errors.phone?.message} />
                </div>
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input id="email" type="email" className={inputClass} {...register("email")} />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <label htmlFor="role" className={labelClass}>
                  <FiShield className="inline mr-2" aria-hidden />
                  Rol
                </label>
                <select id="role" className={inputClass} {...register("role")}>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <FieldError message={errors.role?.message} />
              </div>
              <div className="pt-4 border-t border-purple-200/50">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="w-full py-3.5 flex items-center justify-center bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  <FiSave className="mr-3" />
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>

          <div className={card}>
            <div className={cardHeader}>
              <h2 className="text-xl font-semibold text-purple-800 flex items-center">
                <FiUser className="mr-3 text-purple-600" /> Estado de la cuenta
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                {user.active
                  ? "La cuenta está activa. Si la desactivás, el usuario no podrá iniciar sesión y se cerrarán sus sesiones abiertas."
                  : "La cuenta está inactiva. Al activarla, el usuario vuelve a poder iniciar sesión."}
              </p>
              <button
                type="button"
                onClick={toggleStatus}
                disabled={isChangingStatus}
                className={`w-full py-3 rounded-xl font-semibold text-white transition hover:shadow-lg disabled:opacity-50 ${
                  user.active ? "bg-linear-to-r from-rose-500 via-pink-500 to-red-400" : "bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-400"
                }`}
              >
                {isChangingStatus ? "Procesando..." : user.active ? "Desactivar usuario" : "Activar usuario"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function toFormValues(user: UserDto): UpdateUserFormValues {
  return {
    name: user.name,
    lastname: user.lastname,
    dni: user.dni,
    phone: user.phone,
    email: user.email,
    role: user.role,
  };
}
