import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";

interface BuscadorTablasProps {
  placeholder?: string;
  onBuscar: (termino: string) => void;
  delay?: number; // Opcional: tiempo de debounce en ms
  className?: string; // Clases adicionales para personalización
  valorInicial?: string;
}

export const BuscadorTablas = ({
  placeholder = "Buscar...",
  onBuscar,
  delay = 300,
  className = "",
  valorInicial = "",
}: BuscadorTablasProps) => {
  const [termino, setTermino] = useState(valorInicial);

  // Efecto para debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onBuscar(termino);
    }, delay);

    return () => clearTimeout(timer);
  }, [termino, delay, onBuscar]);

  return (
    <div className={`relative w-full sm:w-64 ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-9 sm:pl-10 pr-3 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg md:rounded-xl bg-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder={placeholder}
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
      />
    </div>
  );
};
