import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { anomaliesData } from '@/data/metrics';

export default function AnomaliesChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Anomalías Detectadas en el Análisis de Datos</CardTitle>
        <CardDescription>
          Porcentaje de registros afectados por cada tipo de anomalía
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={anomaliesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              angle={-15}
              textAnchor="end"
              height={100}
              className="text-xs"
            />
            <YAxis 
              label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold text-sm mb-1">{data.name}</p>
                      <p className="text-sm">
                        <span className="font-medium">Porcentaje:</span> {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}%
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Registros afectados:</span> {data.count} de {data.total}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Impacto:</span>{' '}
                        <span className={`font-semibold ${
                          data.impact === 'Crítico' ? 'text-destructive' :
                          data.impact === 'Alto' ? 'text-accent' :
                          'text-primary'
                        }`}>
                          {data.impact}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Porcentaje de Registros Afectados" radius={[8, 8, 0, 0]}>
              {anomaliesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {anomaliesData.map((anomaly, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{anomaly.name}</h4>
                <span 
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    anomaly.impact === 'Crítico' ? 'bg-destructive/10 text-destructive' :
                    anomaly.impact === 'Alto' ? 'bg-accent/10 text-accent' :
                    'bg-primary/10 text-primary'
                  }`}
                >
                  {anomaly.impact}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {typeof anomaly.count === 'number' ? `${anomaly.count.toLocaleString()} de ${typeof anomaly.total === 'number' ? anomaly.total.toLocaleString() : anomaly.total} registros` : `${anomaly.count} líneas ${anomaly.total}`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
