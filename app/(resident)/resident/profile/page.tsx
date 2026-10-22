import Link from "next/link";
import { Home, KeyRound, Mail, Pencil, Phone, ShieldCheck, UserCircle } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { ProfileAvatar } from "@/components/avatar/ProfileAvatar";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";
import { getMyProperties } from "@/features/properties/queries";
import { getCurrentUserProfile } from "@/features/users/queries";
import { load } from "@/lib/load";

export const dynamic = "force-dynamic";

const PROPERTY_STATUS: Record<string, string> = {
  Occupied: "Ocupada",
  Available: "Disponible",
  Maintenance: "Mantenimiento",
  Inactive: "Inactiva",
};

export default async function ResidentProfile() {
  // Usuario y propiedades en paralelo, en el servidor
  const [userResult, propertiesResult] = await Promise.all([load(getCurrentUserProfile), load(getMyProperties)]);
  const user = userResult.data;

  if (!user) return <ErrorState title="No se pudo cargar tu perfil" message={userResult.error} />;

  const properties = propertiesResult.data ?? [];

  const info = [
    { label: "Email", value: user.email, icon: Mail },
    { label: "Teléfono", value: user.phone, icon: Phone },
    { label: "DNI", value: String(user.dni), icon: ShieldCheck },
  ];

  return (
    <PageContainer size="wide">
      <PageHeader
        icon={<UserCircle size={24} aria-hidden />}
        title="Mi perfil"
        description="Tus datos personales y de residencia."
        actions={
          <>
            <Link href="/resident/profile/password" className={secondaryButtonClass}>
              <KeyRound size={18} aria-hidden /> Cambiar contraseña
            </Link>
            <Link href="/resident/profile/edit" className={primaryButtonClass}>
              <Pencil size={18} aria-hidden /> Editar perfil
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-4">
            <ProfileAvatar avatar={user.avatar} name={user.name} lastname={user.lastname} />
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold text-foreground">
                {user.name} {user.lastname}
              </p>
              <StatusBadge tone="info">Residente</StatusBadge>
            </div>
          </div>
          <dl className="mt-6 space-y-4">
            {info.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon size={18} aria-hidden />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="truncate font-medium text-foreground">{value || "—"}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Home size={20} className="text-primary" aria-hidden /> Mis propiedades
          </h2>
          {propertiesResult.error && <p className="text-sm text-danger">{propertiesResult.error}</p>}
          {!propertiesResult.error && properties.length === 0 && (
            <p className="text-sm text-muted-foreground">No tenés propiedades asignadas. Si es un error, consultá con la administración.</p>
          )}
          <ul className="grid gap-3 sm:grid-cols-2">
            {properties.map((p) => (
              <li key={p.propertyId} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="font-semibold text-foreground">
                  {p.street} {p.propertyNumber}
                </p>
                <p className="text-sm text-muted-foreground">{p.lotName ? `Lote: ${p.lotName}` : "Sin lote"}</p>
                <StatusBadge tone={p.propertyStatus === "Occupied" ? "success" : "neutral"} className="mt-2">
                  {PROPERTY_STATUS[p.propertyStatus] ?? p.propertyStatus}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageContainer>
  );
}
