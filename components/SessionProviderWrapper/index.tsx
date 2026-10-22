"use client";

import { useEffect, useRef } from "react";
import { SessionProvider, useSession } from "next-auth/react";

/**
 * Si el access token de la sesión venció (p. ej. al volver a la pestaña después de horas),
 * recarga la página una sola vez: el proxy lo renueva o, si el refresh token ya no sirve,
 * borra las cookies y lleva a /login. /api/auth/session nunca renueva tokens por su cuenta.
 */
function SessionWatcher() {
  const { data: session } = useSession();
  const reloaded = useRef(false);

  useEffect(() => {
    if (session?.error && !reloaded.current) {
      reloaded.current = true;
      window.location.reload();
    }
  }, [session?.error]);

  return null;
}

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <SessionWatcher />
      {children}
    </SessionProvider>
  );
}
