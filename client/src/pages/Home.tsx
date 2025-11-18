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
      highlight: 'Trabajo preliminar documentado',
    },
    {
      title: 'Volumen del Problema',
      description: 'Análisis cuantitativo de anomalías detectadas en 739,251 registros de facturación.',
      icon: BarChart3,
      href: '/volumen-problema',
      highlight: '14.4% dispersión de marcas',
    },
    {
      title: 'Proceso Actual',
      description: 'Flujo actual detallado, roles, responsables, fricciones y blockers identificados.',
      icon: Settings,
      href: '/proceso-actual',
      highlight: 'Proceso manual sin integración',
    },
    
    // Fila 2: SOLUCIÓN (Futuro)
    {
      title: 'Propuesta 2026',
      description: 'Integración Odoo-NAF alineada con la operación actual, modelo de servicio mensual y beneficios esperados.',
      icon: Lightbulb,
      href: '/propuesta-2026',
      highlight: 'Cadena de cinco fases técnicas',
    },
    {
      title: 'Detalles Técnicos',
      description: 'Arquitectura de integración, coordinación de equipos, campos críticos y documentación Odoo/NAF.',
      icon: Wrench,
      href: '/detalles-tecnicos',
      highlight: 'Integración Odoo-NAF vía DMS',
    },
    {
      title: 'Sistema de Gestión de Datos',
      description: 'DMS que aprende del negocio, extrae conocimiento en reglas accionables y genera alertas para eficiencia de procesos.',
      icon: Monitor,
      href: '/mantenimiento-dms',
      highlight: 'Aprendizaje continuo + Reglas dinámicas',
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
            Integración de Facturación en Odoo
          </h2>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Promed ya cuenta con automatizaciones sólidas en NAF gracias al trabajo del equipo de TI. Esta fase
            consolida la llegada de Odoo, conectando ambos mundos para profundizar la integración, reducir las
            tareas manuales que quedan y asegurar que los datos críticos continuen fluyendo al General Ledger.
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



        {/* CTA Plan de Trabajo */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/40 via-primary/20 to-blue-200 text-primary-foreground">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)] pointer-events-none" />
            <div className="relative z-10 grid gap-6 md:grid-cols-[3fr,1fr] items-center px-8 py-10">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/80">
                  Plan de Trabajo 2026
                </p>
                <h3 className="text-3xl font-bold leading-snug">
                  Un año de integración coordinada en cinco fases técnicas.
                </h3>
                <p className="text-base text-primary-foreground/90 max-w-2xl">
                  Consulta el roadmap completo, los 67 hitos y el esquema de reuniones que sostienen la operación conjunta
                  entre Alteridad, Gateway y Promed. Cada fase técnica se alinea con los hitos conceptuales (fundación, expansión,
                  sincronización, capacitación y monitoreo) para que las puertas de aprobación sean inequívocas.
                </p>
                <p className="text-sm font-semibold text-primary-foreground/80">
                  Las fases se abren únicamente cuando la puerta conceptual asociada queda aprobada; así evitamos solapamientos
                  y mantenemos los entregables listos para auditoría.
                </p>
              </div>
              <div className="flex justify-end">
                <Link href="/plan-de-trabajo">
                  <Button size="lg" variant="secondary">
                    Ver plan anual
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-12 border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <img src={APP_LOGO} alt="Alteridad" className="h-10 object-contain mb-3" />
              <p className="text-xs font-semibold text-muted-foreground">Alteridad</p>
              <p className="text-xs text-muted-foreground">support@alteridad.org</p>
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
