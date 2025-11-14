import { ArrowLeft, AlertCircle, Users2, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { asIsDiagram } from '@/data/diagrams';

export default function ProcesoActual() {
  const roles = [
    { cargo: 'KAM (Key Account Manager)', responsabilidad: 'Gestión de cuentas clave, negociación con clientes', interaccion: 'Genera cotizaciones en sistema, transfiere a F-007' },
    { cargo: 'Especialista de Producto', responsabilidad: 'Configuración de productos, precios y condiciones', interaccion: 'Entrada manual de datos en formulario F-007' },
    { cargo: 'Equipo de Facturación', responsabilidad: 'Generación y validación de facturas', interaccion: 'Revisión en Odoo, transferencia manual a NAF' },
    { cargo: 'Equipo Marketing/Comercial', responsabilidad: 'Análisis de ventas y toma de decisiones', interaccion: 'Análisis en KBOX con datos de NAF' },
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver al Inicio</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Proceso Actual</h1><p className="text-sm text-muted-foreground">Flujo AS-IS</p></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"><Settings className="w-8 h-8 text-muted-foreground" /></div>
            <div><h2 className="text-4xl font-bold text-foreground">Proceso Actual (AS-IS)</h2><p className="text-lg text-muted-foreground">Flujo detallado, roles y puntos de fricción</p></div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            El proceso actual de facturación en Promed involucra múltiples sistemas (F-007, Odoo, NAF) sin integración directa,
            lo que obliga a entrada manual repetida de datos y genera múltiples puntos de fricción.
          </p>
        </div>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Diagrama de Flujo AS-IS</h3>
          <Card><CardContent className="p-6"><MermaidDiagram id="as-is-flow" chart={asIsDiagram} /></CardContent></Card>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3"><Users2 className="w-8 h-8 text-primary" />Roles y Responsables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((rol, i) => (
              <Card key={i}><CardHeader><CardTitle>{rol.cargo}</CardTitle></CardHeader><CardContent className="space-y-2">
                <p><strong>Responsabilidad:</strong> {rol.responsabilidad}</p>
                <p className="text-muted-foreground"><strong>Interacción:</strong> {rol.interaccion}</p>
              </CardContent></Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Fricciones Identificadas</h3>
          <div className="space-y-4">
            {fricciones.map((f, i) => (
              <Card key={i} className="border-l-4 border-l-orange-500">
                <CardHeader><CardTitle>{f.titulo}</CardTitle></CardHeader>
                <CardContent><p>{f.descripcion}</p><p className="text-sm text-muted-foreground mt-2">{f.tiempo || f.impacto || f.riesgo}</p></CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3"><AlertCircle className="w-8 h-8 text-destructive" />Blockers Críticos</h3>
          <div className="space-y-4">
            {blockers.map((b, i) => (
              <Card key={i} className="border-l-4 border-l-destructive">
                <CardHeader><div className="flex justify-between"><CardTitle>{b.titulo}</CardTitle><span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">{b.criticidad}</span></div></CardHeader>
                <CardContent><p>{b.impacto}</p></CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex justify-between items-center pt-8 border-t">
          <Link href="/volumen-problema"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/propuesta-2026"><Button>Siguiente<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
