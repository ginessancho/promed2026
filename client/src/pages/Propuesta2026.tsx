import { ArrowLeft, Lightbulb, DollarSign, CheckCircle2 } from 'lucide-react';
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
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3"><DollarSign className="w-8 h-8 text-primary" />Inversión</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary"><CardHeader><CardTitle>Adelanto Inicial</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold text-primary">$5,000</p><p className="text-sm text-muted-foreground mt-2">USD</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Servicio Mensual</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">$2,000</p><p className="text-sm text-muted-foreground mt-2">USD/mes × 12 meses</p></CardContent></Card>
            <Card className="bg-primary/5"><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold text-primary">$29,000</p><p className="text-sm text-muted-foreground mt-2">USD (12 meses)</p></CardContent></Card>
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
