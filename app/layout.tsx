import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proyecto de Integración de Facturación en Odoo",
  description: "Portal de Consultoría Estratégica para Promed 2026 - Iniciativas de Transformación Digital",
  icons: {
    icon: "/logo-alteridad.png",
    apple: "/logo-alteridad.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
