import { ArrowLeft, Lightbulb, CheckCircle2, GitBranch, Shield, Zap, DollarSign, Calendar, Layers, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { comparisonDiagram } from '@/data/diagrams';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PhaseTimeline from '@/components/PhaseTimeline';
import { trpc } from '@/lib/trpc';


export default function Propuesta2026() {
  const { data: intro } = trpc.proposal.getIntro.useQuery();
  const { data: phasesData } = trpc.proposal.listPhases.useQuery();

  const beneficios = [
    'Eliminación de entrada manual duplicada',
    'Reducción de errores de transcripción',
    'Automatización del flujo Odoo → NAF',
    'Validaciones automáticas en origen',
    'Reglas de negocio centralizadas',
    'Visibilidad en tiempo real',
    'Base para futuras integraciones',
    'Mejora continua del ecosistema',
  ];

  const accentStyles = {
    blue: {
      border: 'border-l-slate-600',
      badge: 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800',
      badgeTitle: 'text-slate-900 dark:text-slate-100',
      badgeBody: 'text-slate-800 dark:text-slate-200',
    },
    emerald: {
      border: 'border-l-slate-600',
      badge: 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800',
      badgeTitle: 'text-slate-900 dark:text-slate-100',
      badgeBody: 'text-slate-800 dark:text-slate-200',
    },
    purple: {
      border: 'border-l-slate-600',
      badge: 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800',
      badgeTitle: 'text-slate-900 dark:text-slate-100',
      badgeBody: 'text-slate-800 dark:text-slate-200',
    },
    amber: {
      border: 'border-l-slate-600',
      badge: 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800',
      badgeTitle: 'text-slate-900 dark:text-slate-100',
      badgeBody: 'text-slate-800 dark:text-slate-200',
    },
    rose: {
      border: 'border-l-slate-600',
      badge: 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800',
      badgeTitle: 'text-slate-900 dark:text-slate-100',
      badgeBody: 'text-slate-800 dark:text-slate-200',
    },
  } as const;

  type AccentKey = keyof typeof accentStyles;

  const staticPhases: Array<{
    technical: string;
    concept: string;
    duration: string;
    gate: string;
    accentKey: AccentKey;
    objective: string;
    deliverables: { category: string; items: string[] }[];
    outcome: string;
  }> = [
    {
      technical: 'Fase 1: Diseño',
      concept: 'Fundación',
      duration: 'Enero - Febrero 2026 (8 semanas)',
      gate: 'Blueprint aprobado y casos piloto listos.',
      accentKey: 'blue',
      objective: 'Definir el modelo de datos, reglas y gobernanza que permiten replicar el F-007 digital sin depender del formulario físico.',
      deliverables: [
        { category: 'Análisis y Diseño', items: ['Auditoría completa de campos Odoo ↔ NAF', 'Mapeo de datos detallado (campo por campo)', 'Diseño técnico del Conector Directo v1.0'] },
        { category: 'Gobernanza', items: ['Catálogo de validaciones priorizadas', 'Backlog del DMS con reglas iniciales', 'Checklist de ambientes y accesos'] },
        { category: 'Piloto', items: ['Definición de casos de uso de prueba', 'Dashboards de seguimiento inicial', 'Plan de adopción temprana'] },
      ],
      outcome: 'Reducción visible de tiempos para un segmento piloto y hoja de ruta técnica validada.',
    },
    {
      technical: 'Fase 2: Desarrollo',
      concept: 'Expansión sin F-007',
      duration: 'Marzo - Mayo 2026 (12 semanas)',
      gate: 'Automatización lista para cubrir todos los escenarios de facturación.',
      accentKey: 'emerald',
      objective: 'Construir los módulos Odoo/NAF, evolucionar el conector y eliminar la dependencia del formulario F-007.',
      deliverables: [
        { category: 'Desarrollo', items: ['Módulo Odoo custom y colas de integración', 'Conector REST/PL-SQL con idempotencia', 'Scripts de depuración del catálogo de servicios'] },
        { category: 'Reglas', items: ['Motor de Business Rules con aprendizaje continuo', 'Alertas proactivas por marca, comodatos y folios físicos', 'Documentación de SLA por regla'] },
        { category: 'Implementación', items: ['Migración progresiva de tipos de facturación', 'Plan de apagado del F-007', 'Gestión del cambio con los equipos clave'] },
      ],
      outcome: 'Eliminación casi total de la entrada manual duplicada y adopción del flujo digital.',
    },
    {
      technical: 'Fase 3: Pruebas',
      concept: 'Sincronización bidireccional',
      duration: 'Junio - Julio 2026 (8 semanas)',
      gate: 'Pruebas end-to-end y retroalimentación NAF → Odoo con visibilidad total.',
      accentKey: 'purple',
      objective: 'Cerrar el ciclo validando integraciones, webhooks y paneles operativos antes del go-live.',
      deliverables: [
        { category: 'Pruebas Unitarias', items: ['Test suites de módulo Odoo', 'Simulación de payloads hacia NAF', 'Pruebas de reglas y alertas'] },
        { category: 'Pruebas de Integración', items: ['Odoo ↔ DMS ↔ NAF en staging', 'Pruebas de carga y resiliencia', 'Panel Rayos X con correlation-id'] },
        { category: 'UAT', items: ['Casos de prueba con usuarios', 'Plan de remediación para hallazgos', 'Acta de aprobación final'] },
      ],
      outcome: 'Visibilidad completa del ciclo de vida de la factura y retroalimentación operativa validada.',
    },
    {
      technical: 'Fase 4: Producción',
      concept: 'Puesta en marcha',
      duration: 'Agosto - Septiembre 2026 (6 semanas)',
      gate: 'Go-live controlado y equipos capacitados.',
      accentKey: 'amber',
      objective: 'Migrar datos, desplegar en productivo y transferir conocimiento a los equipos operativos.',
      deliverables: [
        { category: 'Migración', items: ['Plan de corte y reconciliación', 'Carga de datos históricos y validaciones post-migración', 'Automatización de catálogos'] },
        { category: 'Despliegue', items: ['Go-live del módulo Odoo + DMS', 'Configuración de monitoreo y alertas', 'Playbooks de soporte de primer nivel'] },
        { category: 'Capacitación', items: ['Workshops para Facturación, KAM y TI', 'Documentación técnica y funcional', 'Plan de soporte posterior a la salida'] },
      ],
      outcome: 'Operación estable en productivo y equipos de Promed operando el nuevo proceso sin dependencia externa.',
    },
    {
      technical: 'Fase 5: Monitoreo y Capacitación',
      concept: 'Operación supervisada con DMS',
      duration: 'Octubre - Diciembre 2026 (10 semanas)',
      gate: 'Escucha continua tipo "heart monitor".',
      accentKey: 'rose',
      objective: 'Monitorear, optimizar y evolucionar las reglas con el DMS como sistema nervioso del flujo.',
      deliverables: [
        { category: 'Monitoreo', items: ['KPIs semanales (tiempo ciclo, % validado en origen)', 'Soporte reactivo y corrección de issues menores', 'Reportes ejecutivos mensuales'] },
        { category: 'Optimización', items: ['Ajustes de performance del conector', 'Nuevas reglas basadas en process mining', 'Backlog priorizado para 2027'] },
        { category: 'Transferencia', items: ['Runbooks y lecciones aprendidas', 'Reunión de cierre con indicadores finales', 'Plan de evolución conjunta Promed + Gateway + Alteridad'] },
      ],
      outcome: 'Sistema monitoreado 24/7 con DMS y Promed operando con métricas predictivas.',
    },
  ];

  const phases = phasesData && phasesData.length > 0 ? phasesData.map((p, i) => ({
    technical: p.technicalName,
    concept: p.conceptName,
    duration: p.duration,
    gate: p.gate,
    accentKey: (['blue', 'emerald', 'purple', 'amber', 'rose'][i % 5]) as AccentKey,
    objective: p.objective,
    deliverables: p.deliverables as { category: string; items: string[] }[],
    outcome: p.outcome,
  })) : staticPhases;

  const conceptualBridges = phases.map(({ technical, concept, gate }) => ({
    technical,
    concept,
    gate,
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Propuesta 2026</h1></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <Lightbulb className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{intro?.title ?? "Propuesta 2026"}</h2>
              <p className="text-base text-muted-foreground">{intro?.subtitle ?? "Evolución estratégica del ecosistema Odoo"}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <section className="mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">{intro?.strategicValueTitle ?? "Valor Estratégico"}</div>
              <div className="text-sm text-green-600 dark:text-green-400">{intro?.strategicValueSubtitle ?? "Impacto en el Negocio"}</div>
              <div className="text-xs text-muted-foreground mt-1">{intro?.strategicValueDetail ?? "Eficiencia, Precisión y Escalabilidad"}</div>
            </Card>
            <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-700 dark:text-blue-400" />
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{intro?.timelineTitle ?? "12 Meses"}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">{intro?.timelineSubtitle ?? "Timeline Completo"}</div>
              <div className="text-xs text-muted-foreground mt-1">{intro?.timelineDetail ?? "Ene - Dic 2026"}</div>
            </Card>
            <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <Layers className="w-8 h-8 mx-auto mb-2 text-purple-700 dark:text-purple-400" />
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{intro?.phasesTitle ?? "5 Fases"}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">{intro?.phasesSubtitle ?? "Taxonomía única"}</div>
              <div className="text-xs text-muted-foreground mt-1">{intro?.phasesDetail ?? "Valor continuo"}</div>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-3">Puentes Conceptuales ↔ Fases Técnicas</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Adoptamos una sola taxonomía de cinco fases técnicas. Cada hito conceptual previo (Fundación, Expansión, Sincronización, Capacitación y Monitoreo)
            vive ahora dentro de la fase correspondiente para facilitar seguimiento y gate reviews.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conceptualBridges.map((bridge) => (
              <Card key={bridge.technical} className="h-full">
                <CardHeader className="pb-3">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Concepto</div>
                  <CardTitle className="text-lg">{bridge.concept}</CardTitle>
                  <p className="text-xs font-semibold text-primary mt-1">{bridge.technical}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">{bridge.gate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Executive Summary */}
        <section className="mb-10">
          <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{intro?.visionTitle ?? "Visión Estratégica"}</h3>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed text-sm">
                  {intro?.visionText ?? "Este proyecto representa una evolución natural de la inversión en Odoo. El objetivo es convertir a Odoo en el centro del ciclo de ventas, desde la cotización hasta la facturación, eliminando el formulario F-007 y los procesos manuales asociados. Esto desbloqueará un nuevo nivel de eficiencia operativa y reducirá errores significativamente."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Timeline */}
        <section className="mb-10">
          <PhaseTimeline />
        </section>

        {/* Comparativa del proceso */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Proceso Actual vs Integrado</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Visualizamos la transición desde la captura manual hacia un flujo automatizado entre Odoo y NAF.
          </p>
          <Card>
            <CardContent className="p-4">
              <MermaidDiagram id="comparison-flow" chart={comparisonDiagram} />
            </CardContent>
          </Card>
        </section>

        {/* Phases with Detailed Deliverables */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <GitBranch className="w-7 h-7 text-blue-600" />
            Estrategia de Implementación Incremental
          </h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            El proyecto se ejecutará en 5 fases técnicas encadenadas. Haga clic en cada fase para ver los entregables detallados.
          </p>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {phases.map((phase, index) => {
              const accent = accentStyles[phase.accentKey];
              return (
                <AccordionItem
                  value={`item-${index + 1}`}
                  key={index}
                  className={`border-l-4 ${accent.border} bg-card rounded-lg`}
                >
                  <AccordionTrigger className="p-4 text-left hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <CardTitle className="text-base">{phase.technical}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{phase.concept}</p>
                        <p className="text-[11px] text-muted-foreground">{phase.duration}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Objetivo</h4>
                        <p className="text-xs text-muted-foreground leading-snug">{phase.objective}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Entregables Detallados</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                          {phase.deliverables.map((group, i) => (
                            <div key={i}>
                              <p className="font-semibold text-xs mb-1 text-foreground">{group.category}</p>
                              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                {group.items.map((item, j) => <li key={j}>{item}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={`${accent.badge} p-3 rounded`}>
                        <p className={`font-semibold ${accent.badgeTitle} text-xs mb-1`}>🎯 Resultado Esperado</p>
                        <p className={`text-xs ${accent.badgeBody}`}>{phase.outcome}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>

        {/* DMS Explanation */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Shield className="w-7 h-7 text-green-600" />
            El Corazón de la Solución: El DMS
          </h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Nuestra solución no es solo un script de integración; es un <strong>Data Management System (DMS)</strong> inteligente que actúa como el cerebro entre Odoo y NAF. Está diseñado para aprender, adaptarse y asegurar la calidad de los datos a largo plazo.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-green-500/5">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Aprende</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0"><p className="text-xs text-muted-foreground">El DMS observa los patrones de datos y las correcciones manuales para sugerir nuevas reglas de negocio.</p></CardContent>
            </Card>
            <Card className="bg-green-500/5">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Valida</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0"><p className="text-xs text-muted-foreground">Aplica un conjunto de reglas en tiempo real para asegurar que cada factura sea correcta antes de que llegue a NAF.</p></CardContent>
            </Card>
            <Card className="bg-green-500/5">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Sincroniza</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0"><p className="text-xs text-muted-foreground">Transfiere los datos validados a NAF de forma automática y provee retroalimentación a Odoo.</p></CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Beneficios Esperados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {beneficios.map((b, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/proceso-actual"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/detalles-tecnicos"><Button size="sm">Siguiente<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
