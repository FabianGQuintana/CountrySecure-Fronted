"use client";

import { useEffect } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";

/**
 * Si la sesión quedó inválida (token vencido que no se pudo renovar), cierra la sesión una sola vez
 * y lleva al login con un mensaje, en lugar de dejar al usuario en una sesión "zombi".
 */
function SessionWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error) {
      signOut({ callbackUrl: "/login?reason=expired" });
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
