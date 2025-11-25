import { ArrowLeft, Settings, Users2, AlertTriangle, XCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { asIsDiagram, purchaseOrderDiagram } from '@/data/diagrams';

export default function ProcesoActual() {
  const roles = [
    { cargo: 'KAM (Key Account Manager)', responsabilidad: 'Gestión de cuentas clave, negociación con clientes', interaccion: 'Genera cotizaciones en sistema, transfiere a F-007' },
    { cargo: 'Especialista de Producto', responsabilidad: 'Configuración de productos, precios y condiciones', interaccion: 'Entrada manual de datos en formulario F-007' },
    { cargo: 'Equipo de Facturación', responsabilidad: 'Generación y validación de facturas', interaccion: 'Revisión en Odoo, transferencia manual a NAF' },
    { cargo: 'Equipo Marketing/Comercial', responsabilidad: 'Análisis de ventas y toma de decisiones', interaccion: 'Análisis de reportes con datos de NAF' },
  ];

  const fricciones = [
    { titulo: 'Entrada Manual Duplicada', descripcion: 'Datos ingresados 3 veces: F-007 → Odoo → NAF', tiempo: '~15 min/factura' },
    { titulo: 'Falta de Validación en Origen', descripcion: 'Errores detectados después de NAF', impacto: 'Reprocesos costosos' },
    { titulo: 'Dependencia de Conocimiento Tácito', descripcion: 'Reglas no documentadas, dependientes de personas', riesgo: 'Rotación de personal' },
  ];

  const blockers = [
    { titulo: 'No hay integración Odoo-NAF', impacto: 'Proceso manual completo', criticidad: 'Crítico' },
    { titulo: 'Reglas de negocio no centralizadas', impacto: 'Inconsistencias y errores', criticidad: 'Alto' },
    { titulo: 'Sin validación automática', impacto: 'Errores descubiertos tarde', criticidad: 'Alto' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Proceso Actual</h1><p className="text-xs text-muted-foreground">Flujo actual</p></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Settings className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Proceso Actual (Estado actual)</h2>
              <p className="text-base text-muted-foreground">Flujo detallado, roles y puntos de fricción</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El proceso actual de facturación en Promed involucra múltiples sistemas (F-007, Odoo, NAF) sin integración directa,
            lo que obliga a entrada manual repetida de datos y genera múltiples puntos de fricción.
          </p>
        </div>

        <section className="mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-4">Diagrama de Flujo Actual - Facturación</h3>
          <Card>
            <CardContent className="p-4">
              <MermaidDiagram id="as-is-flow" chart={asIsDiagram} />
            </CardContent>
          </Card>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              <strong>Nota:</strong> Este diagrama muestra el flujo actual de facturación, que es nuestra preocupación principal. 
              El análisis de marcas se enfoca especialmente en <strong>comodatos, alquileres y servicios</strong>.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-4">Proceso de Orden de Compra</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            El proceso de orden de compra complementa el flujo de facturación e involucra cinco roles clave coordinados 
            a través de múltiples sistemas (Odoo, NAF, F-007 en APEX, y WMS).
          </p>
          <Card>
            <CardContent className="p-4">
              <MermaidDiagram id="purchase-order-flow" chart={purchaseOrderDiagram} />
            </CardContent>
          </Card>
          <div className="mt-4">
            <Card className="bg-muted/50">
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-base">Puntos Críticos del Proceso de Orden de Compra</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-1.5">
                <p className="text-sm">• <strong>Entrada manual múltiple:</strong> La orden debe registrarse manualmente en NAF después de generarse en Odoo</p>
                <p className="text-sm">• <strong>F-007 como puente:</strong> El formulario F-007 en APEX conecta manualmente la orden con el sistema de facturación</p>
                <p className="text-sm">• <strong>Validación de márgenes:</strong> Requiere intervención del Gerente de Ventas cuando los márgenes son menores al 10%</p>
                <p className="text-sm">• <strong>Única integración automatizada:</strong> Solo la conexión NAF-WMS está automatizada en el proceso actual</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Users2 className="w-7 h-7 text-primary" />
            Roles y Responsables
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((rol, i) => (
              <Card key={i}>
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">{rol.cargo}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1.5">
                  <p className="text-sm"><strong>Responsabilidad:</strong> {rol.responsabilidad}</p>
                  <p className="text-sm text-muted-foreground"><strong>Interacción:</strong> {rol.interaccion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-orange-600" />
            Fricciones Identificadas
          </h3>
          <div className="space-y-3">
            {fricciones.map((f, i) => (
              <Card key={i} className="border-l-4 border-l-orange-500">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">{f.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1">
                  <p className="text-sm text-muted-foreground">{f.descripcion}</p>
                  {f.tiempo && <p className="text-xs text-orange-600"><strong>Tiempo:</strong> {f.tiempo}</p>}
                  {f.impacto && <p className="text-xs text-orange-600"><strong>Impacto:</strong> {f.impacto}</p>}
                  {f.riesgo && <p className="text-xs text-orange-600"><strong>Riesgo:</strong> {f.riesgo}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            <XCircle className="w-7 h-7 text-red-600" />
            Blockers Críticos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blockers.map((b, i) => (
              <Card key={i} className="border-l-4 border-l-red-500">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">{b.titulo}</CardTitle>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                    b.criticidad === 'Crítico' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                  }`}>
                    {b.criticidad}
                  </span>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{b.impacto}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/volumen-problema"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/propuesta-2026"><Button size="sm">Siguiente<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
