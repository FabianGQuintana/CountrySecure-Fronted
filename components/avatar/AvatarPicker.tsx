"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";
import { updateMyAvatar } from "@/features/users/actions";
import { cn } from "@/lib/utils";
import { AVATAR_IDS, AVATAR_LABELS, AvatarArtwork, UserAvatar, type AvatarId } from "./avatars";

/** Selector de avatar del usuario logueado (cualquier rol). Actualiza la API y la sesión. */
export function AvatarPicker({
  current,
  name,
  lastname,
  onClose,
}: {
  current?: string | null;
  name?: string | null;
  lastname?: string | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [selected, setSelected] = useState<AvatarId | null>((current as AvatarId) ?? null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const result = await updateMyAvatar(selected);
    if (!result.ok) {
      setSaving(false);
      toast.error(result.error);
      return;
    }

    // La sesión (cookie de NextAuth) guarda el avatar para el menú lateral
    await update({ avatar: selected });
    setSaving(false);
    toast.success("Avatar actualizado");
    router.refresh();
    onClose();
  };

  return (
    <Modal title="Elegí tu avatar" onClose={onClose}>
      <div role="radiogroup" aria-label="Avatares disponibles" className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <button
          type="button"
          role="radio"
          aria-checked={selected === null}
          onClick={() => setSelected(null)}
          className={optionClass(selected === null)}
          title="Usar mis iniciales"
        >
          <UserAvatar name={name} lastname={lastname} size="lg" className="h-full w-full rounded-xl" />
          <span className="sr-only">Usar mis iniciales</span>
          {selected === null && <SelectedMark />}
        </button>

        {AVATAR_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected === id}
            onClick={() => setSelected(id)}
            className={optionClass(selected === id)}
            title={AVATAR_LABELS[id]}
          >
            <AvatarArtwork id={id} className="h-full w-full rounded-xl" />
            <span className="sr-only">{AVATAR_LABELS[id]}</span>
            {selected === id && <SelectedMark />}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Tu avatar se muestra en el menú lateral y en tu perfil. Podés cambiarlo cuando quieras.
      </p>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className={secondaryButtonClass} disabled={saving}>
          Cancelar
        </button>
        <button type="button" onClick={save} className={primaryButtonClass} disabled={saving || selected === (current ?? null)}>
          {saving ? "Guardando…" : "Guardar avatar"}
        </button>
      </div>
    </Modal>
  );
}

function optionClass(active: boolean) {
  return cn(
    "relative aspect-square rounded-2xl p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active ? "ring-2 ring-primary bg-primary-soft" : "ring-1 ring-border hover:ring-primary/50"
  );
}

function SelectedMark() {
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
      <Check size={14} aria-hidden />
    </span>
  );
}
