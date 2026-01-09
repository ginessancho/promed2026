"use client";

import { ArrowLeft, Users, FileSearch, CheckCircle2, Target } from 'lucide-react';
import Link from 'next/link';
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
      descripcion: 'Mapeo del flujo actual completo con tiempos y puntos de fricción.',
      duracion: '2 semanas',
    },
    {
      fase: 'Análisis de Datos',
      descripcion: 'Auditoría de 739,251 registros de facturación para cuantificar anomalías.',
      duracion: '3 semanas',
    },
  ];

  const timeline = [
    { mes: 'Enero 2025', evento: 'Kick-off, entrevistas con colaboradores de facturación, KAMs y especialistas de producto.' },
    { mes: 'Febrero 2025', evento: 'Bloqueos de acceso y setups; se documentan dependencias técnicas con TI y seguridad.' },
    { mes: 'Marzo 2025', evento: 'Se evidencian limitaciones con los proveedores anteriores de analisis de datos, lo que frena adecuaciones.' },
    { mes: 'Abril 2025', evento: 'Reinicio de entrevistas y captura de pantallas tras estabilizar procesos internos.' },
    { mes: 'Julio 2025', evento: 'Nuevo ciclo de entrevistas + documentación de pantallas F-007, Odoo y NAF.' },
    { mes: 'Septiembre 2025', evento: 'Expansión del equipo de Alteridad con especialistas de procesos.' },
    { mes: 'Octubre 2025', evento: 'Análisis detallado del flujo F-007, Odoo y NAF para identificar fricciones.' },
    { mes: 'Noviembre 2025', evento: 'Se profundiza en la necesidad fundamental: automatizar la facturación Odoo → NAF.' },
    { mes: 'Diciembre 2025', evento: 'Presentación de la propuesta de integración Odoo (siguiente paso del proyecto).' },
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
              Desde enero de 2025, el equipo de Alteridad inició entrevistas y levantamiento de información con todas las
              áreas involucradas en facturación. Los primeros meses se centraron en destrabar accesos técnicos, convivir
              con la migración de Odoo 14 → 18 (ejecutada por Promed) y entender las dependencias con proveedores previos.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              A medida que superamos esos bloqueos, profundizamos en análisis de sistemas y auditorías de datos. El resultado
              confirmó la necesidad urgente de automatizar el proceso de facturación para reducir errores, eliminar reprocesos
              y preparar una base sólida para futuras integraciones.
            </p>
          </div>
        </div>

        {/* Cambio de Estrategia */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                
                Cambio de Estrategia: De Proyecto Único a Servicio Continuo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                Inicialmente, Alteridad propuso un <strong>modelo de proyecto único</strong> con una inversión fija para análisis e implementación. 
                Esa inversión proyectada nunca se activó debido a las dificultades técnicas heredadas de proveedores anteriores, y el aprendizaje del diagnóstico nos llevó a replantear el enfoque.
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
                    <span><strong>Aprendizaje continuo:</strong> La integración debe absorber el conocimiento tácito del negocio para convertirlo en reglas accionables y mantener la calidad de los datos.</span>
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
          
          <div className="hidden lg:block">
            <div className="relative overflow-x-auto pb-12">
              <div className="flex min-w-max px-4">
                {timeline.map((item, index) => {
                  const isNovember = index === timeline.length - 2;
                  const isDecember = index === timeline.length - 1;
                  return (
                    <div key={item.mes} className="relative flex items-center min-w-[280px]">
                      {index > 0 && (
                        <div className={`flex-1 h-0 border-t ${isDecember ? 'border-dashed border-amber-400' : 'border-border/60'} ${
                          isNovember ? 'animate-pulse' : ''
                        }`}>
                          <span className={`block h-0 w-full relative after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-r-4 ${
                            isDecember ? 'after:border-amber-400 after:rotate-45' : 'after:border-border/60 after:rotate-45'
                          }`} />
                        </div>
                      )}
                      <div className={`flex flex-col items-center text-center gap-3 transition-transform duration-200 ${index % 2 === 0 ? '-translate-y-6' : 'translate-y-6'}`}>
                        <div className={`w-5 h-5 rounded-full shadow-lg border-4 border-background ${
                          isNovember ? 'bg-amber-500 animate-pulse' :
                          isDecember ? 'bg-amber-400 animate-pulse' :
                          'bg-primary'
                        }`} />
                        <div className={`bg-card border rounded-xl p-4 shadow-sm min-h-[150px] w-[260px] flex flex-col justify-center text-left ${
                          isNovember ? 'border-amber-200' :
                          isDecember ? 'border-amber-100 border-dashed' :
                          ''
                        }`}>
                          <p className={`text-sm font-semibold uppercase tracking-wide ${
                            isNovember ? 'text-amber-600' :
                            isDecember ? 'text-amber-500' :
                            'text-primary'
                          }`}>
                            {item.mes}
                          </p>
                          <p className="text-sm text-foreground mt-2 leading-relaxed text-balance">{item.evento}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              * Nota: La migración Odoo 14 → 18 fue ejecutada internamente por Promed entre marzo y junio 2025, pausando adecuaciones externas.
            </div>
          </div>

          <div className="lg:hidden space-y-6">
                {timeline.map((item, index) => (
              <Card key={item.mes} className="border-l-4 border-l-primary">
                <CardContent className="pl-6 py-4">
                      <p className={`text-sm font-semibold uppercase tracking-wide ${
                        index === timeline.length - 2 ? 'text-amber-600' : 'text-primary'
                      }`}>
                        {item.mes}
                      </p>
                  <p className="text-base text-foreground mt-1">{item.evento}</p>
                </CardContent>
              </Card>
            ))}
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
          <Link href="/facturacion/volumen-problema">
            <Button>
              Siguiente: Volumen del Problema
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
