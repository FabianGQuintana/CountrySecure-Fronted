import type React from "react";

// La redirección de usuarios ya logueados (y la limpieza de sesiones vencidas) la resuelve `proxy.ts`.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
