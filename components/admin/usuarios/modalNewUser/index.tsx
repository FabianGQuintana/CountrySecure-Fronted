"use client";
import { useState } from "react";
import { newUsers } from "@/actions/usuariosActions";
import { FiX, FiChevronDown, FiEye, FiEyeOff } from "react-icons/fi";
import { IusuarioRegisterForm } from "@/types";

export default function ModalRegisterUser({
  onClose,
  onSuccess,
}: IusuarioRegisterForm) {
  // VALIDADORES
  const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
  const regexNumeros = /^[0-9]+$/;
  const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  // ESTADOS
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Resident");
  const [roleOpen, setRoleOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setLastName("");
    setDni("");
    setPhone("");
    setEmail("");
    setPassword("");
    setRole("Resident");
    setErrorMsg(null);
  };

  const handleName = (value: string) => {
    if (value === "" || regexLetras.test(value)) setName(value);
  };

  const handleLastName = (value: string) => {
    if (value === "" || regexLetras.test(value)) setLastName(value);
  };

  const handleDni = (value: string) => {
    if ((value === "" || regexNumeros.test(value)) && value.length <= 8) {
      setDni(value);
    }
  };

  const handlePhone = (value: string) => {
    if (value === "" || regexNumeros.test(value)) setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDACIÓN FINAL
    if (!name || !lastname || !dni || !phone || !email || !password) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    if (dni.length !== 8) {
      setErrorMsg("El DNI debe tener exactamente 8 números");
      return;
    }

    if (!regexPassword.test(password)) {
      setErrorMsg(
        "La contraseña debe tener al menos 8 caracteres, 1 número y 1 mayúscula"
      );
      return;
    }

    setLoading(true);

    try {
      await newUsers({
        name,
        lastname,
        dni: Number(dni),
        phone,
        email,
        password,
        role,
      });

      onClose();
      if (onSuccess) await onSuccess();
      resetForm();
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      setErrorMsg(error.message || "Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={26} />
        </button>

        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">Nuevo Usuario</h2>
          <p className="text-sm text-gray-600 mt-1">
            Completa los datos del usuario
          </p>
          {errorMsg && <p className="mt-3 text-red-500">{errorMsg}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Juan"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => handleLastName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Pérez"
            />
          </div>

          {/* DNI y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            {/* DNI */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                DNI
              </label>
              <input
                type="text"
                value={dni}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => handleDni(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="8 dígitos"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="text"
                value={phone}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => handlePhone(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Ej: 1122334455"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="ejemplo@mail.com"
            />
          </div>

          {/* Password con toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg pr-10"
                placeholder="*******"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* ROLE SELECT */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>

            <button
              type="button"
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-full border border-gray-300 p-2 rounded-lg bg-white flex justify-between items-center hover:bg-gray-50"
            >
              {role}
              <FiChevronDown
                size={18}
                className={`transition ${roleOpen ? "rotate-180" : ""}`}
              />
            </button>

            {roleOpen && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                {["Admin", "Resident", "Security"].map((r) => (
                  <div
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleOpen(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-500 transition disabled:opacity-70"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
