import { ArrowLeft, Users, FileSearch, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Hallazgos2025() {
  const hallazgos = [
    {
      title: 'Proceso Manual Ineficiente',
      description: 'Entrada duplicada de datos entre F-007, Odoo y NAF consume tiempo y genera errores.',
      impact: 'Alto',
    },
    {
      title: 'Falta de Validación Automática',
      description: 'Errores detectados tardíamente, después de que los datos ya están en NAF.',
      impact: 'Alto',
    },
    {
      title: 'Dispersión de Marcas',
      description: '14.4% de artículos con múltiples marcas inconsistentes (898 de 6,249).',
      impact: 'Medio',
    },
    {
      title: 'Inconsistencias de Comodatos',
      description: '70 facturas con problemas de trazabilidad de activos.',
      impact: 'Medio',
    },
    {
      title: 'Conocimiento Tácito',
      description: 'Reglas de negocio no documentadas, dependientes de personas clave.',
      impact: 'Alto',
    },
    {
      title: 'Sin Integración Odoo-NAF',
      description: 'Falta de conexión directa entre sistemas obliga a proceso manual completo.',
      impact: 'Crítico',
    },
  ];

  const metodologia = [
    {
      fase: 'Entrevistas Iniciales',
      descripcion: 'Conversaciones con colaboradores de facturación, KAMs y especialistas de producto.',
      duracion: '2 semanas',
    },
    {
      fase: 'Entrevistas Ejecutivas',
      descripcion: 'Validación de sospechas y prioridades con dirección de Promed.',
      duracion: '1 semana',
    },
    {
      fase: 'Expansión del Equipo',
      descripcion: 'Incorporación de expertos externos para validar hallazgos técnicos.',
      duracion: '2 semanas',
    },
    {
      fase: 'Análisis de Pantallas',
      descripcion: 'Revisión detallada de F-007, Odoo y NAF para identificar campos críticos.',
      duracion: '3 semanas',
    },
    {
      fase: 'Análisis de Procesos',
      descripcion: 'Mapeo del flujo AS-IS completo con tiempos y puntos de fricción.',
      duracion: '2 semanas',
    },
    {
      fase: 'Análisis de Datos',
      descripcion: 'Auditoría de 739,251 registros de facturación para cuantificar anomalías.',
      duracion: '3 semanas',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <h1 className="text-lg font-bold">Hallazgos 2025</h1>
              <p className="text-sm text-muted-foreground">Análisis Preliminar</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Intro */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FileSearch className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground">Hallazgos 2025</h2>
              <p className="text-lg text-muted-foreground">Trabajo preliminar y análisis que llevó a la propuesta</p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Durante el segundo semestre de 2025, el equipo de Alteridad realizó un análisis exhaustivo del proceso
              de facturación de Promed. Este trabajo preliminar surgió de la necesidad de identificar oportunidades
              de automatización mientras la empresa espera la migración a una versión más reciente de Odoo.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              A través de entrevistas con colaboradores y ejecutivos, análisis de sistemas y auditoría de datos,
              validamos las sospechas iniciales: existe una necesidad urgente de automatizar el proceso de facturación
              para reducir errores, eliminar reprocesos y preparar una base sólida para futuras migraciones.
            </p>
          </div>
        </div>

        {/* Cambio de Estrategia */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                Cambio de Estrategia: De Proyecto Único a Servicio Continuo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                Inicialmente, Alteridad propuso un <strong>modelo de proyecto único</strong> con una inversión de <strong>$10,000 USD</strong> 
                para análisis e implementación. Sin embargo, tras el análisis preliminar, identificamos que la naturaleza dinámica del 
                negocio de Promed requiere un enfoque diferente.
              </p>
              
              <div className="bg-background/50 p-6 rounded-lg border space-y-3">
                <h4 className="font-bold text-lg">¿Por qué el cambio?</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Reglas de negocio cambiantes:</strong> Las reglas de facturación evolucionan constantemente según 
                    nuevos productos, clientes y regulaciones. Un proyecto único quedaría obsoleto rápidamente.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Aprendizaje continuo:</strong> El Data Management System (DMS) debe aprender del negocio de forma 
                    continua, extrayendo conocimiento y convirtiéndolo en reglas accionables.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Automatización incremental:</strong> La automatización de flujos no es un evento único, sino un 
                    proceso iterativo que requiere ajustes y optimizaciones constantes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Alertas proactivas:</strong> Generar alertas para eficiencia de procesos requiere monitoreo 
                    continuo y ajuste de umbrales según el comportamiento real del negocio.</span>
                  </li>
                </ul>
              </div>



              <p className="text-lg mt-6">
                El modelo de <strong>servicio mensual continuo</strong> garantiza que el sistema evolucione con el negocio, manteniendo las reglas actualizadas, generando alertas relevantes y optimizando continuamente los flujos de automatización.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cost of Inefficiency */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">El Costo Oculto de la Ineficiencia</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardHeader><CardTitle className="text-lg">Conocimiento Tácito: Un Activo Frágil</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Gran parte del proceso de facturación depende del conocimiento no documentado de personas clave. Este "conocimiento tácito" es un riesgo operativo enorme: si una persona clave se va, el proceso se rompe. La automatización captura este conocimiento y lo convierte en un activo de la empresa.</p></CardContent>
            </Card>
            <Card className="bg-red-500/5 border-red-500/20">
              <CardHeader><CardTitle className="text-lg">Reprocesos: El Ladrón Silencioso</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Cada error detectado tardíamente en NAF no solo requiere tiempo para corregirse, sino que retrasa la facturación, impacta el flujo de caja y erosiona la confianza en los datos. Es un ladrón silencioso que roba horas y eficiencia todos los días.</p></CardContent>
            </Card>
          </div>
        </section>

        {/* Metodología */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Metodología de Análisis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metodologia.map((fase, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-primary/30">0{index + 1}</span>
                    <span className="text-sm text-muted-foreground">{fase.duracion}</span>
                  </div>
                  <CardTitle className="text-xl">{fase.fase}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{fase.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hallazgos Clave */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Hallazgos Clave
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hallazgos.map((hallazgo, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: 
                hallazgo.impact === 'Crítico' ? 'oklch(0.60 0.22 25)' :
                hallazgo.impact === 'Alto' ? 'oklch(0.65 0.18 50)' :
                'oklch(0.65 0.18 145)'
              }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl flex-1">{hallazgo.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      hallazgo.impact === 'Crítico' ? 'bg-destructive/10 text-destructive' :
                      hallazgo.impact === 'Alto' ? 'bg-orange-500/10 text-orange-600' :
                      'bg-yellow-500/10 text-yellow-600'
                    }`}>
                      {hallazgo.impact}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{hallazgo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Conclusión */}
        <section className="mb-16">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Conclusión del Análisis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                Los hallazgos confirman la <strong>necesidad urgente de automatización</strong> del proceso de facturación.
                No es viable esperar a la migración de Odoo para abordar estos problemas.
              </p>
              <p className="text-lg">
                La solución propuesta permitirá:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Automatizar flujos de facturación eliminando entrada manual duplicada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Implementar reglas de negocio dinámicas que aprenden del negocio</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Generar alertas proactivas para eficiencia de procesos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Extraer conocimiento tácito y convertirlo en reglas accionables</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Crear una base sólida para futuras migraciones</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Timeline Retrospectiva */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Timeline 2025</h3>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
            
            <div className="space-y-8">
              {[
                { mes: 'Julio 2025', evento: 'Inicio de entrevistas con equipo de facturación' },
                { mes: 'Agosto 2025', evento: 'Validación con ejecutivos de Promed' },
                { mes: 'Septiembre 2025', evento: 'Expansión del equipo Alteridad con expertos' },
                { mes: 'Octubre 2025', evento: 'Análisis detallado de pantallas y procesos' },
                { mes: 'Noviembre 2025', evento: 'Auditoría de datos y cuantificación de anomalías' },
                { mes: 'Diciembre 2025', evento: 'Presentación de propuesta F-007 con nuevo modelo de servicio' },
              ].map((item, index) => (
                <div key={index} className="relative pl-16">
                  <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background"></div>
                  <div>
                    <span className="text-sm font-semibold text-primary">{item.mes}</span>
                    <p className="text-lg text-foreground mt-1">{item.evento}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
          <Link href="/volumen-problema">
            <Button>
              Siguiente: Volumen del Problema
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </Link>
        </div>
              {/* Project Governance */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Gobernanza del Proyecto</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Reuniones Semanales</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">Seguimiento táctico del progreso, identificación de bloqueos y próximos pasos.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Comité Mensual</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">Revisión estratégica con el equipo ejecutivo de Promed para asegurar la alineación con los objetivos de negocio.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Comunicación Continua</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">Uso de este sitio web como punto central de verdad y comunicación sobre el estado del proyecto.</p></CardContent>
            </Card>
          </div>
        </section>

      </main>
    </div>
  );
}
