export const Estados = ({ estado }: { estado: boolean | string }) => {
  // Normalizamos el estado a string en minúsculas para comparación
  const estadoStr = String(estado).toLowerCase();
  const esActivo =
    estado === true || estadoStr === "activo" || estadoStr === "active";

  return (
    <span
      className={`px-2 py-0.5 sm:px-3 sm:py-1 inline-flex text-xs leading-4 sm:leading-5 font-semibold rounded-full ${
        esActivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {esActivo ? "Activo" : "Inactivo"}
    </span>
  );
};
