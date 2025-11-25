import { FileSearch, BarChart3, Settings, Lightbulb, Wrench, Monitor, DollarSign, ArrowLeft } from 'lucide-react';
import PillarCard from '@/components/PillarCard';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function FacturacionIndex() {
  const pilares = [
    // Fila 1: DIAGNÓSTICO (Pasado y Presente)
    {
      title: 'Hallazgos 2025',
      description: 'Análisis preliminar, entrevistas y metodología que llevó a la identificación de la necesidad de automatización.',
      icon: FileSearch,
      href: '/facturacion/hallazgos-2025',
      highlight: 'Trabajo preliminar documentado',
    },
    {
      title: 'Volumen del Problema',
      description: 'Análisis cuantitativo de anomalías detectadas en 739,251 registros de facturación.',
      icon: BarChart3,
      href: '/facturacion/volumen-problema',
      highlight: '14.4% dispersión de marcas',
    },
    {
      title: 'Proceso Actual',
      description: 'Flujo actual detallado, roles, responsables, fricciones y blockers identificados.',
      icon: Settings,
      href: '/facturacion/proceso-actual',
      highlight: 'Proceso manual sin integración',
    },
    
    // Fila 2: SOLUCIÓN (Futuro)
    {
      title: 'Propuesta 2026',
      description: 'Integración Odoo-NAF alineada con la operación actual, modelo de servicio mensual y beneficios esperados.',
      icon: Lightbulb,
      href: '/facturacion/propuesta-2026',
      highlight: 'Cadena de cinco fases técnicas',
    },
    {
      title: 'Detalles Técnicos',
      description: 'Arquitectura de integración, coordinación de equipos, campos críticos y documentación Odoo/NAF.',
      icon: Wrench,
      href: '/facturacion/detalles-tecnicos',
      highlight: 'Integración Odoo-NAF vía DMS',
    },
    {
      title: 'Sistema de Gestión de Datos',
      description: 'DMS que aprende del negocio, extrae conocimiento en reglas accionables y genera alertas para eficiencia de procesos.',
      icon: Monitor,
      href: '/facturacion/mantenimiento-dms',
      highlight: 'Aprendizaje continuo + Reglas dinámicas',
    },
  ];

  const formattedDate = new Intl.DateTimeFormat('es-PA', {
    dateStyle: 'long',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Portal Principal
              </Button>
            </Link>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Integración de Facturación</p>
              <p className="text-xs text-muted-foreground">Actualizado {formattedDate}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* Intro */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Proyecto de Integración
          </p>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Integración de Facturación en Odoo
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Promed ya cuenta con automatizaciones sólidas en NAF gracias al trabajo del equipo de TI. Esta fase
            consolida la llegada de Odoo, conectando ambos mundos para profundizar la integración, reducir las
            tareas manuales que quedan y asegurar que los datos críticos continuen fluyendo al General Ledger.
          </p>
        </div>

        {/* Pilares - Fila 1: DIAGNÓSTICO */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground mb-1">Diagnóstico</h2>
            <p className="text-sm text-muted-foreground">Análisis del estado actual y problemas identificados</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pilares.slice(0, 3).map((pilar) => (
              <PillarCard key={pilar.href} {...pilar} />
            ))}
          </div>
        </div>

        {/* Pilares - Fila 2: SOLUCIÓN */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground mb-1">Solución</h2>
            <p className="text-sm text-muted-foreground">Propuesta técnica y modelo de servicio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pilares.slice(3, 6).map((pilar) => (
              <PillarCard key={pilar.href} {...pilar} />
            ))}
          </div>
        </div>

        {/* CTA Sección */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/facturacion/analisis-costos">
            <div className="p-5 rounded-xl border bg-emerald-50 dark:bg-emerald-950/30 hover:border-emerald-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-foreground">Análisis de Costos</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Modelo financiero interactivo con supuestos ajustables y proyección de ROI.
              </p>
            </div>
          </Link>
          <Link href="/facturacion/plan-de-trabajo">
            <div className="p-5 rounded-xl border bg-sky-50 dark:bg-sky-950/30 hover:border-sky-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="w-5 h-5 text-sky-600" />
                <h3 className="font-semibold text-foreground">Plan de Trabajo 2026</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Gantt, calendario de reuniones, RACI y análisis de riesgos del proyecto.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

