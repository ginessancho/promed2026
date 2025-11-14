import { ArrowLeft, Monitor, Shield, Zap, BarChart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MantenimientoDMS() {
  const capacidades = [
    { titulo: 'Business Rules Engine', icono: Shield, descripcion: 'Reglas dinámicas que aprenden del comportamiento real del negocio y se ajustan automáticamente', beneficio: 'Evolución continua sin intervención manual' },
    { titulo: 'Sistema de Alertas Proactivas', icono: Zap, descripcion: 'Alertas inteligentes que se generan antes de que ocurran problemas, basadas en patrones detectados', beneficio: 'Prevención en lugar de corrección' },
    { titulo: 'Process Mining', icono: BarChart, descripcion: 'Análisis continuo de flujos reales para extraer conocimiento tácito y optimizar procesos', beneficio: 'Mejora automática de eficiencia' },
    { titulo: 'Tarjetas de Análisis Conectadas', icono: Monitor, descripcion: 'KPIs que reflejan el estado real del negocio y se actualizan en tiempo real', beneficio: 'Visibilidad completa y accionable' },
  ];

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
                    <div className="bg-muted/30 aspect-video flex items-center justify-center rounded-lg border">
                      <p className="text-sm text-muted-foreground">[Screenshot Placeholder]</p>
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
          <h3 className="text-3xl font-bold mb-8">Arquitectura Técnica del DMS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { tech: 'Next.js 14', desc: 'Frontend + Server Components' },
              { tech: 'PostgreSQL', desc: 'Base de datos (Supabase)' },
              { tech: 'Vercel Edge', desc: 'Hosting global' },
              { tech: 'OpenAI + pgvector', desc: 'AI-powered features' },
            ].map((t, i) => (
              <Card key={i} className="text-center"><CardContent className="pt-6"><p className="font-bold text-lg">{t.tech}</p><p className="text-sm text-muted-foreground mt-2">{t.desc}</p></CardContent></Card>
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
          <Link href="/plan-trabajo-2026"><Button>Siguiente: Plan de Trabajo<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
