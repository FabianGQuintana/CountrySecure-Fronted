import { StatusBadge } from "@/components/ui/StatusBadge";

export const Estados = ({ estado }: { estado: boolean | string }) => {
  // Normalizamos el estado a string en minúsculas para comparación
  const estadoStr = String(estado).toLowerCase();
  const esActivo = estado === true || estadoStr === "activo" || estadoStr === "active";

  return <StatusBadge tone={esActivo ? "success" : "danger"}>{esActivo ? "Activo" : "Inactivo"}</StatusBadge>;
};
