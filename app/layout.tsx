import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diagnóstico Operativo PROMED 2026",
  description: "Visibilidad sobre procesos, activos y sistemas — Alteridad Consultoría",
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
