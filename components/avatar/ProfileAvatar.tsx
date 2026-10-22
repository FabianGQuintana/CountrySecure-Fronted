"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { AvatarPicker } from "./AvatarPicker";
import { UserAvatar } from "./avatars";

/** Avatar grande del perfil con acceso directo al selector. */
export function ProfileAvatar({
  avatar,
  name,
  lastname,
}: {
  avatar?: string | null;
  name?: string | null;
  lastname?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Cambiar avatar"
        title="Cambiar avatar"
      >
        <UserAvatar avatar={avatar} name={name} lastname={lastname} size="lg" />
        <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow group-hover:text-primary">
          <Pencil size={13} aria-hidden />
        </span>
      </button>
      {open && <AvatarPicker current={avatar} name={name} lastname={lastname} onClose={() => setOpen(false)} />}
    </>
  );
}
