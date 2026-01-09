import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better debugging
  reactStrictMode: true,

  // Turbopack for faster dev builds (Next.js 15+)
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react", "recharts", "@radix-ui/react-icons"],
  },

  // Webpack configuration for compatibility
  webpack: (config) => {
    // Handle native modules that shouldn't be bundled
    config.externals = [...(config.externals || []), "better-sqlite3"];
    return config;
  },

  // Image optimization
  images: {
    remotePatterns: [],
  },

  // Redirects for legacy routes (if needed)
  async redirects() {
    return [
      // Legacy routes that were at root level now under /facturacion
      { source: "/hallazgos-2025", destination: "/facturacion/hallazgos-2025", permanent: true },
      { source: "/volumen-problema", destination: "/facturacion/volumen-problema", permanent: true },
      { source: "/proceso-actual", destination: "/facturacion/proceso-actual", permanent: true },
      { source: "/propuesta-2026", destination: "/facturacion/propuesta-2026", permanent: true },
      { source: "/detalles-tecnicos", destination: "/facturacion/detalles-tecnicos", permanent: true },
      { source: "/mantenimiento-dms", destination: "/facturacion/mantenimiento-dms", permanent: true },
      { source: "/analisis-costos", destination: "/facturacion/analisis-costos", permanent: true },
      { source: "/plan-de-trabajo", destination: "/facturacion/plan-de-trabajo", permanent: true },
      { source: "/demonstracion", destination: "/facturacion/demonstracion", permanent: true },
    ];
  },
};

export default nextConfig;
