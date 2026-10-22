import {
  Building2,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Map,
  QrCode,
  ScanLine,
  ShieldCheck,
  Star,
  UserCircle,
  Users,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  /** Título opcional de la sección (agrupa ítems relacionados) */
  title?: string;
  items: NavItem[];
}

export interface RoleNavigation {
  /** Texto bajo el nombre del usuario */
  subtitle: string;
  /** A dónde lleva el encabezado del menú */
  homeHref: string;
  sections: NavSection[];
}

// Única definición de los menús: agregar una pantalla = agregar un ítem acá.
export const NAVIGATION: Record<Role, RoleNavigation> = {
  Admin: {
    subtitle: "Administración",
    homeHref: "/admin",
    sections: [
      { items: [{ label: "Inicio", href: "/admin", icon: LayoutDashboard }] },
      {
        title: "Usuarios",
        items: [
          { label: "Residentes", href: "/admin/users/residentes", icon: Users },
          { label: "Personal de seguridad", href: "/admin/users/seguridad", icon: ShieldCheck },
        ],
      },
      {
        title: "Amenities",
        items: [
          { label: "Amenities", href: "/admin/amenities", icon: Star },
          { label: "Reservas", href: "/admin/reservas", icon: CalendarDays },
        ],
      },
      {
        title: "Servicios",
        items: [
          { label: "Proveedores", href: "/admin/orders", icon: Wrench },
          { label: "Solicitudes", href: "/admin/requests", icon: Inbox },
        ],
      },
      {
        title: "Propiedad",
        items: [
          { label: "Propiedades", href: "/admin/propiedades", icon: Building2 },
          { label: "Lotes", href: "/admin/lotes", icon: Map },
        ],
      },
    ],
  },
  Resident: {
    subtitle: "Residente",
    homeHref: "/resident/dashboard",
    sections: [
      {
        items: [
          { label: "Inicio", href: "/resident/dashboard", icon: Home },
          { label: "Mi perfil", href: "/resident/profile", icon: UserCircle },
          { label: "Reservar amenities", href: "/resident/amenities", icon: Star },
          { label: "Solicitar permisos", href: "/resident/permits", icon: KeyRound },
          { label: "Mis pases", href: "/resident/passes", icon: QrCode },
          { label: "Mis reservas", href: "/resident/reservations", icon: CalendarDays },
          { label: "Solicitudes", href: "/resident/requests", icon: Wrench },
        ],
      },
    ],
  },
  Security: {
    subtitle: "Seguridad",
    homeHref: "/security/visit",
    sections: [
      {
        items: [
          { label: "Escanear QR", href: "/security/scan", icon: ScanLine },
          { label: "Visitas de hoy", href: "/security/visit", icon: CalendarCheck },
          { label: "Registro de entradas", href: "/security/logs", icon: ClipboardList },
          { label: "Permisos", href: "/security/permissions", icon: KeyRound },
          { label: "Servicios", href: "/security/services", icon: Wrench },
          { label: "Visitas de familiares", href: "/security/family-visits", icon: Users },
          { label: "Cámaras de seguridad", href: "/security/securityCameras", icon: Video },
        ],
      },
    ],
  },
};

/** Un ítem está activo en su ruta exacta o en cualquier subruta (excepto la raíz de la sección). */
export function isActivePath(pathname: string, href: string, sectionRoot: string): boolean {
  if (pathname === href) return true;
  return href !== sectionRoot && pathname.startsWith(`${href}/`);
}
