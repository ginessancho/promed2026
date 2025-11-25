import { ArrowLeft, Box, Truck, Wrench, FileWarning, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: Procesos Críticos
// Cada proceso tiene la misma estructura para facilitar la comparación
// ═══════════════════════════════════════════════════════════════════════════════

interface ProcesoConfig {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  status: 'template' | 'en-analisis' | 'documentado';
  href: string;
  keyMetrics: Array<{ label: string; value: string; }>;
  painPoints: string[];
  estimatedImpact: string;
  color: string;
}

const procesos: ProcesoConfig[] = [
  {
    id: 'comodatos',
    title: 'Gestión de Comodatos',
    icon: Box,
    description: 'Control y trazabilidad de activos entregados en comodato a clientes. Incluye registro, seguimiento y recuperación.',
    status: 'template',
    href: '/procesos/comodatos',
    keyMetrics: [
      { label: 'Facturas con indicador sin activo', value: '53' },
      { label: 'Facturas con activo sin indicador', value: '17' },
      { label: 'Inconsistencias detectadas', value: '70' },
    ],
    painPoints: [
      'Falta de trazabilidad de activos en comodato',
      'Inconsistencias entre indicadores y números de activo',
      'Dificultad para auditar y recuperar equipos',
    ],
    estimatedImpact: 'Por cuantificar',
    color: 'blue',
  },
  {
    id: 'activos-fijos',
    title: 'Activos Fijos',
    icon: Truck,
    description: 'Gestión del ciclo de vida de activos fijos: adquisición, depreciación, mantenimiento y disposición.',
    status: 'template',
    href: '/procesos/activos',
    keyMetrics: [
      { label: 'Activos registrados', value: 'TBD' },
      { label: 'Categorías de activos', value: 'TBD' },
      { label: 'Valor en libros', value: 'TBD' },
    ],
    painPoints: [
      'Proceso de depreciación manual',
      'Falta de integración con contabilidad',
      'Dificultad para tracking de ubicación física',
    ],
    estimatedImpact: 'Por cuantificar',
    color: 'emerald',
  },
  {
    id: 'servicio-tecnico',
    title: 'Servicio Técnico',
    icon: Wrench,
    description: 'Gestión de órdenes de servicio, técnicos en campo, repuestos y garantías de dispositivos médicos.',
    status: 'template',
    href: '/procesos/servicio-tecnico',
    keyMetrics: [
      { label: 'Técnicos activos', value: '150' },
      { label: 'Órdenes de servicio/año', value: 'TBD' },
      { label: 'SLA promedio', value: 'TBD' },
    ],
    painPoints: [
      'Coordinación de técnicos en campo',
      'Gestión de inventario de repuestos',
      'Trazabilidad de garantías',
    ],
    estimatedImpact: 'Por cuantificar',
    color: 'violet',
  },
  {
    id: 'importaciones',
    title: 'Importaciones',
    icon: FileWarning,
    description: 'Consolidación de mercancía, facturas estimadas, envíos y control de costos de importación.',
    status: 'template',
    href: '/procesos/importaciones',
    keyMetrics: [
      { label: 'Usuarios módulo', value: '80' },
      { label: 'OC proveedores/año', value: '41,573' },
      { label: 'Países origen', value: 'TBD' },
    ],
    painPoints: [
      'Consolidación manual de mercancía',
      'Facturas estimadas vs reales',
      'Trazabilidad de envíos parciales',
    ],
    estimatedImpact: 'Por cuantificar',
    color: 'amber',
  },
];

const getStatusBadge = (status: ProcesoConfig['status']) => {
  switch (status) {
    case 'documentado':
      return <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">Documentado</span>;
    case 'en-analisis':
      return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">En análisis</span>;
    default:
      return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">Template</span>;
  }
};

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    blue: { bg: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900', border: 'border-blue-200', icon: 'text-blue-600' },
    emerald: { bg: 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900', border: 'border-emerald-200', icon: 'text-emerald-600' },
    violet: { bg: 'from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900', border: 'border-violet-200', icon: 'text-violet-600' },
    amber: { bg: 'from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900', border: 'border-amber-200', icon: 'text-amber-600' },
  };
  return colors[color] || colors.blue;
};

export default function ProcesosIndex() {
  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50/30 to-gray-50/20 dark:via-slate-950/10 dark:to-gray-950/10">
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
              <p className="text-sm font-semibold text-foreground">Procesos Críticos</p>
              <p className="text-xs text-muted-foreground">Actualizado {formattedDate}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-10">
        {/* Hero */}
        <section className="space-y-4 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Análisis de Fugas Operacionales
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            Procesos Críticos de PROMED
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Más allá de facturación, existen procesos clave que presentan fricciones, fugas de tiempo 
            y pérdidas potenciales. Esta sección documenta cada proceso con la misma metodología: 
            diagnóstico, cuantificación del impacto y propuesta de mejora.
          </p>
        </section>

        {/* Process Cards */}
        <section className="grid gap-6 md:grid-cols-2">
          {procesos.map((proceso) => {
            const Icon = proceso.icon;
            const colors = getColorClasses(proceso.color);
            
            return (
              <Card 
                key={proceso.id} 
                className={`bg-gradient-to-br ${colors.bg} ${colors.border} hover:shadow-md transition-shadow`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white/60 dark:bg-black/20`}>
                        <Icon className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{proceso.title}</CardTitle>
                        {getStatusBadge(proceso.status)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {proceso.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    {proceso.keyMetrics.map((metric) => (
                      <div key={metric.label} className="text-center p-2 rounded bg-white/50 dark:bg-black/10">
                        <p className="text-lg font-bold text-foreground">{metric.value}</p>
                        <p className="text-xs text-muted-foreground leading-tight">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pain Points */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">Fricciones identificadas:</p>
                    <ul className="space-y-1">
                      {proceso.painPoints.map((point, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/50" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-black/10">
                    <div>
                      <p className="text-xs text-muted-foreground">Impacto estimado</p>
                      <p className="text-sm font-semibold text-foreground">{proceso.estimatedImpact}</p>
                    </div>
                    <Link href={proceso.href}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Ver detalle
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Methodology Note */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-foreground mb-2">Metodología de Análisis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cada proceso sigue la misma estructura para facilitar la comparación y priorización:
            </p>
            <div className="grid gap-3 md:grid-cols-4 text-sm">
              {[
                { step: '1', label: 'Mapeo del proceso actual', detail: 'Flujo, actores, sistemas' },
                { step: '2', label: 'Identificación de fricciones', detail: 'Pain points, workarounds' },
                { step: '3', label: 'Cuantificación del impacto', detail: 'Horas, costos, riesgos' },
                { step: '4', label: 'Propuesta de mejora', detail: 'Solución, ROI, timeline' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-6 border-t">
          <p>
            Esta sección está en desarrollo. Los análisis se completarán a medida que se 
            recopile información de cada área.
          </p>
        </div>
      </main>
    </div>
  );
}

