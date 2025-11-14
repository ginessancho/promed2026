import { FileSearch, BarChart3, Settings, Lightbulb, Wrench, Monitor, Calendar } from 'lucide-react';
import { APP_LOGO } from '@/const';
import PillarCard from '@/components/PillarCard';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Home() {
  const pilares = [
    // Fila 1: DIAGNÓSTICO (Pasado y Presente)
    {
      title: 'Hallazgos 2025',
      description: 'Análisis preliminar, entrevistas y metodología que llevó a la identificación de la necesidad de automatización.',
      icon: FileSearch,
      href: '/hallazgos-2025',
      highlight: '📋 Trabajo preliminar documentado',
      color: 'oklch(0.54 0.18 230)', // Azul Alteridad
    },
    {
      title: 'Volumen del Problema',
      description: 'Análisis cuantitativo de anomalías detectadas en 739,251 registros de facturación.',
      icon: BarChart3,
      href: '/volumen-problema',
      highlight: '📊 14.4% dispersión de marcas',
      color: 'oklch(0.60 0.22 25)', // Rojo Alteridad
    },
    {
      title: 'Proceso Actual',
      description: 'Flujo AS-IS detallado, roles, responsables, fricciones y blockers identificados.',
      icon: Settings,
      href: '/proceso-actual',
      highlight: '⚙️ Proceso manual sin integración',
      color: 'oklch(0.45 0.01 286)', // Gris oscuro
    },
    
    // Fila 2: SOLUCIÓN (Futuro)
    {
      title: 'Propuesta 2026',
      description: 'Solución TO-BE, inversión de $41K, modelo de servicio mensual y beneficios esperados.',
      icon: Lightbulb,
      href: '/propuesta-2026',
      highlight: '📈 Entrega de valor continuo valor',
      color: 'oklch(0.65 0.18 145)', // Verde
    },
    {
      title: 'Detalles Técnicos',
      description: 'Arquitectura de integración, coordinación de equipos, campos críticos y documentación Odoo/NAF.',
      icon: Wrench,
      href: '/detalles-tecnicos',
      highlight: '🔧 Integración Odoo-NAF vía DMS',
      color: 'oklch(0.45 0.15 230)', // Azul oscuro
    },
    {
      title: 'Mantenimiento DMS',
      description: 'DMS que aprende del negocio, extrae conocimiento en reglas accionables y genera alertas para eficiencia de procesos.',
      icon: Monitor,
      href: '/mantenimiento-dms',
      highlight: '🖥️ Aprendizaje continuo + Reglas dinámicas',
      color: 'oklch(0.55 0.20 290)', // Púrpura
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <img src="/logo-promed.webp" alt="Promed" className="h-16 object-contain" />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-foreground">Propuesta F-007</h1>
              <p className="text-xs text-muted-foreground">Proyecto Integración de Facturación NAF-Odoo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transformación Digital de Facturación
          </h2>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Automatización de flujos de facturación mediante integración Odoo-NAF, potenciada por un 
            Data Management System (DMS) que aprende del negocio, extrae conocimiento tácito en reglas 
            accionables y genera alertas proactivas para eficiencia de procesos.
          </p>
        </div>

        {/* Pilares - Fila 1: DIAGNÓSTICO */}
        <div className="mb-10">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-foreground mb-1.5">Diagnóstico</h3>
            <p className="text-sm text-muted-foreground">Análisis del estado actual y problemas identificados</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pilares.slice(0, 3).map((pilar) => (
              <PillarCard key={pilar.href} {...pilar} />
            ))}
          </div>
        </div>

        {/* Pilares - Fila 2: SOLUCIÓN */}
        <div className="mb-10">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-foreground mb-1.5">Solución</h3>
            <p className="text-sm text-muted-foreground">Propuesta técnica y modelo de servicio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pilares.slice(3, 6).map((pilar) => (
              <PillarCard key={pilar.href} {...pilar} />
            ))}
          </div>
        </div>



        {/* Footer Info */}
        <div className="mt-12 border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <img src={APP_LOGO} alt="Alteridad" className="h-10 object-contain mb-3" />
              <p className="text-xs text-muted-foreground">Ginés A. Sánchez Arias</p>
              <p className="text-xs text-muted-foreground">gines@alteridad.org • +33 0664691043</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Preparado para <strong className="text-foreground">Promed, S.A.</strong></p>
              <p className="mt-1">Noviembre 2025 • Versión 4.0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
