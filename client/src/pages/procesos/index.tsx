import { ArrowLeft, Box, Ship, Wrench, FileWarning, ArrowRight, AlertTriangle, DollarSign, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESOS CRÍTICOS - Los 5 Grandes en un ERP Semi-Muerto
// Metodología: Diagnóstico → Cuantificación → Solución → ROI
// ═══════════════════════════════════════════════════════════════════════════════

interface ProcesoConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  status: 'template' | 'en-analisis' | 'documentado';
  href: string;
  priority: number;
  keyProblems: string[];
  keyQuestions: string[];
  estimatedImpact: string;
  color: string;
}

const procesos: ProcesoConfig[] = [
  {
    id: 'comodatos',
    title: 'Comodatos + Consignación',
    subtitle: 'Equipos y Consumibles en Cliente',
    icon: Box,
    description: 'Equipos en préstamo (comodato) e inventario en consignación en hospitales. Dos modelos distintos pero con el mismo problema: falta de trazabilidad = fuga de ingresos.',
    status: 'en-analisis',
    href: '/procesos/comodatos',
    priority: 2,
    keyProblems: [
      'No hay single source of truth: NAF, Excel Comercial, Excel Servicio → ninguna coincide',
      'Comodatos: equipos en uso sin facturar fee mensual, consumibles, uso mínimo',
      'Consignación: inventario en hospitales sin control de uso → nunca se factura',
      'Activos fantasma: equipos y stock en campo sin ubicación ni responsable',
    ],
    keyQuestions: [
      '¿Cómo saben HOY qué comodatos y consignaciones existen, y si se facturan correctamente?',
      '¿Cuánto inventario en consignación se "pierde" sin reporte de uso?',
      '¿Con qué frecuencia descubren activos o stock perdido durante auditorías?',
    ],
    estimatedImpact: 'Alto: Revenue leakage + Riesgo auditoría',
    color: 'blue',
  },
  {
    id: 'administracion',
    title: 'Administración Operacional',
    subtitle: 'Multas + Pagos que Bloquean',
    icon: Gavel,
    description: 'Multas por incumplimiento de tiempos (SLAs, entregas, regulatorio) y pagos a proveedores que detienen mercancía. El costo oculto de la desorganización.',
    status: 'en-analisis',
    href: '/procesos/administracion',
    priority: 3,
    keyProblems: [
      'Multas contractuales: SLAs incumplidos con hospitales generan penalidades',
      'Pagos AP bloquean operaciones: proveedores retienen mercancía por facturas vencidas',
      'Sin visibilidad de deadlines: fechas críticas en Excel o cabeza de alguien',
      'Cash flow impredecible: no hay forecast de pagos urgentes vs mercancía en riesgo',
    ],
    keyQuestions: [
      '¿Cuánto pagan anualmente en multas por incumplimiento de tiempos?',
      '¿Con qué frecuencia un proveedor retiene mercancía por pagos pendientes?',
      '¿Existe un dashboard de "pagos urgentes" vs "mercancía bloqueada"?',
    ],
    estimatedImpact: 'Alto: Dinero perdido + Operaciones bloqueadas',
    color: 'rose',
  },
  {
    id: 'servicio-tecnico',
    title: 'Servicio Técnico',
    subtitle: 'Service-to-Cash + Compliance',
    icon: Wrench,
    description: 'Órdenes de trabajo, técnicos en campo, repuestos, garantías. Si está roto, pierden dinero (servicio no facturado) y cumplimiento (SLAs, trazabilidad).',
    status: 'en-analisis',
    href: '/procesos/servicio-tecnico',
    priority: 4,
    keyProblems: [
      'OT fuera del sistema: PDF, Word, WhatsApp, sin captura estructurada en ERP',
      'Partes y labor no facturadas: repuestos salen de inventario pero no aparecen en factura',
      'Sin tracking de SLA: tiempos de respuesta y resolución no medidos',
      'Historial no ligado a serial: imposible ver contrato + servicios + facturas por equipo',
    ],
    keyQuestions: [
      '¿Cómo nace, se ejecuta, se cierra y se factura una OT en la vida real?',
      '¿Cuántas OT terminan sin factura, o con factura faltando partes/horas?',
      '¿Pueden ver, para un serial, el historial completo de servicio + contrato + facturas?',
    ],
    estimatedImpact: 'Alto: Servicio no facturado + Riesgo regulatorio',
    color: 'violet',
  },
  {
    id: 'importaciones',
    title: 'Importaciones + Costeo',
    subtitle: 'Import-to-Stock',
    icon: Ship,
    description: 'Landed cost, recepciones parciales, documentos de aduana. Si está mal, márgenes, pricing y rentabilidad son ficción.',
    status: 'en-analisis',
    href: '/procesos/importaciones',
    priority: 5,
    keyProblems: [
      'Landed cost en Excel: flete, seguro, aranceles prorrateados "aproximadamente"',
      'Desconexión físico vs sistema: parciales, backorders, sustituciones mal reflejadas',
      'Items en tránsito sin dueño: mercancía atrapada en estatus intermedio por semanas',
      'Posting retrasado: mercancía física disponible pero no en ERP por lag de papeles',
    ],
    keyQuestions: [
      '¿Cómo se calcula el landed cost hoy, paso a paso? ¿Quién tiene la verdad?',
      '¿Con qué frecuencia ven márgenes negativos o raros que son errores de costeo?',
      '¿Qué tan grande es la brecha entre inventario físico vs ERP post-importación?',
    ],
    estimatedImpact: 'Alto: Márgenes ficticios + Decisiones erróneas',
    color: 'amber',
  },
];

const getStatusBadge = (status: ProcesoConfig['status']) => {
  switch (status) {
    case 'documentado':
      return <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Documentado</span>;
    case 'en-analisis':
      return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">En análisis</span>;
    default:
      return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Template</span>;
  }
};

const getPriorityBadge = (priority: number) => {
  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-bold">
      #{priority}
    </span>
  );
};

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    blue: { bg: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900', border: 'border-blue-200 dark:border-blue-800', icon: 'text-blue-600' },
    violet: { bg: 'from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900', border: 'border-violet-200 dark:border-violet-800', icon: 'text-violet-600' },
    amber: { bg: 'from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-600' },
    rose: { bg: 'from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900', border: 'border-rose-200 dark:border-rose-800', icon: 'text-rose-600' },
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
        <section className="space-y-4 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Diagnóstico de Fugas Operacionales
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            Los 5 Procesos Críticos a Atacar
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            En una empresa con "ERP semi-muerto + Excel por todos lados" como PROMED, estos son 
            los procesos donde se pierde dinero, tiempo y cumplimiento. Cada uno sigue la misma 
            metodología: <strong>¿Dónde hay re-tipeo manual? ¿Dónde se pierde dinero? ¿Dónde nadie 
            confía en los datos? ¿Dónde los auditores dan dolores de cabeza?</strong>
          </p>
        </section>

        {/* Priority Context */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Orden de Prioridad</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>#1 Facturación</strong> (ya documentado) → 
                  <strong> #2 Comodatos + Consignación</strong> → 
                  <strong> #3 Administración Operacional</strong> → 
                  <strong> #4 Servicio Técnico</strong> → 
                  <strong> #5 Importaciones + Costeo</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Cards */}
        <section className="space-y-6">
          {procesos.map((proceso) => {
            const Icon = proceso.icon;
            const colors = getColorClasses(proceso.color);
            
            return (
              <Card 
                key={proceso.id} 
                className={`bg-gradient-to-br ${colors.bg} ${colors.border}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg bg-white/60 dark:bg-black/20`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-xl">{proceso.title}</CardTitle>
                          {getPriorityBadge(proceso.priority)}
                          {getStatusBadge(proceso.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{proceso.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    {proceso.description}
                  </p>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* Key Problems */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Problemas típicos en "ERP muerto"
                      </p>
                      <ul className="space-y-1.5">
                        {proceso.keyProblems.map((problem, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Questions */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Preguntas para explorar
                      </p>
                      <ul className="space-y-1.5">
                        {proceso.keyQuestions.map((question, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Impact & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/30 dark:border-black/10">
                    <div>
                      <p className="text-xs text-muted-foreground">Impacto estimado</p>
                      <p className="text-sm font-semibold text-foreground">{proceso.estimatedImpact}</p>
                    </div>
                    <Link href={proceso.href}>
                      <Button variant="secondary" size="sm" className="gap-1">
                        Ver análisis completo
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Facturación Reference */}
        <Card className="border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/30">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900">
                  <FileWarning className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">Facturación / Order-to-Cash</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-bold">#1</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Documentado</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    El proceso con mayor impacto en cash. Ya documentado extensamente en el portal 
                    con 739K registros analizados, anomalías detectadas, y propuesta de automatización.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Problemas:</strong> Re-tipeo manual Quote→PO→Excel→NAF→Portal, ciclos lentos, 
                    alta tasa de correcciones, pricing en emails, facturación perdida.
                  </p>
                </div>
              </div>
              <Link href="/facturacion">
                <Button variant="outline" size="sm" className="gap-1">
                  Ver módulo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Methodology Note */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-foreground mb-2">Metodología de Análisis por Proceso</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Para cada proceso, el workshop debe responder:
            </p>
            <div className="grid gap-4 md:grid-cols-4 text-sm">
              {[
                { icon: '🔁', label: '¿Dónde hay re-tipeo manual?', detail: 'Sistemas desconectados, copy-paste' },
                { icon: '💸', label: '¿Dónde se pierde dinero?', detail: 'No facturado, tarde, mal facturado' },
                { icon: '🤷', label: '¿Dónde nadie confía en los datos?', detail: 'Excel paralelo, "yo tengo mi versión"' },
                { icon: '📋', label: '¿Dónde duelen las auditorías?', detail: 'Reguladores, auditorías internas' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Step CTA */}
        <Card className="bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-950 dark:to-sky-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">¿Siguiente paso?</h3>
                <p className="text-sm text-muted-foreground">
                  Prioridad actual: <strong>Comodatos + Consignación</strong>. Mapear el 
                  <strong> proceso actual vs "should-be"</strong> en detalle brutal. 
                  Eso define qué debe hacer NetSuite el día 1.
                </p>
              </div>
              <Link href="/procesos/comodatos">
                <Button className="gap-1">
                  Empezar con Comodatos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-6 border-t">
          <p>
            Análisis basado en metodología de diagnóstico para empresas con ERP legacy. 
            Los hallazgos específicos se completarán con workshops por área.
          </p>
        </div>
      </main>
    </div>
  );
}
