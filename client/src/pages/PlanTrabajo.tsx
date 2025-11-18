import { ArrowLeft, CheckCircle, GanttChartSquare, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhaseTimeline from '@/components/PhaseTimeline';
import { ganttTasks, phaseSummary } from '@/data/ganttTasks'; // Assuming ganttTasks is now in a separate file
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PlanTrabajo() {
  const tiposReuniones = [
    {
      tipo: 'Reuniones Ad-hoc',
      frecuencia: 'Bajo demanda',
      duracion: '30-45 min',
      participantes: 'Equipo técnico específico',
      objetivo: 'Resolver bloqueos urgentes, decisiones técnicas',
    },
    {
      tipo: 'Reuniones de Progress',
      frecuencia: 'Semanales (Miércoles 10:00 AM)',
      duracion: '45 min',
      participantes: 'Alteridad, Gateway, IT Promed',
      objetivo: 'Seguimiento de tareas, bloqueos, plan semanal',
    },
    {
      tipo: 'Reuniones de Steering',
      frecuencia: 'Mensuales (Primera semana)',
      duracion: '1 hora',
      participantes: 'Alteridad, Promed Ejecutivo, Gateway Director, IT Director',
      objetivo: 'KPIs, riesgos, decisiones estratégicas',
    },
  ];

  const calendarBlocks = [
    {
      month: 'Enero',
      phase: 'Fase 1 - Diseño',
      focus: 'Blueprint y accesos listos',
      cadences: ['Progress semanal', 'Steering semana 1'],
      gate: 'Fundación validada',
    },
    {
      month: 'Marzo',
      phase: 'Fase 2 - Desarrollo',
      focus: 'Conector v2.0 + reglas clave',
      cadences: ['Progress semanal', 'Steering semana 1'],
      gate: 'Apagado progresivo de F-007',
    },
    {
      month: 'Junio',
      phase: 'Fase 3 - Pruebas',
      focus: 'UAT completo y retroalimentación NAF→Odoo',
      cadences: ['Progress semanal', 'Steering mes medio'],
      gate: 'Checklist de sincronización bidireccional',
    },
    {
      month: 'Agosto',
      phase: 'Fase 4 - Producción',
      focus: 'Migración y go-live controlado',
      cadences: ['Progress semanal', 'Steering semana 4'],
      gate: 'Capacitación concluida',
    },
    {
      month: 'Octubre',
      phase: 'Fase 5 - Monitoreo',
      focus: 'KPIs del DMS como "heart monitor"',
      cadences: ['Progress quincenal', 'Steering de cierre'],
      gate: 'Transición a operación regular',
    },
  ];

  const raciMatrix = [
    { deliverable: 'F-007 digital en Odoo', alteridad: 'R', promedTI: 'A', gateway: 'C', finanzas: 'I' },
    { deliverable: 'Conector directo Odoo ↔ NAF', alteridad: 'C', promedTI: 'I', gateway: 'R', finanzas: 'A' },
    { deliverable: 'Motor de reglas y alertas (DMS)', alteridad: 'R', promedTI: 'C', gateway: 'C', finanzas: 'I' },
    { deliverable: 'Go-live y plan de soporte', alteridad: 'A', promedTI: 'R', gateway: 'C', finanzas: 'C' },
    { deliverable: 'KPIs y monitoreo continuo', alteridad: 'R', promedTI: 'C', gateway: 'I', finanzas: 'A' },
  ];

  const kpis = [
    {
      name: 'Porcentaje de facturas validadas en origen',
      baseline: '35%',
      target: '>=95% al cierre de Fase 3',
      cadence: 'Semanal (DMS)',
    },
    {
      name: 'Tiempo medio desde F-007 digital a GL',
      baseline: '72 h',
      target: '<=12 h al finalizar Fase 4',
      cadence: 'Quincenal',
    },
    {
      name: 'Alertas críticas resueltas < 24h',
      baseline: 'Sin medición',
      target: '100% en Fase 5',
      cadence: 'Diaria',
    },
    {
      name: 'Dispersión de marcas (artículos críticos)',
      baseline: '898 SKUs',
      target: '-80% al finalizar Fase 2',
      cadence: 'Mensual',
    },
  ];

  const riesgos = [
    { riesgo: 'Retrasos en acceso a sistemas', probabilidad: 'Media', impacto: 'Alto', mitigacion: 'Solicitar accesos en kick-off' },
    { riesgo: 'Cambios en alcance', probabilidad: 'Media', impacto: 'Medio', mitigacion: 'Control de cambios formal' },
    { riesgo: 'Disponibilidad de recursos clave', probabilidad: 'Baja', impacto: 'Alto', mitigacion: 'Identificar backups' },
    { riesgo: 'Complejidad técnica subestimada', probabilidad: 'Media', impacto: 'Alto', mitigacion: 'POCs tempranos' },
    { riesgo: 'Resistencia al cambio', probabilidad: 'Media', impacto: 'Medio', mitigacion: 'Capacitación temprana' },
  ];

  const phaseKeywordMap: Record<string, string> = {
    diseño: 'Diseño',
    desarrollo: 'Desarrollo',
    pruebas: 'Pruebas',
    producción: 'Producción',
    monitoreo: 'Monitoreo y Capacitación',
  };

  const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' });
  const formatTaskWindow = (task: (typeof ganttTasks)[number]) => {
    const isValidDate = (date: Date) => date instanceof Date && !Number.isNaN(date.getTime());
    if (!isValidDate(task.start) || !isValidDate(task.end)) {
      return 'Por confirmar (depende de validación)';
    }
    const sameDay = task.start.toDateString() === task.end.toDateString();
    return sameDay
      ? dateFormatter.format(task.start)
      : `${dateFormatter.format(task.start)} – ${dateFormatter.format(task.end)}`;
  };

  const fasesConTareas = phaseSummary.map(phase => {
    const key = Object.entries(phaseKeywordMap).find(([keyword]) =>
      phase.phase.toLowerCase().includes(keyword)
    )?.[1];
    const tasks =
      key
        ? ganttTasks
            .filter(task => (task.type === 'task' || task.type === 'milestone') && task.phase === key)
            .sort((a, b) => taskTime(a.start) - taskTime(b.start))
        : [];
    return { ...phase, tasks };
  });

  function taskTime(date: Date) {
    return date instanceof Date ? date.getTime() : Number.POSITIVE_INFINITY;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver al Inicio</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Plan de Trabajo</h1></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <GanttChartSquare className="w-8 h-8 text-blue-600" />
            Roadmap General del Proyecto
          </h2>
          <p className="text-muted-foreground mb-6">Distribución de las 5 fases a lo largo de los 12 meses de ejecución.</p>
          <Card>
            <CardContent className="p-6">
              <PhaseTimeline />
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Calendario de Reuniones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiposReuniones.map((reunion, i) => (
              <Card key={i} className="border-t-4 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-xl">{reunion.tipo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div><p className="text-sm font-semibold text-muted-foreground">Frecuencia</p><p>{reunion.frecuencia}</p></div>
                  <div><p className="text-sm font-semibold text-muted-foreground">Duración</p><p>{reunion.duracion}</p></div>
                  <div><p className="text-sm font-semibold text-muted-foreground">Participantes</p><p className="text-sm">{reunion.participantes}</p></div>
                  <div><p className="text-sm font-semibold text-muted-foreground">Objetivo</p><p className="text-sm text-muted-foreground">{reunion.objetivo}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Calendario Visual 2026</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Cada mes resalta la fase técnica activa y la puerta conceptual que se valida. Este heatmap ayuda a los equipos a sincronizar
            prioridades de TI, Gateway y Alteridad bajo una única taxonomía.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calendarBlocks.map((block) => (
              <Card key={block.month} className="border border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{block.month}</CardTitle>
                  <p className="text-sm text-muted-foreground">{block.phase}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-foreground"><strong>Foco:</strong> {block.focus}</p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {block.cadences.map((cadence) => (
                      <li key={cadence}>{cadence}</li>
                    ))}
                  </ul>
                  <div className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
                    Puerta: {block.gate}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            Listado de Tareas Detalladas
          </h2>
          <p className="text-muted-foreground mb-2">
            Abrí cada fase para revisar sus actividades. Cuando una tarea dependa de aprobaciones o disponibilidad,
            aparecerá como "Por confirmar".
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Nota: las fases se comportan como puertas encadenadas; sin la validación de Nov-Dic 2025 no se activa el cronograma 2026.
          </p>
          <Accordion type="multiple" className="space-y-4">
            {fasesConTareas.map(({ phase, tasks, duration }) => (
              <AccordionItem key={phase} value={phase}>
                <AccordionTrigger className="text-left">
                  <div>
                    <p className="text-lg font-semibold">{phase}</p>
                    <p className="text-xs text-muted-foreground">{duration} • {tasks.length} actividades</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-3 text-left font-semibold w-24">ID</th>
                          <th className="p-3 text-left font-semibold">Tarea</th>
                          <th className="p-3 text-left font-semibold w-40">Responsable</th>
                          <th className="p-3 text-left font-semibold w-48">Ventana estimada</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map(task => (
                          <tr key={task.id} className="border-b last:border-none">
                            <td className="p-3 font-mono text-xs">{task.id}</td>
                            <td className="p-3">{task.name}</td>
                            <td className="p-3">{task.responsible}</td>
                            <td className="p-3 text-muted-foreground">{formatTaskWindow(task)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-8">KPIs Operativos (DMS como "heart monitor")</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <Card key={kpi.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{kpi.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm space-y-1">
                  <p><strong>Línea base:</strong> {kpi.baseline}</p>
                  <p><strong>Meta:</strong> {kpi.target}</p>
                  <p className="text-muted-foreground"><strong>Frecuencia:</strong> {kpi.cadence}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-8">Matriz RACI</h3>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-semibold">Entregable</th>
                    <th className="p-4 text-left font-semibold">Alteridad</th>
                    <th className="p-4 text-left font-semibold">Promed TI</th>
                    <th className="p-4 text-left font-semibold">Gateway Resources</th>
                    <th className="p-4 text-left font-semibold">Finanzas Promed</th>
                  </tr>
                </thead>
                <tbody>
                  {raciMatrix.map((row) => (
                    <tr key={row.deliverable} className="border-b last:border-none">
                      <td className="p-4">{row.deliverable}</td>
                      <td className="p-4 font-semibold">{row.alteridad}</td>
                      <td className="p-4 font-semibold">{row.promedTI}</td>
                      <td className="p-4 font-semibold">{row.gateway}</td>
                      <td className="p-4 font-semibold">{row.finanzas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Gestión de Riesgos
          </h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Riesgo Potencial</th>
                      <th className="p-4 text-left font-semibold">Probabilidad</th>
                      <th className="p-4 text-left font-semibold">Impacto</th>
                      <th className="p-4 text-left font-semibold">Plan de Mitigación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riesgos.map((r, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td className="p-4">{r.riesgo}</td>
                        <td className="p-4">{r.probabilidad}</td>
                        <td className="p-4">{r.impacto}</td>
                        <td className="p-4">{r.mitigacion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

      </main>
    </div>
  );
}
