import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { timelineData } from '@/data/metrics';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function ProjectTimeline() {
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Análisis': return 'bg-chart-1 text-white';
      case 'Desarrollo': return 'bg-chart-2 text-white';
      case 'Pruebas': return 'bg-chart-3 text-white';
      case 'Despliegue': return 'bg-chart-4 text-white';
      case 'Monitoreo': return 'bg-chart-5 text-white';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <CardTitle>Timeline del Proyecto - 12 Meses</CardTitle>
        </div>
        <CardDescription>
          Enero - Diciembre 2026
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {timelineData.map((item, index) => (
              <div key={index} className="relative pl-14">
                {/* Timeline dot */}
                <div className={`absolute left-3 w-6 h-6 rounded-full border-4 border-background ${
                  item.progress === 100 ? 'bg-primary' : 'bg-muted'
                }`}>
                  {item.progress === 100 && (
                    <CheckCircle2 className="w-6 h-6 text-primary absolute -left-0.5 -top-0.5" />
                  )}
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{item.month}</h4>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(item.phase)}`}>
                        {item.phase}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-muted-foreground">
                        Progreso
                      </span>
                      <div className="text-2xl font-bold text-primary">
                        {item.progress}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <ul className="mt-3 space-y-1">
                    {item.activities.map((activity, actIndex) => (
                      <li key={actIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
