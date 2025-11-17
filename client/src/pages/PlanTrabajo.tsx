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
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            Listado de Tareas Detalladas
          </h2>
          <p className="text-muted-foreground mb-2">
            Abrí cada fase para revisar sus actividades. Cuando una tarea dependa de aprobaciones o disponibilidad,
            aparecerá como “Por confirmar”.
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
