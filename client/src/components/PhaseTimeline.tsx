import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

const phases = [
  { name: 'Fase 1: Fundación', start: 0, end: 3, color: 'bg-blue-500' },
  { name: 'Fase 2: Expansión', start: 3, end: 7, color: 'bg-green-500' },
  { name: 'Fase 3: Sincronización', start: 7, end: 10, color: 'bg-purple-500' },
  { name: 'Fase 4: Transferencia', start: 10, end: 12, color: 'bg-orange-500' },
];

const months = Array.from({ length: 12 }, (_, i) => `M${i + 1}`);

export default function PhaseTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitBranch className="w-5 h-5" />
          Roadmap Visual del Proyecto
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
        <div className="w-full overflow-x-auto">
          <div className="relative w-full h-48" style={{ minWidth: '600px' }}>
            {/* Month markers */}
            <div className="absolute top-0 left-0 right-0 h-full grid grid-cols-12">
              {months.map((month, i) => (
                <div key={month} className="text-center border-r border-dashed border-border last:border-r-0">
                  <span className="text-xs text-muted-foreground mt-1">{month}</span>
                </div>
              ))}
            </div>

            {/* Phase bars */}
            <div className="absolute top-10 left-0 right-0 space-y-3">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className={`absolute h-10 ${phase.color} rounded-lg flex items-center justify-between px-3 shadow-md`}
                  style={{
                    left: `${(phase.start / 12) * 100}%`,
                    width: `${((phase.end - phase.start) / 12) * 100}%`,
                    top: `${index * 2.75}rem`, // 44px
                  }}
                >
                  <span className="text-xs font-bold text-white truncate">{phase.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
