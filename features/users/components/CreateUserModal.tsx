"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { FieldError } from "@/components/ui/FieldError";
import { createUser } from "../actions";
import { ROLE_OPTIONS, createUserSchema, type CreateUserFormValues, type CreateUserInput } from "../schemas";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

interface Props {
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

export function CreateUserModal({ onClose, onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues, unknown, CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", lastname: "", dni: "", phone: "", email: "", password: "", role: "Resident" },
  });

  const onSubmit = async (values: CreateUserInput) => {
    const result = await createUser(values);

    if (!result.ok) {
      // Errores de validación del backend → al campo; el resto, al formulario
      const fieldErrors = result.fieldErrors ?? {};
      const mapped = Object.entries(fieldErrors).filter(([field]) => field.toLowerCase() in values);
      if (mapped.length > 0) {
        for (const [field, messages] of mapped) {
          setError(field.toLowerCase() as keyof CreateUserFormValues, { message: messages[0] });
        }
      }
      setError("root", { message: result.error });
      return;
    }

    onClose();
    await onSuccess?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="create-user-title">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <FiX size={26} />
        </button>

        <h2 id="create-user-title" className="text-2xl font-bold text-gray-800 mb-6">
          Nuevo usuario
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelClass}>Nombre</label>
              <input id="name" className={inputClass} autoComplete="given-name" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <label htmlFor="lastname" className={labelClass}>Apellido</label>
              <input id="lastname" className={inputClass} autoComplete="family-name" {...register("lastname")} />
              <FieldError message={errors.lastname?.message} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dni" className={labelClass}>DNI</label>
              <input id="dni" inputMode="numeric" className={inputClass} {...register("dni")} />
              <FieldError message={errors.dni?.message} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Teléfono</label>
              <input id="phone" inputMode="tel" className={inputClass} autoComplete="tel" {...register("phone")} />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" type="email" className={inputClass} autoComplete="off" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`${inputClass} pr-10`}
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, con mayúscula, minúscula y número.</p>
          </div>

          <div>
            <label htmlFor="role" className={labelClass}>Rol</label>
            <select id="role" className={inputClass} {...register("role")}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <FieldError message={errors.role?.message} />
          </div>

          {errors.root?.message && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {errors.root.message}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-white font-medium bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
