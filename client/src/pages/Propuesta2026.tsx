import { ArrowLeft, Lightbulb, CheckCircle2, GitBranch, Shield, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { toBeDiagram } from '@/data/diagrams';

export default function Propuesta2026() {
  const beneficios = [
    'Eliminación de entrada manual duplicada en F-007',
    'Reducción de errores de transcripción',
    'Automatización del flujo Odoo → NAF',
    'Validaciones automáticas en origen (Odoo)',
    'Reglas de negocio centralizadas y versionadas',
    'Visibilidad en tiempo real del estado de facturación',
    'Base sólida para futuras integraciones',
    'Mejora continua del ecosistema Odoo',
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Propuesta 2026</h1></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center"><Lightbulb className="w-8 h-8 text-green-600" /></div>
            <div>
              <h2 className="text-4xl font-bold">Propuesta 2026</h2>
              <p className="text-lg text-muted-foreground">Evolución estratégica del ecosistema Odoo</p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Enfoque de Innovación Continua</h3>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  Este proyecto se enmarca como una <strong>evolución natural</strong> de la inversión en Odoo realizada por Promed. 
                  El objetivo es maximizar el retorno de esta inversión al convertir a Odoo en el centro neurálgico del ciclo de ventas, 
                  desde la cotización hasta la facturación, eliminando procesos manuales y desbloqueando un nuevo nivel de eficiencia operativa.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Solución Propuesta (TO-BE)</h3>
          <Card><CardContent className="p-6"><MermaidDiagram id="to-be-flow" chart={toBeDiagram} /></CardContent></Card>
          
          <div className="mt-6 p-6 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-3">Objetivo Principal</h4>
            <p className="text-muted-foreground leading-relaxed">
              Automatizar el flujo de facturación para que las facturas se generen en Odoo y se integren de forma transparente 
              con el sistema contable NAF (Oracle), <strong>eliminando la necesidad del formulario F-007</strong> y los procesos manuales asociados.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-blue-600" />
            Estrategia de Implementación Incremental
          </h3>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            El proyecto se ejecutará en 4 fases diseñadas para entregar valor de manera continua. Cada fase produce resultados 
            tangibles y medibles, permitiendo ver el progreso y los beneficios de forma regular, a la vez que se mitigan los riesgos.
          </p>
          
          <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Fase 1: Fundación y Victoria Temprana</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Enero - Marzo 2026 (3 meses)</p>
                  </div>
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Objetivo</h4>
                  <p className="text-muted-foreground">
                    Establecer las bases técnicas y demostrar el valor de la integración con un caso de uso de alto impacto y complejidad controlada.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Entregables Clave</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Auditoría y mapeo de datos detallado (Odoo ↔ NAF)</li>
                    <li>Conector directo v1.0 (módulo Python en Odoo)</li>
                    <li>Piloto de integración para casos simples (~20% del volumen)</li>
                    <li>Dashboard de seguimiento actualizado en promed.alteridad.org</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🎯 Resultado Esperado</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Reducción medible del tiempo de procesamiento para un segmento de facturas. Validación del enfoque técnico.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Fase 2: Expansión y Eliminación de F-007</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Abril - Julio 2026 (4 meses)</p>
                  </div>
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Objetivo</h4>
                  <p className="text-muted-foreground">
                    Extender la automatización para cubrir la mayoría de los escenarios de facturación y retirar por completo la dependencia del formulario F-007.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Entregables Clave</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Conector directo v2.0 con lógica de negocio avanzada (comodatos, alquileres)</li>
                    <li>Depuración y gestión del catálogo de ~114 servicios en Odoo</li>
                    <li>Eliminación de servicios comodín ("VENTAS-I", etc.)</li>
                    <li>Retiro oficial del formulario F-007</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-2">🎯 Resultado Esperado</p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Eliminación casi total de la entrada de datos duplicada. Aumento drástico de la eficiencia operativa.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Fase 3: Sincronización Bidireccional y Optimización</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Agosto - Octubre 2026 (3 meses)</p>
                  </div>
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Objetivo</h4>
                  <p className="text-muted-foreground">
                    Crear un flujo de datos de ciclo cerrado, asegurando que Odoo no solo envíe datos, sino que también reciba actualizaciones de estado desde NAF.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Entregables Clave</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Mecanismo de webhooks o polling (NAF → Odoo)</li>
                    <li>Panel de control de integración en Odoo</li>
                    <li>Optimización del rendimiento del conector</li>
                    <li>Visibilidad en tiempo real del estado de facturación</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎯 Resultado Esperado</p>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Visibilidad completa del ciclo de vida de la factura desde Odoo. Sistema de integración robusto y monitoreable.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Fase 4: Capacitación, Documentación y Transferencia</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Noviembre - Diciembre 2026 (2 meses)</p>
                  </div>
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Objetivo</h4>
                  <p className="text-muted-foreground">
                    Asegurar la adopción exitosa de los nuevos procesos y transferir el conocimiento necesario al equipo de TI de Promed para el soporte a largo plazo.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Entregables Clave</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Manuales de usuario y técnicos completos</li>
                    <li>Sesiones de capacitación con equipos clave</li>
                    <li>Plan de soporte y mantenimiento a largo plazo</li>
                    <li>Transferencia de conocimiento al equipo de TI</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="font-semibold text-orange-900 dark:text-orange-100 mb-2">🎯 Resultado Esperado</p>
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    Un equipo capacitado y autónomo, y una solución documentada y sostenible en el tiempo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Beneficios Esperados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beneficios.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Enfoque Técnico: Conector Directo Evolutivo</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              En lugar de introducir la complejidad y el costo de un middleware desde el principio, proponemos un enfoque pragmático 
              de <strong>"Conector Directo Evolutivo"</strong>:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fase Inicial (Fases 1-2)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Desarrollo de un módulo Python directamente en Odoo. Solución más rápida de implementar, más económica y 
                    perfectamente adecuada para validar la integración y manejar los casos de uso iniciales.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evolución Futura (Post-Fase 2)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Si la lógica de negocio se vuelve significativamente compleja, se re-evaluará la necesidad de migrar a una 
                    plataforma de middleware. El código del conector directo servirá como base sólida para esta migración.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <div className="flex justify-between pt-8 border-t">
          <Link href="/proceso-actual"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/detalles-tecnicos"><Button>Siguiente<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
