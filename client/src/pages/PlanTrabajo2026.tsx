import { ArrowLeft, Calendar, Users, AlertTriangle, CheckSquare } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectTimeline from '@/components/ProjectTimeline';
import { ganttTasks, phaseSummary } from '@/data/ganttTasks';

export default function PlanTrabajo2026() {
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
            <div className="text-right">
              <h1 className="text-lg font-bold">Plan de Trabajo 2026</h1>
              <p className="text-sm text-muted-foreground">Gantt • Calendario • RACI • Riesgos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Intro */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground">Plan de Trabajo 2026</h2>
              <p className="text-lg text-muted-foreground">Roadmap ejecutable de 12 meses</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Plan detallado con <strong>67 tareas</strong> distribuidas en <strong>5 fases</strong> a lo largo de 12 meses,
            desde enero hasta diciembre de 2026. Incluye calendario de reuniones, matriz RACI y gestión de riesgos.
          </p>
        </div>

        {/* Resumen de Fases */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Resumen de Fases</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {phaseSummary.map((phase, i) => (
              <Card key={i} className="border-l-4" style={{ borderLeftColor: phase.color }}>
                <CardHeader>
                  <CardTitle className="text-base">{phase.phase}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Duración:</strong> {phase.duration}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Tareas:</strong> {phase.tasks}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline Visual */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Timeline del Proyecto</h3>
          <Card>
            <CardContent className="p-6">
              <ProjectTimeline />
            </CardContent>
          </Card>
        </section>

        {/* Gantt Simplificado - Placeholder */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Gantt Detallado</h3>
          <Card>
            <CardHeader>
              <CardTitle>67 Tareas en 5 Fases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 aspect-[2/1] flex items-center justify-center rounded-lg border">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-semibold">Gantt Chart Interactivo</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {ganttTasks.length} tareas • Enero - Diciembre 2026
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    (Visualización completa con librería gantt-task-react)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Calendario de Reuniones */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Calendario de Reuniones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiposReuniones.map((reunion, i) => (
              <Card key={i} className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">{reunion.tipo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Frecuencia</p>
                    <p>{reunion.frecuencia}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Duración</p>
                    <p>{reunion.duracion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Participantes</p>
                    <p className="text-sm">{reunion.participantes}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Objetivo</p>
                    <p className="text-sm text-muted-foreground">{reunion.objetivo}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Matriz RACI - Placeholder */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-primary" />
            Matriz RACI
          </h3>
          <Card>
            <CardHeader>
              <CardTitle>Responsabilidades por Rol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Tarea/Entregable</th>
                      <th className="text-center p-3 font-semibold">Alteridad</th>
                      <th className="text-center p-3 font-semibold">Gateway</th>
                      <th className="text-center p-3 font-semibold">IT Promed</th>
                      <th className="text-center p-3 font-semibold">Promed Ejecutivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { tarea: 'Kick-off del proyecto', alteridad: 'A', gateway: 'C', it: 'C', ejecutivo: 'I' },
                      { tarea: 'Análisis de campos críticos', alteridad: 'R', gateway: 'C', it: 'C', ejecutivo: 'I' },
                      { tarea: 'Diseño de arquitectura', alteridad: 'C', gateway: 'R', it: 'C', ejecutivo: 'A' },
                      { tarea: 'Desarrollo de módulo Odoo', alteridad: 'C', gateway: 'R', it: 'I', ejecutivo: 'I' },
                      { tarea: 'Implementación de reglas', alteridad: 'R', gateway: 'C', it: 'I', ejecutivo: 'I' },
                      { tarea: 'Pruebas de integración', alteridad: 'C', gateway: 'R', it: 'C', ejecutivo: 'I' },
                      { tarea: 'Despliegue en producción', alteridad: 'C', gateway: 'R', it: 'R', ejecutivo: 'A' },
                      { tarea: 'Capacitación de usuarios', alteridad: 'R', gateway: 'C', it: 'C', ejecutivo: 'I' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="p-3">{row.tarea}</td>
                        <td className="text-center p-3">
                          <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            row.alteridad === 'R' ? 'bg-blue-500/20 text-blue-600' :
                            row.alteridad === 'A' ? 'bg-green-500/20 text-green-600' :
                            row.alteridad === 'C' ? 'bg-orange-500/20 text-orange-600' :
                            'bg-gray-500/20 text-gray-600'
                          }`}>{row.alteridad}</span>
                        </td>
                        <td className="text-center p-3">
                          <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            row.gateway === 'R' ? 'bg-blue-500/20 text-blue-600' :
                            row.gateway === 'A' ? 'bg-green-500/20 text-green-600' :
                            row.gateway === 'C' ? 'bg-orange-500/20 text-orange-600' :
                            'bg-gray-500/20 text-gray-600'
                          }`}>{row.gateway}</span>
                        </td>
                        <td className="text-center p-3">
                          <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            row.it === 'R' ? 'bg-blue-500/20 text-blue-600' :
                            row.it === 'A' ? 'bg-green-500/20 text-green-600' :
                            row.it === 'C' ? 'bg-orange-500/20 text-orange-600' :
                            'bg-gray-500/20 text-gray-600'
                          }`}>{row.it}</span>
                        </td>
                        <td className="text-center p-3">
                          <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            row.ejecutivo === 'R' ? 'bg-blue-500/20 text-blue-600' :
                            row.ejecutivo === 'A' ? 'bg-green-500/20 text-green-600' :
                            row.ejecutivo === 'C' ? 'bg-orange-500/20 text-orange-600' :
                            'bg-gray-500/20 text-gray-600'
                          }`}>{row.ejecutivo}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
                <span><strong className="text-blue-600">R</strong> = Responsible (Ejecutor)</span>
                <span><strong className="text-green-600">A</strong> = Accountable (Responsable final)</span>
                <span><strong className="text-orange-600">C</strong> = Consulted (Consultado)</span>
                <span><strong className="text-gray-600">I</strong> = Informed (Informado)</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Gestión de Riesgos */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            Gestión de Riesgos
          </h3>
          <div className="space-y-4">
            {riesgos.map((r, i) => (
              <Card key={i} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl flex-1">{r.riesgo}</CardTitle>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        r.probabilidad === 'Alta' ? 'bg-red-500/10 text-red-600' :
                        r.probabilidad === 'Media' ? 'bg-orange-500/10 text-orange-600' :
                        'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        P: {r.probabilidad}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        r.impacto === 'Alto' ? 'bg-red-500/10 text-red-600' :
                        r.impacto === 'Medio' ? 'bg-orange-500/10 text-orange-600' :
                        'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        I: {r.impacto}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p><strong>Mitigación:</strong> {r.mitigacion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t">
          <Link href="/mantenimiento-dms">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior: Mantenimiento DMS
            </Button>
          </Link>
          <Link href="/">
            <Button>
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
