import type { NextConfig } from "next";

import path from "node:path";

const nextConfig: NextConfig = {
  // Evita el aviso de "multiple lockfiles" y fija la raíz del proyecto
  turbopack: { root: path.resolve(__dirname) },
  outputFileTracingRoot: path.resolve(__dirname),

  // Las fotos de /public/images pesan ~700 KB en PNG: next/image las sirve en AVIF/WebP al tamaño justo
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
};

export default nextConfig;
