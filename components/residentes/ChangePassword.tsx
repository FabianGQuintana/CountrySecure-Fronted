"use client";

import { useState } from "react";
import { changePassword } from "@/actions/usuariosActions";
import { IconLock, IconEye, IconLoading, IconCheck } from "@/app/assets/icon";

export default function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirm) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccessMsg(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl px-8 py-10 flex flex-col items-center bg-white/50 shadow-2xl border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center text-emerald-800">
        Cambiar Contraseña
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 w-full space-y-4">
        {/* Contraseña actual */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Contraseña Actual
          </label>
          <div className="border border-gray-300 rounded-md bg-gray-50 flex items-center px-3 py-2">
            <IconLock className="w-4 h-4 text-gray-600" />
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="********"
              className="ml-2 w-full bg-transparent text-sm outline-none 
                         text-gray-800 placeholder-gray-500"
              required
            />
            <IconEye
              open={showCurrent}
              onClick={() => setShowCurrent(!showCurrent)}
              className="w-4 h-4 text-gray-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Nueva Contraseña
          </label>
          <div className="border border-gray-300 rounded-md bg-gray-50 flex items-center px-3 py-2">
            <IconLock className="w-4 h-4 text-gray-600" />
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="********"
              className="ml-2 w-full bg-transparent text-sm outline-none 
                         text-gray-800 placeholder-gray-500"
              required
            />
            <IconEye
              open={showNew}
              onClick={() => setShowNew(!showNew)}
              className="w-4 h-4 text-gray-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Confirmar nueva */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Confirmar Nueva Contraseña
          </label>
          <div className="border border-gray-300 rounded-md bg-gray-50 flex items-center px-3 py-2">
            <IconLock className="w-4 h-4 text-gray-600" />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="********"
              className="ml-2 w-full bg-transparent text-sm outline-none 
                         text-gray-800 placeholder-gray-500"
              required
            />
            <IconEye
              open={showConfirm}
              onClick={() => setShowConfirm(!showConfirm)}
              className="w-4 h-4 text-gray-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Mensajes */}
        {errorMsg && (
          <p className="text-red-600 text-xs text-center">{errorMsg}</p>
        )}

        {successMsg && (
          <div className="flex items-center justify-center gap-2 text-green-700 text-xs">
            <IconCheck className="w-4 h-4" />
            <p>{successMsg}</p>
          </div>
        )}

        {/* Botón */}
        <button
          type="submit"
          className="flex justify-center items-center w-full 
                     bg-emerald-700 text-white font-semibold text-sm 
                     py-2 mt-3 rounded-md hover:bg-emerald-800 
                     transition cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <IconLoading className="h-5 w-5 animate-spin" />
          ) : (
            "Actualizar Contraseña"
          )}
        </button>
      </form>
    </div>
  );
}
