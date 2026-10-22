"use client";

import { useSyncExternalStore } from "react";

const MINUTE_MS = 60_000;

function subscribe(onChange: () => void) {
  const interval = setInterval(onChange, MINUTE_MS / 4);
  return () => clearInterval(interval);
}

// Redondeado al minuto: el snapshot solo cambia cuando cambia lo que se muestra
const getSnapshot = () => Math.floor(Date.now() / MINUTE_MS) * MINUTE_MS;
// En el servidor no se muestra la hora (sería la del servidor y rompería la hidratación)
const getServerSnapshot = () => null;

/** Reloj del panel con la hora y fecha locales del navegador. */
export default function LiveClock({ className }: { className?: string }) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const time = now === null ? null : new Date(now);

  return (
    <div className="text-center min-w-48">
      <div className={`text-3xl font-bold ${className ?? ""}`}>
        {time ? time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--"}
      </div>
      <div className="text-muted-foreground text-sm mt-1">
        {time
          ? time.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
          : " "}
      </div>
    </div>
  );
}
