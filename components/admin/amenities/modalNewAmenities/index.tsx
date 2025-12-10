"use client";
import { useState } from "react";

import { newAmenities } from "@/actions/amenitiesActions";
import { FiX } from "react-icons/fi";
import { IAmenitiesRegisterForm } from "@/types";

export default function ModalNewAmenity({
  onClose,
  onSuccess,
}: IAmenitiesRegisterForm) {
  // VALIDADORES
  const regexNumeros = /^[0-9]+$/;

  // ESTADOS
  const [AmenityName, setAmenityName] = useState("");
  const [Description, setDescription] = useState("");
  const [Schedules, setSchedules] = useState("");
  const [Capacity, setCapacity] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setAmenityName("");
    setDescription("");
    setSchedules("");
    setCapacity("");
    setErrorMsg(null);
  };

  const handleCapacity = (value: string) => {
    if (value === "" || regexNumeros.test(value)) setCapacity(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!AmenityName || !Description || !Schedules || !Capacity) {
      setErrorMsg("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      await newAmenities({
        AmenityName,
        Description,
        Schedules,
        Capacity: Number(Capacity),
      });

      onClose();
      if (onSuccess) await onSuccess();
      resetForm();
    } catch (error: any) {
      console.error("Error creando amenity:", error);
      setErrorMsg(error.message || "Error al crear la amenity");
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
          <h2 className="text-3xl font-bold text-blue-800">Nueva Amenity</h2>
          <p className="text-sm text-gray-600 mt-1">
            Completa los datos de la amenity
          </p>
          {errorMsg && <p className="mt-3 text-red-500">{errorMsg}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* AmenityName */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la Amenity
            </label>
            <input
              type="text"
              value={AmenityName}
              onChange={(e) => setAmenityName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Piscina"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: Piscina con área de solarium"
            />
          </div>

          {/* Schedules */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Horarios
            </label>
            <input
              type="text"
              value={Schedules}
              onChange={(e) => setSchedules(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: 08:00 - 20:00"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Capacidad
            </label>
            <input
              type="text"
              value={Capacity}
              onChange={(e) => handleCapacity(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Ej: 50"
            />
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
