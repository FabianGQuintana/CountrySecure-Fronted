import type { NextConfig } from "next";

import path from "node:path";

const nextConfig: NextConfig = {
  // Evita el aviso de "multiple lockfiles" y fija la raíz del proyecto
  turbopack: { root: path.resolve(__dirname) },
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
