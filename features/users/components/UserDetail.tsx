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

const card = "bg-card/90 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 overflow-hidden";
const cardHeader = "px-6 py-4 border-b border-border/50 bg-background";
const inputClass =
  "w-full px-4 py-3 rounded-xl border border-primary/50 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

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
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <button type="button" onClick={() => router.back()} className="flex items-center text-primary hover:text-primary group transition-colors">
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a usuarios
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {user.name} {user.lastname}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <FiMail aria-hidden /> {user.email} <FiPhone className="ml-2" aria-hidden /> {user.phone || "Sin teléfono"}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
              user.active ? "bg-success-soft text-success border border-success/50" : "bg-danger-soft text-danger border border-danger/50"
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
              message.type === "success" ? "bg-success-soft text-success border border-success/30" : "bg-danger-soft text-danger border border-danger/30"
            }`}
          >
            {message.type === "success" && <FiCheck />} {message.text}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className={`${card} lg:col-span-2`}>
            <div className={cardHeader}>
              <h2 className="text-xl font-semibold text-primary flex items-center">
                <FiEdit2 className="mr-3 text-primary" /> Datos del usuario
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
              <div className="pt-4 border-t border-border/50">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="w-full py-3.5 flex items-center justify-center text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 bg-primary"
                >
                  <FiSave className="mr-3" />
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>

          <div className={card}>
            <div className={cardHeader}>
              <h2 className="text-xl font-semibold text-primary flex items-center">
                <FiUser className="mr-3 text-primary" /> Estado de la cuenta
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                {user.active
                  ? "La cuenta está activa. Si la desactivás, el usuario no podrá iniciar sesión y se cerrarán sus sesiones abiertas."
                  : "La cuenta está inactiva. Al activarla, el usuario vuelve a poder iniciar sesión."}
              </p>
              <button
                type="button"
                onClick={toggleStatus}
                disabled={isChangingStatus}
                className={`w-full py-3 rounded-xl font-semibold text-white transition hover:shadow-lg disabled:opacity-50 ${
                  user.active ? "bg-danger" : "bg-success"
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
