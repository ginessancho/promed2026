import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

const phases = [
  { name: 'Fase 1: Diseño', concept: 'Fundación y victoria temprana', start: 0, end: 2, color: 'bg-blue-500/70' },
  { name: 'Fase 2: Desarrollo', concept: 'Expansión sin F-007', start: 2, end: 5, color: 'bg-emerald-500/70' },
  { name: 'Fase 3: Pruebas', concept: 'Sincronización bidireccional', start: 5, end: 7, color: 'bg-purple-500/70' },
  { name: 'Fase 4: Producción', concept: 'Capacitación y puesta en marcha', start: 7, end: 9, color: 'bg-amber-500/70' },
  { name: 'Fase 5: Monitoreo y Capacitación', concept: 'Operación con monitoreo continuo (DMS)', start: 9, end: 12, color: 'bg-rose-500/70' },
];

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function PhaseTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitBranch className="w-5 h-5 text-primary" />
          Roadmap Visual del Proyecto
        </CardTitle>
        <CardDescription>
          Distribución de las 5 fases a lo largo de 12 meses; cada fase funciona como puerta para habilitar la siguiente.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6 md:px-6">
        <div className="w-full overflow-x-auto rounded-lg border bg-background p-4">
          <div className="relative" style={{ minWidth: '700px' }}>
            {/* Month Grid */}
            <div className="grid grid-cols-12 h-32">
              {months.map((month, i) => (
                <div key={month} className="text-center border-r border-dashed border-border last:border-r-0 pt-2">
                  <span className="text-xs font-medium text-muted-foreground">{month}</span>
                </div>
              ))}
            </div>

            {/* Phase Bars */}
            <div className="absolute top-12 left-0 right-0 space-y-2">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className={`absolute h-14 ${phase.color} rounded-md flex flex-col justify-center px-3 py-2 shadow-lg hover:scale-[1.01] transition-transform duration-200`}
                  style={{
                    left: `calc(${(phase.start / 12) * 100}% + 4px)`,
                    width: `calc(${((phase.end - phase.start) / 12) * 100}% - 8px)`,
                    top: `${index * 0.5}rem`, // Stagger the bars slightly
                  }}
                  title={`${phase.name} – ${phase.concept}`}
                >
                  <span className="text-sm font-bold text-white truncate">{phase.name}</span>
                  <span className="text-[11px] text-white/90 truncate">{phase.concept}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
