import { ArrowLeft, Lightbulb, DollarSign, CheckCircle2, GitBranch, Shield } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { toBeDiagram } from '@/data/diagrams';

export default function Propuesta2026() {
  const beneficios = [
    'Eliminación de entrada manual duplicada',
    'Reducción de errores en 80%+',
    'Ahorro de ~120 horas/mes',
    'Validaciones automáticas en origen',
    'Reglas de negocio centralizadas y versionadas',
    'Base sólida para futuras migraciones',
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
            <div><h2 className="text-4xl font-bold">Propuesta 2026</h2><p className="text-lg text-muted-foreground">Solución TO-BE e inversión</p></div>
          </div>
        </div>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Solución Propuesta (TO-BE)</h3>
          <Card><CardContent className="p-6"><MermaidDiagram id="to-be-flow" chart={toBeDiagram} /></CardContent></Card>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3"><GitBranch className="w-8 h-8 text-blue-600" />Fases del Proyecto con Puertas de Validación</h3>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            El proyecto se estructura en fases con puertas de decisión (stage gates) que aseguran la validación ejecutiva 
            y la viabilidad técnica antes de comprometer recursos adicionales.
          </p>
          
          <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Fase 0: Validación Ejecutiva</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Noviembre 2025</p>
                  </div>
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Objetivo</h4>
                  <p className="text-muted-foreground">Confirmar la necesidad fundamental del proyecto y validar el paso actual con el equipo ejecutivo de Promed.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Actividades</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Presentación de hallazgos preliminares</li>
                    <li>Validación del análisis de datos con ejecutivos</li>
                    <li>Confirmación de prioridades de negocio</li>
                    <li>Alineación de expectativas y alcance</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🚪 Puerta de Decisión</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">¿Se confirma la necesidad del proyecto? ¿Los ejecutivos validan el diagnóstico?</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">✓ Sí → Avanzar a Fase 1 | ✗ No → Replantear alcance o pausar proyecto</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Fase 1: Viabilidad Completa</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Diciembre 2025 - Enero 2026</p>
                  </div>
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Objetivo</h4>
                  <p className="text-muted-foreground">Definir el alcance completo, identificar campos críticos a integrar en Odoo, y validar la viabilidad técnica y económica de la solución.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Actividades</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Mapeo detallado de campos críticos de facturación</li>
                    <li>Análisis de integraciones Odoo-NAF requeridas</li>
                    <li>Definición de reglas de negocio específicas</li>
                    <li>Evaluación de arquitectura técnica</li>
                    <li>Estimación de esfuerzo y cronograma detallado</li>
                    <li>Análisis de riesgos técnicos y mitigaciones</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Entregables</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Catálogo completo de campos a integrar en Odoo</li>
                    <li>Documento de arquitectura técnica detallada</li>
                    <li>Plan de proyecto con hitos y dependencias</li>
                    <li>Matriz de riesgos y plan de mitigación</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-2">🚪 Puerta de Decisión</p>
                  <p className="text-sm text-green-800 dark:text-green-200">¿Es viable técnica y económicamente? ¿Se aprueba el alcance y presupuesto definido?</p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-2">✓ Sí → Avanzar a Fase 2 (Implementación) | ✗ No → Ajustar alcance o cancelar proyecto</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Fase 2: Implementación</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Febrero - Diciembre 2026</p>
                  </div>
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Objetivo</h4>
                  <p className="text-muted-foreground">Ejecutar la integración Odoo-NAF, implementar reglas de negocio, y desplegar la solución en producción.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Modelo de Servicio</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Reuniones semanales de seguimiento (45 min)</li>
                    <li>Reunión mensual con equipo ejecutivo (1 hora)</li>
                    <li>Gestión de riesgos y mitigación continua</li>
                    <li>Coordinación entre desarrolladores y líderes de equipo</li>
                    <li>Mantenimiento del plan de transición detallado</li>
                    <li>Construcción de reglas de negocio para gestión eficiente de datos</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎯 Resultado Esperado</p>
                  <p className="text-sm text-purple-800 dark:text-purple-200">Sistema integrado Odoo-NAF operativo con validaciones automáticas y reglas de negocio centralizadas.</p>
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

        <div className="flex justify-between pt-8 border-t">
          <Link href="/proceso-actual"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/detalles-tecnicos"><Button>Siguiente<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
