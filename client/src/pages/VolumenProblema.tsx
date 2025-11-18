import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnomaliesChart from '@/components/AnomaliesChart';
import dmsPlaceholder from '@/assets/dms placeholder.png';

export default function VolumenProblema() {
  const TOTAL_REGISTROS = 739_251;
  const anomalias = [
    {
      tipo: 'Dispersión de Marcas',
      cantidad: 898,
      contexto: 'Equivale a 14.4% del catálogo específico de 6,249 artículos auditados.',
      impacto: 'Análisis por marca no fiable',
      indicador: 'SKU duplicados',
    },
    {
      tipo: 'Inconsistencias de Comodatos',
      cantidad: 70,
      contexto: 'Facturas con indicador de comodato sin activo o viceversa.',
      impacto: 'Pérdida de trazabilidad de activos',
      indicador: 'Activos médicos',
    },
    {
      tipo: 'Múltiples Números Físicos',
      cantidad: 430,
      contexto: 'Folio lógico conectado a más de un comprobante físico.',
      impacto: 'Confusión en auditoría',
      indicador: 'Números físicos por folio',
    },
    {
      tipo: 'Errores de Ganancia',
      cantidad: TOTAL_REGISTROS,
      contexto: 'Cada línea impresa presenta cálculos fuera de tolerancia.',
      impacto: 'Reportes financieros imprecisos',
      indicador: 'Cálculo de margen',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
            <div className="text-right">
              <h1 className="text-lg font-bold">Volumen del Problema</h1>
              <p className="text-sm text-muted-foreground">Análisis Cuantitativo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Intro */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground">Volumen del Problema</h2>
              <p className="text-lg text-muted-foreground">Cuantificación de anomalías en 739,251 registros</p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Utilizando la plataforma <strong>dms.alteridad.org</strong>, realizamos una auditoría exhaustiva de
              739,251 registros de facturación de Promed. El análisis reveló múltiples tipos de anomalías que afectan
              la calidad de los datos, la eficiencia operativa y la confiabilidad de los reportes financieros.
            </p>
          </div>
        </div>

        {/* Screenshot del DMS */}
        <section className="mb-16">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="text-2xl">Análisis en dms.alteridad.org</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <figure className="bg-muted/30 border-b">
                <div className="aspect-video overflow-hidden bg-background">
                  <img
                    src={dmsPlaceholder}
                    alt="Vista del dashboard de análisis en dms.alteridad.org"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="text-center px-6 py-4 text-sm text-muted-foreground">
                  Screenshot del dashboard de análisis de datos en <strong>dms.alteridad.org</strong>
                </figcaption>
              </figure>
              <div className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Dataset:</strong> 739,251 registros de facturación
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Período:</strong> Enero 2023 - Octubre 2025
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Herramienta:</strong> DMS Alteridad (PostgreSQL + pgvector + OpenAI)
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Gráfico de Anomalías */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Anomalías Detectadas</h3>
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Anomalías por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <AnomaliesChart />
            </CardContent>
          </Card>
        </section>

        {/* Tabla de Anomalías */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Detalle de Anomalías</h3>
          
          <div className="grid grid-cols-1 gap-6">
            {anomalias.map((anomalia, index) => {
              const porcentaje = ((anomalia.cantidad / TOTAL_REGISTROS) * 100).toFixed(2);
              return (
                <Card key={index} className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1.5">
                        <CardTitle className="text-2xl">{anomalia.tipo}</CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span><strong>Registros:</strong> {anomalia.cantidad.toLocaleString()}</span>
                          <span><strong>Porcentaje:</strong> {porcentaje}% del universo (739,251)</span>
                          <span><strong>Indicador:</strong> {anomalia.indicador}</span>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-destructive">{porcentaje}%</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-foreground">
                      <strong>Impacto:</strong> {anomalia.impacto}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {anomalia.contexto}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Caso Extremo */}
        <section className="mb-16">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                Caso Extremo: Artículo "VENTAS-I"
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                El artículo <strong>"VENTAS-I"</strong> presenta <strong className="text-destructive">79 marcas diferentes</strong> en
                el sistema, lo que hace imposible realizar análisis confiables por marca.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-background rounded-lg border">
                  <p className="text-3xl font-bold text-destructive">79</p>
                  <p className="text-sm text-muted-foreground">Marcas Diferentes</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border">
                  <p className="text-3xl font-bold text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Artículo</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border">
                  <p className="text-3xl font-bold text-orange-600">Alto</p>
                  <p className="text-sm text-muted-foreground">Impacto en Análisis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Impacto Cuantificado */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Impacto Cuantitativo en la Operación</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Horas Perdidas/Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-destructive">~120</p>
                <p className="text-sm text-muted-foreground mt-2">Entre reprocesos, validaciones y consultas manuales.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Carga Operativa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-destructive">Muy Alta</p>
                <p className="text-sm text-muted-foreground mt-2">Se requieren dos equipos para mantener datos sincronizados.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Riesgo de Auditoría</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-600">Alto</p>
                <p className="text-sm text-muted-foreground mt-2">Inconsistencias entre folios físicos y lógicos.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Confiabilidad de Reportes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-600">Media</p>
                <p className="text-sm text-muted-foreground mt-2">Las decisiones se basan en data que requiere validación manual.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t">
          <Link href="/hallazgos-2025">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior: Hallazgos 2025
            </Button>
          </Link>
          <Link href="/proceso-actual">
            <Button>
              Siguiente: Proceso Actual
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
