import { ArrowLeft, Wrench, Database, Code } from 'lucide-react';
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
