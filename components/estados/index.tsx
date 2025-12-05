// este componente genera un badge (insignia) de estado, que puede ser activo o inactivo
export const Estados = ({ estado }: { estado: boolean | string }) => (
  <span
    className={`px-2 py-0.5 sm:px-3 sm:py-1 inline-flex text-xs leading-4 sm:leading-5 font-semibold rounded-full ${
      estado === true || estado === "true"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {estado === true || estado === "true" ? "Activo" : "Inactivo"}
  </span>
);
