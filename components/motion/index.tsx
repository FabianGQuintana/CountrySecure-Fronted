"use client";

import { LazyMotion } from "framer-motion";

/**
 * framer-motion con carga diferida: las páginas importan `motion` desde acá (es el componente
 * liviano `m`) y las features de animación se descargan en un chunk aparte, después del primer render.
 * Así el bundle inicial de cada página no carga los ~30 KB del `motion` completo.
 */
const loadFeatures = () => import("./features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}

export { m as motion, AnimatePresence } from "framer-motion";
