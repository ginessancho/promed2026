import { ArrowLeft, Lightbulb, CheckCircle2, GitBranch, Shield, Zap, DollarSign, Calendar, Layers } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { comparisonDiagram } from '@/data/diagrams';

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

        {/* Key Metrics - 3 Column */}
        <section className="mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-700 dark:text-green-400" />
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">$41K</div>
              <div className="text-sm text-green-600 dark:text-green-400">Inversión Total</div>
              <div className="text-xs text-muted-foreground mt-1">$5K adelanto + $3K/mes × 12</div>
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
                  Este proyecto representa una <strong>evolución natural</strong> de la inversión en Odoo realizada por Promed. 
                  El objetivo es convertir a Odoo en el centro neurálgico del ciclo de ventas completo, desde la cotización hasta 
                  la facturación, <strong>eliminando el formulario F-007</strong> y los procesos manuales asociados. Esto desbloqueará 
                  un nuevo nivel de eficiencia operativa, reducirá errores significativamente y creará una base sólida para futuras 
                  automatizaciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AS-IS vs TO-BE Comparison */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Transformación del Proceso</h3>
          <Card>
            <CardContent className="p-4">
              <MermaidDiagram id="comparison-flow" chart={comparisonDiagram} />
            </CardContent>
          </Card>
          
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 text-sm">❌ Problemas Actuales</h4>
              <ul className="text-xs text-red-800 dark:text-red-200 space-y-1">
                <li>• Entrada manual triplicada (F-007, Odoo, NAF)</li>
                <li>• Errores detectados tardíamente</li>
                <li>• Reprocesos consumen tiempo valioso</li>
                <li>• Sin validación automática</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm">✅ Solución Propuesta</h4>
              <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                <li>• Entrada única en Odoo</li>
                <li>• Validación automática inmediata</li>
                <li>• Sincronización directa con NAF</li>
                <li>• Alertas proactivas de errores</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Phases - Compact Cards */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <GitBranch className="w-7 h-7 text-blue-600" />
            Estrategia de Implementación Incremental
          </h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            El proyecto se ejecutará en 4 fases diseñadas para entregar valor de manera continua. Cada fase produce resultados 
            tangibles y medibles.
          </p>
          
          <div className="space-y-4">
            {/* Phase 1 */}
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Fase 1: Fundación y Victoria Temprana</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Enero - Marzo 2026 (3 meses)</p>
                  </div>
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Objetivo</h4>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Establecer las bases técnicas y demostrar el valor de la integración con un caso de uso de alto impacto y complejidad controlada.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Entregables Clave</h4>
                  <div className="grid md:grid-cols-2 gap-x-4 gap-y-0.5">
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                      <li>Auditoría y mapeo de datos Odoo ↔ NAF</li>
                      <li>Conector directo v1.0 (Python en Odoo)</li>
                    </ul>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                      <li>Piloto para casos simples (~20% volumen)</li>
                      <li>Dashboard de seguimiento actualizado</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 text-xs mb-1">🎯 Resultado Esperado</p>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    Reducción medible del tiempo de procesamiento para un segmento de facturas. Validación del enfoque técnico.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Fase 2: Expansión y Eliminación de F-007</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Abril - Julio 2026 (4 meses)</p>
                  </div>
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Objetivo</h4>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Extender la automatización para cubrir la mayoría de los escenarios de facturación y retirar por completo la dependencia del formulario F-007.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Entregables Clave</h4>
                  <div className="grid md:grid-cols-2 gap-x-4 gap-y-0.5">
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                      <li>Conector v2.0 con lógica avanzada</li>
                      <li>Integración de comodatos y alquileres</li>
                    </ul>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                      <li>Depuración de catálogo de servicios</li>
                      <li>Retiro oficial del formulario F-007</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-green-900 dark:text-green-100 text-xs mb-1">🎯 Resultado Esperado</p>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Eliminación casi total de la entrada de datos duplicada. Aumento drástico de la eficiencia operativa.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Fase 3: Sincronización Bidireccional</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Agosto - Octubre 2026 (3 meses)</p>
                  </div>
                  <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Objetivo</h4>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Crear un flujo de datos de ciclo cerrado, asegurando que Odoo no solo envíe datos, sino que también reciba actualizaciones de estado desde NAF.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Entregables Clave</h4>
                  <div className="grid md:grid-cols-2 gap-x-4 gap-y-0.5">
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                      <li>Mecanismo de webhooks o polling</li>
                      <li>Panel de control de integración</li>
                    </ul>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                      <li>Optimización del rendimiento</li>
                      <li>Visibilidad en tiempo real</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded border border-purple-200 dark:border-purple-800">
                  <p className="font-semibold text-purple-900 dark:text-purple-100 text-xs mb-1">🎯 Resultado Esperado</p>
                  <p className="text-xs text-purple-800 dark:text-purple-200">
                    Visibilidad completa del ciclo de vida de la factura desde Odoo. Sistema de integración robusto y monitoreable.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 4 */}
            <Card className="border-l-4 border-l-orange-600">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Fase 4: Capacitación y Transferencia</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Noviembre - Diciembre 2026 (2 meses)</p>
                  </div>
                  <Shield className="w-5 h-5 text-orange-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Objetivo</h4>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Asegurar la adopción exitosa de los nuevos procesos y transferir el conocimiento necesario al equipo de TI de Promed.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Entregables Clave</h4>
                  <div className="grid md:grid-cols-2 gap-x-4 gap-y-0.5">
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                      <li>Manuales de usuario y técnicos</li>
                      <li>Sesiones de capacitación</li>
                    </ul>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                      <li>Plan de soporte a largo plazo</li>
                      <li>Transferencia de conocimiento</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded border border-orange-200 dark:border-orange-800">
                  <p className="font-semibold text-orange-900 dark:text-orange-100 text-xs mb-1">🎯 Resultado Esperado</p>
                  <p className="text-xs text-orange-800 dark:text-orange-200">
                    Un equipo capacitado y autónomo, y una solución documentada y sostenible en el tiempo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits - 3 Column Grid */}
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

        {/* Technical Approach */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Enfoque Técnico: Conector Directo Evolutivo</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-base">Fase Inicial (Fases 1-2)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground leading-snug">
                  Desarrollo de un módulo Python directamente en Odoo. Solución más rápida de implementar, más económica y 
                  perfectamente adecuada para validar la integración y manejar los casos de uso iniciales.
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-base">Evolución Futura (Post-Fase 2)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground leading-snug">
                  Si la lógica de negocio se vuelve significativamente compleja, se re-evaluará la necesidad de migrar a una 
                  plataforma de middleware. El código del conector directo servirá como base sólida para esta migración.
                </p>
              </CardContent>
            </Card>
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
