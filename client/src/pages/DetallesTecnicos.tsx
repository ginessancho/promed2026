import { ArrowLeft, Wrench, Database, Code, ListOrdered, Target, BookOpen } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { architectureDiagram } from '@/data/diagrams';
import CriticalFieldsTable from '@/components/CriticalFieldsTable';
import { facturaFields, clienteFields, productoFields } from '@/data/criticalFields';

export default function DetallesTecnicos() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Detalles Técnicos</h1></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Wrench className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Detalles Técnicos</h2>
              <p className="text-base text-muted-foreground">Arquitectura e integración</p>
            </div>
          </div>
        </div>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Arquitectura de Integración</h3>
          <Card>
            <CardContent className="p-4">
              <MermaidDiagram id="architecture" chart={architectureDiagram} />
            </CardContent>
          </Card>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Database className="w-7 h-7 text-primary" />
            Documentación de Sistemas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-4 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="w-5 h-5" />
                  Odoo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-1.5">
                <p className="text-sm"><strong>Versión:</strong> 14.0 (actual)</p>
                <p className="text-sm"><strong>Módulos:</strong> Accounting, Sales, Inventory</p>
                <p className="text-sm"><strong>APIs:</strong> XML-RPC, JSON-RPC</p>
                <p className="text-xs text-muted-foreground mt-2">Documentación oficial: odoo.com/documentation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="w-5 h-5" />
                  Oracle NAF
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-1.5">
                <p className="text-sm"><strong>Base:</strong> Oracle Database</p>
                <p className="text-sm"><strong>Tablas:</strong> FACTURAS, CLIENTES, PRODUCTOS</p>
                <p className="text-sm"><strong>APIs:</strong> PL/SQL, REST (a confirmar)</p>
                <p className="text-xs text-muted-foreground mt-2">Documentación interna de Promed</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <ListOrdered className="w-7 h-7 text-purple-600" />
            Procesos Priorizados para Integración
          </h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Se han identificado 4 procesos críticos que requieren integración Odoo-NAF para mejorar la eficiencia operativa,
            garantizar la confianza en los datos y unificar los registros maestros entre sistemas.
          </p>
          
          <div className="space-y-4">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-500" />
                      1. Registro de Orden de Compra (OC)
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Prioridad: Alta | Responsables: OVNI, Sale Operation Squad</p>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold flex-shrink-0">P1</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Captura manual campo por campo en NAF</li>
                      <li>Riesgo de error al transcribir de PDF</li>
                      <li>Registro tardío o faltante de OC</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-green-600 dark:text-green-400">✅ Propuesta</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Sistematizar datos desde Odoo</li>
                      <li>Interfaz automática Odoo → NAF</li>
                      <li>Actualización automática del CRM</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      2. Creación de Cliente
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Prioridad: Alta | Responsables: Finanzas / Cobros</p>
                  </div>
                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold flex-shrink-0">P2</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Formulario Apex con 16 campos obligatorios</li>
                      <li>Aprobación de Prosp ace (mesa de ayuda)</li>
                      <li>Aprobación de Cobros para código NAF</li>
                      <li>Cuellos de botella: 35 min - 2 días</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-green-600 dark:text-green-400">✅ Propuesta</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Llenado desde Odoo con validaciones</li>
                      <li>Asignación automática de código NAF</li>
                      <li>Mejora del tiempo de facturación</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-yellow-600" />
                      3. Creación de Productos
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Prioridad: Media | Responsables: Grupo comercial, Inventario</p>
                  </div>
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-semibold flex-shrink-0">P3</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Dependencia de Prosp ace para crear producto</li>
                      <li>Creación duplicada en NAF</li>
                      <li>Cotización de productos con estatus vencido</li>
                      <li>Asuntos regulatorios desconoce productos nuevos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-green-600 dark:text-green-400">✅ Propuesta</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Creación controlada por Prosp ace</li>
                      <li>Proceso colaborativo con gestión regulatoria</li>
                      <li>Control de estatus regulatorio</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Involucrados:</strong> Tecnología, CX, Asuntos regulatorios, Gateway Resources
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      4. Gestión de Pedidos
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Prioridad: Media | Responsables: Sale Operation Squad</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold flex-shrink-0">P4</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Búsqueda manual en pantallas Apex (NAF)</li>
                      <li>Pipeline desactualizado</li>
                      <li>Identificación tardía de prórrogas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-green-600 dark:text-green-400">✅ Propuesta</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Publicar estatus del pedido en Odoo</li>
                      <li>Pronóstico de facturación más real</li>
                      <li>Mayor trazabilidad post-OC</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Opciones de Integración</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { opcion: 'Webhooks', pros: 'Tiempo real, bajo acoplamiento', contras: 'Requiere endpoint público', viabilidad: 'Alta' },
              { opcion: 'APIs REST', pros: 'Estándar, fácil de mantener', contras: 'Polling o eventos', viabilidad: 'Alta' },
              { opcion: 'Batch Processing', pros: 'Simple, robusto', contras: 'No es tiempo real', viabilidad: 'Media' },
            ].map((o, i) => (
              <Card key={i}>
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">{o.opcion}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1.5">
                  <p className="text-sm"><strong>Pros:</strong> {o.pros}</p>
                  <p className="text-sm"><strong>Contras:</strong> {o.contras}</p>
                  <p className="text-sm"><strong>Viabilidad:</strong> <span className={o.viabilidad === 'Alta' ? 'text-green-600' : 'text-orange-600'}>{o.viabilidad}</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <ListOrdered className="w-7 h-7 text-green-600" />
            Mapeo de Campos Críticos
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            A continuación se detallan los campos críticos que serán sincronizados entre Odoo y NAF para las entidades principales.
          </p>
          <CriticalFieldsTable title="Facturas" fields={facturaFields} />
          <CriticalFieldsTable title="Clientes" fields={clienteFields} />
          <CriticalFieldsTable title="Productos" fields={productoFields} />
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Fundamento Técnico y Documentación
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Nuestra estrategia se basa en las mejores prácticas y herramientas estándar proporcionadas por Odoo, garantizando una solución robusta, sostenible y alineada con la tecnología oficial.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:border-blue-500/50 transition-colors">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">API Externa (XML-RPC)</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">Utilizamos la API externa estándar de Odoo para una comunicación segura y fiable entre sistemas.</p>
                <a href="https://www.odoo.com/documentation/14.0/developer/reference/external_api.html" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Ver Documentación</Button>
                </a>
              </CardContent>
            </Card>
            <Card className="hover:border-blue-500/50 transition-colors">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Mapeo de Modelos (ORM)</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">Accedemos a los datos a través del ORM de Odoo, respetando la estructura y lógica de negocio de la plataforma.</p>
                <a href="https://www.odoo.com/documentation/14.0/developer/reference/orm.html" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Ver Documentación</Button>
                </a>
              </CardContent>
            </Card>
            <Card className="hover:border-blue-500/50 transition-colors">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Desarrollo de Módulos</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">El "Conector Directo" se empaqueta como un módulo personalizado, siguiendo las guías oficiales de desarrollo.</p>
                <a href="https://www.odoo.com/documentation/14.0/developer/howtos/rdtraining.html" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Ver Documentación</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/propuesta-2026"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/mantenimiento-dms"><Button size="sm">Siguiente<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
