import { ArrowLeft, Wrench, Database, Code, ListOrdered, Target } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { architectureDiagram } from '@/data/diagrams';

export default function DetallesTecnicos() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Detalles Técnicos</h1></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center"><Wrench className="w-8 h-8 text-blue-600" /></div>
            <div><h2 className="text-4xl font-bold">Detalles Técnicos</h2><p className="text-lg text-muted-foreground">Arquitectura e integración</p></div>
          </div>
        </div>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Arquitectura de Integración</h3>
          <Card><CardContent className="p-6"><MermaidDiagram id="architecture" chart={architectureDiagram} /></CardContent></Card>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3"><Database className="w-8 h-8 text-primary" />Documentación de Sistemas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Code className="w-5 h-5" />Odoo</CardTitle></CardHeader><CardContent className="space-y-2">
              <p><strong>Versión:</strong> 14.0 (actual)</p>
              <p><strong>Módulos:</strong> Accounting, Sales, Inventory</p>
              <p><strong>APIs:</strong> XML-RPC, JSON-RPC</p>
              <p className="text-sm text-muted-foreground">Documentación oficial: odoo.com/documentation</p>
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" />Oracle NAF</CardTitle></CardHeader><CardContent className="space-y-2">
              <p><strong>Base:</strong> Oracle Database</p>
              <p><strong>Tablas:</strong> FACTURAS, CLIENTES, PRODUCTOS</p>
              <p><strong>APIs:</strong> PL/SQL, REST (a confirmar)</p>
              <p className="text-sm text-muted-foreground">Documentación interna de Promed</p>
            </CardContent></Card>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3"><ListOrdered className="w-8 h-8 text-purple-600" />Procesos Priorizados para Integración</h3>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Se han identificado 4 procesos críticos que requieren integración Odoo-NAF para mejorar la eficiencia operativa,
            garantizar la confianza en los datos y unificar los registros maestros entre sistemas.
          </p>
          
          <div className="space-y-6">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-500" />
                      1. Registro de Orden de Compra (OC)
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Prioridad: Alta | Responsables: OVNI, Sale Operation Squad</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold">P1</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Los datos de una OC se captan en NAF de manera manual, campo por campo</li>
                    <li>Riesgo de error al momento de transcribir de PDF a campos NAF</li>
                    <li>Riesgo de no registro o registro tardío de una orden de compra</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">✅ Propuesta</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Sistematizar todos los datos de una OC desde la pantalla de Odoo</li>
                    <li>Crear una interfaz que envíe datos desde Odoo a NAF y respuesta de registro a Odoo</li>
                    <li>Aumentar la confianza en el registro correcto y oportuno</li>
                    <li>Actualizar automáticamente etapas de la oportunidad optimizando el pipeline del CRM</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources (Partner Odoo)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      2. Creación de Cliente
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Prioridad: Alta | Responsables: Finanzas / Cobros</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">P2</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Deben llenar formulario en Apex (16 campos obligatorios)</li>
                    <li>Esperar filtro y aprobación de Prosp ace (mesa de ayuda)</li>
                    <li>Esperar filtro y aprobación de Cobros para asignar nuevo código NAF</li>
                    <li>Cuellos de botella: tiempos mínimos de 35 min y máximos de 2 días</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">✅ Propuesta</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Canalizar el llenado de información del nuevo cliente desde Odoo con validaciones comerciales, contables y fiscales</li>
                    <li>Automatizar la asignación del código NAF cumpliendo con requisitos contables y fiscales</li>
                    <li>Mejorar el tiempo de la operación de facturación dentro del proceso de ventas</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources (Partner Odoo)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="w-5 h-5 text-yellow-600" />
                      3. Creación de Productos
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Prioridad: Media | Responsables: Grupo comercial, Inventario</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-semibold">P3</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Depende de Prosp ace (mesa de ayuda) para crear producto en CRM y cotizar al cliente</li>
                    <li>Luego deben crear el producto en NAF para pedir al proveedor y facturar</li>
                    <li>Pueden cotizar productos con estatus regulatorio vencido o inexistente</li>
                    <li>Asuntos regulatorios desconoce productos nuevos hasta etapa tardía</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">✅ Propuesta</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Permitir que el usuario cree nuevos productos, controlado por Prosp ace</li>
                    <li>Crear proceso colaborativo para creación ordenada de productos con gestión regulatoria</li>
                    <li>Controlar la cotización de productos con estatus regulatorio vencido</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Involucrados:</strong> Tecnología, CX, Asuntos regulatorios, Gateway Resources (Partner Odoo)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      4. Gestión de Pedidos
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Prioridad: Media | Responsables: Sale Operation Squad</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">P4</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Debe buscar información del estatus de pedido en pantallas Apex (NAF) para mantener pipeline actualizado</li>
                    <li>Servicio al cliente debe identificar oportunamente si se debe generar solicitud de prórroga</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">✅ Propuesta</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Publicar en pantallas de Odoo el estatus del pedido relacionado a OC</li>
                    <li>Mantener un pronóstico de facturación más real</li>
                    <li>Ampliar la trazabilidad de una licitación pública post orden de compra</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources (Partner Odoo)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Opciones de Integración</h3>
          <div className="space-y-4">
            {[
              { opcion: 'Webhooks', pros: 'Tiempo real, bajo acoplamiento', contras: 'Requiere endpoint público', viabilidad: 'Alta' },
              { opcion: 'APIs REST', pros: 'Estándar, fácil de mantener', contras: 'Polling o eventos', viabilidad: 'Alta' },
              { opcion: 'Batch Processing', pros: 'Simple, robusto', contras: 'No es tiempo real', viabilidad: 'Media' },
            ].map((o, i) => (
              <Card key={i}><CardHeader><CardTitle>{o.opcion}</CardTitle></CardHeader><CardContent className="space-y-2">
                <p><strong>Pros:</strong> {o.pros}</p>
                <p><strong>Contras:</strong> {o.contras}</p>
                <p><strong>Viabilidad:</strong> <span className={o.viabilidad === 'Alta' ? 'text-green-600' : 'text-orange-600'}>{o.viabilidad}</span></p>
              </CardContent></Card>
            ))}
          </div>
        </section>

        <div className="flex justify-between pt-8 border-t">
          <Link href="/propuesta-2026"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/mantenimiento-dms"><Button>Siguiente<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
