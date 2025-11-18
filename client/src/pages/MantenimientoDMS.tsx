import { ArrowLeft, Monitor, Shield, Zap, BarChart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import FeatureMockPanel from '@/components/FeatureMockPanel';

export default function MantenimientoDMS() {
  const capacidades = [
    { titulo: 'Business Rules Engine', icono: Shield, descripcion: 'Reglas dinámicas que aprenden del comportamiento real del negocio y se ajustan automáticamente', beneficio: 'Evolución continua sin intervención manual', mock: 'rules' as const },
    { titulo: 'Sistema de Alertas Proactivas', icono: Zap, descripcion: 'Alertas inteligentes que se generan antes de que ocurran problemas, basadas en patrones detectados', beneficio: 'Prevención en lugar de corrección', mock: 'alerts' as const },
    { titulo: 'Process Mining', icono: BarChart, descripcion: 'Análisis continuo de flujos reales para extraer conocimiento tácito y optimizar procesos', beneficio: 'Mejora automática de eficiencia', mock: 'process' as const },
    { titulo: 'Tarjetas de Análisis Conectadas', icono: Monitor, descripcion: 'KPIs que reflejan el estado real del negocio y se actualizan en tiempo real', beneficio: 'Visibilidad completa y accionable', mock: 'cards' as const },
  ];

  const dataStores = [
    { tech: 'DuckDB + Parquet', role: 'Analítica volumétrica (739,251 registros) y problem volume analysis', detail: 'Responde queries de alta granularidad en segundos y soporta process mining.' },
    { tech: 'MongoDB', role: 'Reglas schemaless y AI embeddings', detail: 'Almacena versiones de reglas, prompts y experimentos sin bloquear la operación.' },
    { tech: 'PostgreSQL', role: 'Eventos ACID, alertas y logs', detail: 'Registra cada validación con correlation-id para auditoría y replay.' },
  ];

  const monitorPillars = [
    { title: 'Validaciones ACID', text: 'Cada asiento queda trazado entre Odoo, DMS y NAF; el DMS registra confirmaciones de commit.' },
    { title: 'Aprendizaje asistido por IA', text: 'Las correcciones humanas alimentan nuevas reglas y recomendaciones.' },
    { title: 'Alertas multi-canal', text: 'Publica alertas antes de que llegue al GL (correo, Teams y panel).' },
    { title: 'Process mining continuo', text: 'Reconstruye el flujo real y compara contra el Propuesto para priorizar mejoras.' },
  ];

  const dmsDiagram = `
graph TD
    Odoo["Odoo 18 · Eventos F-007"] -->|Webhook JSON| Orq((Orquestador DMS))
    Orq -->|Validaciones ACID| Postgres[(PostgreSQL)]
    Orq -->|Reglas dinámicas| Mongo[(MongoDB)]
    Orq -->|Auditorías volumétricas| DuckDB[(DuckDB + Parquet)]
    DuckDB --> KPIs[Dashboards & KPIs]
    Mongo --> Rules[Rules Studio & AI]
    Postgres --> Alerts[Alert Engine]
    Alerts --> Equipos["Equipos Promed / Gateway"]
    KPIs --> Dirección["Dirección & Steering"]
`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Mantenimiento DMS</h1></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center"><Monitor className="w-8 h-8 text-purple-600" /></div>
            <div><h2 className="text-4xl font-bold">Mantenimiento DMS</h2><p className="text-lg text-muted-foreground">Plataforma dms.alteridad.org</p></div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            El Data Management System (DMS) de Alteridad no es solo una herramienta de gestión de datos, sino un sistema inteligente 
            que <strong>aprende del negocio</strong>. Extrae conocimiento tácito de los procesos reales, lo convierte en <strong>reglas 
            accionables</strong> y genera <strong>alertas proactivas</strong> para mejorar continuamente la eficiencia de los flujos de facturación.
          </p>
        </div>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Capacidades Clave</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capacidades.map((cap, i) => {
              const Icon = cap.icono;
              return (
                <Card key={i} className="border-2 hover:border-purple-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <CardTitle>{cap.titulo}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-muted/30 aspect-video rounded-lg border overflow-hidden">
                      <FeatureMockPanel variant={cap.mock} />
                    </div>
                    <p className="text-muted-foreground">{cap.descripcion}</p>
                    <p className="text-sm"><strong className="text-purple-600">Beneficio:</strong> {cap.beneficio}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-4">Arquitectura Evolutiva del DMS</h3>
          <p className="text-sm text-muted-foreground mb-4">
            El DMS operará en paralelo al proyecto principal: DuckDB para analítica volumétrica, MongoDB para reglas y AI sin esquema,
            y PostgreSQL para eventos ACID, alertas y logs. Así mantenemos la operación de Promed protegida mientras el sistema aprende.
          </p>
          <Card>
            <CardContent className="p-4">
              <MermaidDiagram id="dms-architecture" chart={dmsDiagram} />
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Stack de Datos Paralelo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataStores.map((store) => (
              <Card key={store.tech}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{store.tech}</CardTitle>
                  <p className="text-xs text-muted-foreground">{store.role}</p>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground">{store.detail}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Pilares del "Heart Monitor"</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monitorPillars.map((pillar) => (
              <Card key={pillar.title} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground">{pillar.text}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardHeader><CardTitle>Acceso para Equipo Promed</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p>El equipo de Promed tendrá acceso completo al DMS con roles y permisos configurables.</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Dashboard personalizado con KPIs del proyecto</li>
                <li>Visualización de reglas de negocio activas</li>
                <li>Alertas configurables por email/SMS</li>
                <li>Reportes automáticos semanales/mensuales</li>
                <li>Training incluido para usuarios clave</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <div className="flex justify-between pt-8 border-t">
          <Link href="/detalles-tecnicos"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/plan-de-trabajo"><Button>Siguiente: Plan de Trabajo<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
