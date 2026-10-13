export const dynamic = "force-dynamic";
import ServicesCardsPage from "@/components/Security/services/index";

// El componente obtiene los permisos de mantenimiento vía Server Action
// (getMaintenancePermissions), por eso la página ya no hace su propio fetch.
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <ServicesCardsPage />
    </div>
  );
}
