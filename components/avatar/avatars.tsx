import { cn } from "@/lib/utils";

/*
 * Avatares ilustrados predefinidos (no se suben fotos). Las claves coinciden con
 * `CountrySecure.Domain.Constants.Avatars` en la API.
 */

export const AVATAR_IDS = ["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"] as const;
export type AvatarId = (typeof AVATAR_IDS)[number];

export function isAvatarId(value: unknown): value is AvatarId {
  return typeof value === "string" && (AVATAR_IDS as readonly string[]).includes(value);
}

interface AvatarArt {
  label: string;
  background: string;
  skin: string;
  hair: string;
  shirt: string;
  /** Peinado: se dibuja detrás (largo) y/o encima (flequillo) de la cara */
  hairBack?: string;
  hairFront: string;
  glasses?: boolean;
}

const ART: Record<AvatarId, AvatarArt> = {
  "avatar-1": {
    label: "Sol",
    background: "#fde68a",
    skin: "#f2c7a5",
    hair: "#7c4a21",
    shirt: "#f59e0b",
    hairFront: "M19 29c0-9 6-15 13-15s13 6 13 15c-3-5-8-8-13-8s-10 3-13 8z",
  },
  "avatar-2": {
    label: "Luna",
    background: "#ddd6fe",
    skin: "#c68e6a",
    hair: "#1f1b2e",
    shirt: "#7c3aed",
    hairBack: "M17 30c0-11 7-17 15-17s15 6 15 17v14H17z",
    hairFront: "M19 29c1-8 6-13 13-13 6 0 11 4 13 11-6 0-12-3-15-7-2 4-6 7-11 9z",
  },
  "avatar-3": {
    label: "Bosque",
    background: "#a7f3d0",
    skin: "#8d5a3b",
    hair: "#111827",
    shirt: "#059669",
    hairFront:
      "M18 28c-2-6 2-12 7-13 2-3 7-4 10-2 4-1 9 2 10 6 3 2 3 6 1 9-2-4-6-6-14-6s-12 2-14 6z",
    glasses: true,
  },
  "avatar-4": {
    label: "Cielo",
    background: "#bae6fd",
    skin: "#f5d3b8",
    hair: "#d4a72c",
    shirt: "#0284c7",
    hairFront: "M19 30c-1-10 5-16 13-16 7 0 13 5 13 13-4-1-9-4-11-8-3 5-9 9-15 11z",
  },
  "avatar-5": {
    label: "Coral",
    background: "#fecdd3",
    skin: "#e0ac85",
    hair: "#9a3412",
    shirt: "#e11d48",
    hairBack: "M26 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0z",
    hairFront: "M19 29c0-9 6-15 13-15s13 6 13 15c-4-4-8-6-13-6s-9 2-13 6z",
  },
};

export const AVATAR_LABELS: Record<AvatarId, string> = Object.fromEntries(
  AVATAR_IDS.map((id) => [id, ART[id].label])
) as Record<AvatarId, string>;

/** Ilustración SVG del avatar (cuadrada, escala al contenedor). */
export function AvatarArtwork({ id, className }: { id: AvatarId; className?: string }) {
  const a = ART[id];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <rect width="64" height="64" fill={a.background} />
      {a.hairBack && <path d={a.hairBack} fill={a.hair} />}
      <path d="M12 64c0-12 9-19 20-19s20 7 20 19z" fill={a.shirt} />
      <rect x="28" y="38" width="8" height="9" rx="3" fill={a.skin} />
      <circle cx="32" cy="29" r="13" fill={a.skin} />
      <path d={a.hairFront} fill={a.hair} />
      <circle cx="27" cy="31" r="1.6" fill="#1f2937" />
      <circle cx="37" cy="31" r="1.6" fill="#1f2937" />
      <path d="M28 35.5c2.4 2.2 5.6 2.2 8 0" stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {a.glasses && (
        <g stroke="#1f2937" strokeWidth="1.4" fill="none">
          <circle cx="27" cy="31" r="3.6" />
          <circle cx="37" cy="31" r="3.6" />
          <path d="M30.6 31h2.8" />
        </g>
      )}
    </svg>
  );
}

const SIZES = {
  sm: "h-9 w-9 text-xs rounded-xl",
  md: "h-11 w-11 text-sm rounded-xl",
  lg: "h-16 w-16 text-xl rounded-2xl",
} as const;

/** Avatar del usuario: la ilustración elegida o, si no eligió ninguna, sus iniciales. */
export function UserAvatar({
  avatar,
  name,
  lastname,
  size = "md",
  className,
}: {
  avatar?: string | null;
  name?: string | null;
  lastname?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const base = cn("shrink-0 overflow-hidden", SIZES[size], className);

  if (isAvatarId(avatar)) {
    return (
      <span className={cn(base, "block ring-1 ring-border")}>
        <AvatarArtwork id={avatar} className="h-full w-full" />
      </span>
    );
  }

  const initials = `${name?.[0] ?? ""}${lastname?.[0] ?? ""}`.toUpperCase();
  return (
    <span className={cn(base, "flex items-center justify-center bg-primary font-bold text-primary-foreground")} aria-hidden>
      {initials || "?"}
    </span>
  );
}
