import { ArrowLeft, CheckCircle, GanttChartSquare, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhaseTimeline from '@/components/PhaseTimeline';
import { ganttTasks, phaseSummary } from '@/data/ganttTasks'; // Assuming ganttTasks is now in a separate file

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
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            Listado de Tareas Detalladas
          </h2>
          <p className="text-muted-foreground mb-6">A continuación se presenta el desglose de 67 actividades principales, agrupadas por fase.</p>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Fase</th>
                      <th className="p-4 text-left font-semibold">ID</th>
                      <th className="p-4 text-left font-semibold">Tarea</th>
                      <th className="p-4 text-left font-semibold">Responsable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ganttTasks.filter(t => t.type === 'task' || t.type === 'milestone').map((t, i) => (
                      <tr key={i} className="border-b last:border-none hover:bg-muted/50">
                        <td className="p-4 w-24 text-center font-medium">{t.phase}</td>
                        <td className="p-4 w-24 font-mono text-xs">{t.id}</td>
                        <td className="p-4">{t.name}</td>
                        <td className="p-4 w-40">{t.responsible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
