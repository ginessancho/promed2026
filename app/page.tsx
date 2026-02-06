"use client";

import { 
  FileText, 
  Database, 
  Cog, 
  ArrowRight, 
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { APP_LOGO } from '@/shared/const';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL PRINCIPAL - CONSULTORÍA ESTRATÉGICA PROMED 2026
// Mega Dashboard con acceso a todas las iniciativas
// ═══════════════════════════════════════════════════════════════════════════════

interface InitiativeConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ElementType;
  status: 'activo' | 'en-desarrollo' | 'planificado' | 'pausa';
  metrics: Array<{ label: string; value: string; trend?: 'up' | 'down' | 'neutral'; }>;
  color: {
    bg: string;
    border: string;
    icon: string;
    badge: string;
  };
}

const initiatives: InitiativeConfig[] = [
  {
    id: 'facturacion',
    title: 'Integración de Facturación',
    subtitle: 'Odoo ↔ NAF',
    description: 'Automatización del flujo de facturación entre Odoo y NAF. Eliminación de procesos manuales y reducción de errores.',
    href: '/facturacion',
    icon: FileText,
    status: 'pausa',
    metrics: [
      { label: 'Registros analizados', value: '739K' },
      { label: 'Anomalías detectadas', value: '14.4%' },
      { label: 'ROI proyectado', value: '<3 meses' },
    ],
    color: {
      bg: 'from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900',
      border: 'border-sky-200 dark:border-sky-800',
      icon: 'text-sky-600',
      badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
    },
  },
  {
    id: 'erp',
    title: 'Migración ERP',
    subtitle: 'NAF 6.0 → Odoo',
    description: 'Evaluación estratégica para reemplazar el ERP legacy. Análisis costo-beneficio y mapeo de módulos.',
    href: '/erp',
    icon: Database,
    status: 'en-desarrollo',
    metrics: [
      { label: 'Usuarios impactados', value: '600+' },
      { label: 'Países', value: '7' },
      { label: 'Timeline', value: '12-14 meses' },
    ],
    color: {
      bg: 'from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    },
  },
  {
    id: 'procesos',
    title: 'Procesos Críticos',
    subtitle: 'Comodatos, Activos, Servicio',
    description: 'Diagnóstico de activos en comodato con datos reales de NAF6. Visibilidad sobre 9,354 activos y brechas de registro.',
    href: '/procesos',
    icon: Cog,
    status: 'activo',
    metrics: [
      { label: 'Activos analizados', value: '9,354' },
      { label: 'Sin contrato', value: '5,674' },
      { label: 'En riesgo', value: '$570M' },
    ],
    color: {
      bg: 'from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900',
      border: 'border-violet-200 dark:border-violet-800',
      icon: 'text-violet-600',
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
    },
  },
];

const getStatusBadge = (status: InitiativeConfig['status']) => {
  const styles = {
    'activo': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    'en-desarrollo': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    'planificado': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    'pausa': 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  };
  const labels = {
    'activo': 'Activo',
    'en-desarrollo': 'En desarrollo',
    'planificado': 'Planificado',
    'pausa': 'En pausa',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// Resumen ejecutivo global
const executiveSummary = {
  totalInitiatives: 3,
  activeProjects: 1,
  estimatedSavings: 'Por cuantificar',
  timeline: '2026',
};

export default function Home() {
  const formattedDate = new Intl.DateTimeFormat('es-PA', {
    dateStyle: 'long',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50/50 to-primary/5 dark:via-slate-950/50 dark:to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo-promed.webp" alt="Promed" className="h-14 object-contain" />
              <div className="border-l pl-4">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Alteridad Consultoría
                </p>
                <h1 className="text-lg font-bold text-foreground">
                  Diagnóstico Operativo 2026
                </h1>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Actualizado {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-10">
        {/* Executive Summary */}
        <section className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Iniciativas</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{executiveSummary.totalInitiatives}</p>
              <p className="text-xs text-muted-foreground">proyectos estratégicos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Activos</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{executiveSummary.activeProjects}</p>
              <p className="text-xs text-muted-foreground">en ejecución</p>
            </CardContent>
          </Card>
          <Card className="border-dashed">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Ahorro Potencial</span>
              </div>
              <p className="text-xl font-bold text-muted-foreground">{executiveSummary.estimatedSavings}</p>
              <p className="text-xs text-muted-foreground">pendiente análisis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Horizonte</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{executiveSummary.timeline}</p>
              <p className="text-xs text-muted-foreground">año de ejecución</p>
            </CardContent>
          </Card>
        </section>

        {/* Initiatives Grid */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Áreas de Diagnóstico</h2>
            <p className="text-sm text-muted-foreground">
              Análisis basado en datos de los sistemas actuales de PROMED
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {initiatives.map((initiative) => {
              const Icon = initiative.icon;
              return (
                <Link key={initiative.id} href={initiative.href}>
                  <Card 
                    className={`h-full bg-gradient-to-br ${initiative.color.bg} ${initiative.color.border} 
                      hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-2.5 rounded-xl bg-white/60 dark:bg-black/20`}>
                          <Icon className={`w-6 h-6 ${initiative.color.icon}`} />
                        </div>
                        {getStatusBadge(initiative.status)}
                      </div>
                      <div className="space-y-1 pt-2">
                        <CardTitle className="text-xl">{initiative.title}</CardTitle>
                        <p className="text-sm font-medium text-muted-foreground">{initiative.subtitle}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {initiative.description}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-2">
                        {initiative.metrics.map((metric) => (
                          <div 
                            key={metric.label} 
                            className="text-center p-2 rounded-lg bg-white/50 dark:bg-black/10"
                          >
                            <p className="text-lg font-bold text-foreground">{metric.value}</p>
                            <p className="text-xs text-muted-foreground leading-tight">{metric.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-end pt-2">
                        <Button variant="ghost" size="sm" className={`gap-1 ${initiative.color.icon}`}>
                          Explorar
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Context Note */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-5">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground">Metodología</h3>
                <p className="text-sm text-muted-foreground">
                  Cada análisis parte de los datos reales de PROMED: consultas directas a NAF6, Redshift 
                  y los sistemas operativos. Los hallazgos se presentan con evidencia verificable.
                </p>
              </div>
              <div className="flex flex-col gap-2 md:w-48">
                <p className="text-xs text-muted-foreground">Metodología</p>
                <div className="flex flex-wrap gap-2">
                  {['Diagnóstico', 'Cuantificación', 'Solución', 'ROI'].map((step) => (
                    <span key={step} className="px-2 py-1 rounded bg-muted text-xs">
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="pt-6 border-t">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={APP_LOGO} alt="Alteridad" className="h-10 object-contain" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Consultoría: Alteridad</p>
                <p className="text-xs text-muted-foreground">gsanchezarias@promed-sa.com</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground md:text-right">
              <p>Preparado para <strong className="text-foreground">Promed, S.A.</strong></p>
              <p className="mt-1">Febrero 2026 • Portal v6.0</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
