import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Demonstracion() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/detalles-tecnicos"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver a Detalles Técnicos</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Demostración</h1></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="text-center">
          <PlayCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-3xl font-bold">Demostración en Construcción</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Este espacio está reservado para una futura demostración de la solución.
          </p>
        </div>
      </main>
    </div>
  );
}
