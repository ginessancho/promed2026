import { ArrowLeft, Lightbulb, CheckCircle2, GitBranch, Shield, Zap, DollarSign, Calendar, Layers, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { comparisonDiagram } from '@/data/diagrams';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PhaseTimeline from '@/components/PhaseTimeline';

export default function Propuesta2026() {
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

  const phases = [
    {
      title: 'Fase 1: Fundación y Victoria Temprana',
      duration: 'Enero - Marzo 2026 (3 meses)',
      color: 'blue',
      objective: 'Establecer las bases técnicas y demostrar el valor de la integración con un caso de uso de alto impacto y complejidad controlada.',
      deliverables: [
        { category: 'Análisis y Diseño', items: ['Auditoría completa de campos Odoo vs. NAF', 'Mapeo de datos detallado (campo por campo)', 'Diseño técnico del \'Conector Directo v1.0\'', 'Definición de casos de uso para el piloto'] },
        { category: 'Desarrollo', items: ['Desarrollo del módulo Python en Odoo', 'Creación de endpoint para recibir datos', 'Implementación de lógica de validación básica'] },
        { category: 'Pruebas y Despliegue', items: ['Pruebas unitarias del conector', 'Lanzamiento del piloto para casos simples', 'Configuración del Dashboard de seguimiento'] },
      ],
      outcome: 'Reducción medible del tiempo de procesamiento para un segmento de facturas. Validación del enfoque técnico.',
    },
    {
      title: 'Fase 2: Expansión y Eliminación de F-007',
      duration: 'Abril - Julio 2026 (4 meses)',
      color: 'green',
      objective: 'Extender la automatización para cubrir la mayoría de los escenarios de facturación y retirar por completo la dependencia del formulario F-007.',
      deliverables: [
        { category: 'Análisis y Diseño', items: ['Análisis de casos de uso complejos (comodatos, alquileres)', 'Diseño de la lógica de negocio para casos especiales'] },
        { category: 'Desarrollo', items: ['Evolución del Conector a v2.0', 'Implementación de lógica para comodatos y alquileres', 'Scripts para depuración del catálogo de servicios'] },
        { category: 'Implementación', items: ['Migración progresiva de todos los tipos de facturación', 'Gestión del cambio para el retiro del F-007', 'Ceremonia de \'apagado\' del formulario F-007'] },
      ],
      outcome: 'Eliminación casi total de la entrada de datos duplicada. Aumento drástico de la eficiencia operativa.',
    },
    {
      title: 'Fase 3: Sincronización Bidireccional',
      duration: 'Agosto - Octubre 2026 (3 meses)',
      color: 'purple',
      objective: 'Crear un flujo de datos de ciclo cerrado, asegurando que Odoo no solo envíe datos, sino que también reciba actualizaciones de estado desde NAF.',
      deliverables: [
        { category: 'Análisis y Diseño', items: ['Diseño de la arquitectura de retroalimentación (NAF → Odoo)', 'Selección de tecnología (Webhooks vs. Polling)'] },
        { category: 'Desarrollo', items: ['Implementación de webhooks o listener en Odoo', 'Desarrollo del panel de control de la integración'] },
        { category: 'Optimización', items: ['Pruebas de carga y optimización de rendimiento', 'Monitoreo de la salud de la integración'] },
      ],
      outcome: 'Visibilidad completa del ciclo de vida de la factura desde Odoo. Sistema de integración robusto y monitoreable.',
    },
    {
      title: 'Fase 4: Capacitación y Transferencia',
      duration: 'Noviembre - Diciembre 2026 (2 meses)',
      color: 'orange',
      objective: 'Asegurar la adopción exitosa de los nuevos procesos y transferir el conocimiento necesario al equipo de TI de Promed.',
      deliverables: [
        { category: 'Documentación', items: ['Creación de manuales de usuario para el nuevo flujo', 'Elaboración de documentación técnica del conector'] },
        { category: 'Capacitación', items: ['Sesiones de formación para equipos (Ventas, Facturación)', 'Workshops técnicos para el equipo de TI de Promed'] },
        { category: 'Soporte', items: ['Definición del plan de soporte a largo plazo', 'Entrega formal del código fuente y documentación'] },
      ],
      outcome: 'Un equipo capacitado y autónomo, y una solución documentada y sostenible en el tiempo.',
    },
  ];

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
              <h2 className="text-3xl font-bold">Propuesta 2026</h2>
              <p className="text-base text-muted-foreground">Evolución estratégica del ecosistema Odoo</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <section className="mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-700 dark:text-green-400" />
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">Alto ROI</div>
              <div className="text-sm text-green-600 dark:text-green-400">Retorno de Inversión</div>
              <div className="text-xs text-muted-foreground mt-1">Eficiencia y Calidad de Datos</div>
            </Card>
            <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-700 dark:text-blue-400" />
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">12 Meses</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Timeline Completo</div>
              <div className="text-xs text-muted-foreground mt-1">Ene - Dic 2026</div>
            </Card>
            <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <Layers className="w-8 h-8 mx-auto mb-2 text-purple-700 dark:text-purple-400" />
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">4 Fases</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Entrega Incremental</div>
              <div className="text-xs text-muted-foreground mt-1">Valor continuo</div>
            </Card>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="mb-10">
          <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Visión Estratégica</h3>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed text-sm">
                  Este proyecto representa una <strong>evolución natural</strong> de la inversión en Odoo. El objetivo es convertir a Odoo en el centro del ciclo de ventas, desde la cotización hasta la facturación, <strong>eliminando el formulario F-007</strong> y los procesos manuales asociados. Esto desbloqueará un nuevo nivel de eficiencia operativa y reducirá errores significativamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Timeline */}
        <section className="mb-10">
          <PhaseTimeline />
        </section>

        {/* AS-IS vs TO-BE */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Transformación del Proceso</h3>
          <Card><CardContent className="p-4"><MermaidDiagram id="comparison-flow" chart={comparisonDiagram} /></CardContent></Card>
        </section>

        {/* Phases with Detailed Deliverables */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <GitBranch className="w-7 h-7 text-blue-600" />
            Estrategia de Implementación Incremental
          </h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            El proyecto se ejecutará en 4 fases diseñadas para entregar valor de manera continua. Haga clic en cada fase para ver los entregables detallados.
          </p>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {phases.map((phase, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index} className={`border-l-4 border-l-${phase.color}-600 bg-card rounded-lg`}>
                <AccordionTrigger className="p-4 text-left hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <CardTitle className="text-base">{phase.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{phase.duration}</p>
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
                    <div className={`bg-${phase.color}-50 dark:bg-${phase.color}-950 p-3 rounded border border-${phase.color}-200 dark:border-${phase.color}-800`}>
                      <p className={`font-semibold text-${phase.color}-900 dark:text-${phase.color}-100 text-xs mb-1`}>🎯 Resultado Esperado</p>
                      <p className={`text-xs text-${phase.color}-800 dark:text-${phase.color}-200`}>{phase.outcome}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
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
