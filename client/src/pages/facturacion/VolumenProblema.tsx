import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AnomaliesChart from '@/components/AnomaliesChart';
import dmsScreenshot from '@/assets/promed-analisis.png';

type SampleTable = {
  caption: string;
  columns: { key: string; label: string }[];
  rows: Array<Record<string, string>>;
};

type CriticalFinding = {
  id: string;
  title: string;
  severity: 'alto' | 'medio' | 'bajo';
  metric: { label: string; value: string; percentage?: string };
  observation: string;
  validationNeed: string;
  impact: string[];
  query: string;
  samples?: SampleTable;
};

type ValidationHighlight = {
  id: string;
  title: string;
  outcome: string;
  description: string;
  query: string;
};

export default function VolumenProblema() {
  const TOTAL_REGISTROS = 739_251;
  const TOTAL_ARTICULOS_AUDITADOS = 6_249;
  const DISPERSION_ARTICULOS_AFECTADOS = 898;
  const COMODATO_NUMERO_SIN_INDICADOR = 17;
  const COMODATO_INDICADOR_SIN_NUMERO = 53;
  const FACTURAS_MULTIPLES_FISICOS = 430;

  const formatPercentage = (count: number, total: number, decimals = 3) => {
    if (!total) return '0%';
    return `${((count / total) * 100).toFixed(decimals)}%`;
  };

  const severityConfig: Record<
    'alto' | 'medio' | 'bajo',
    { label: string; variant: 'destructive' | 'default' | 'secondary' }
  > = {
    alto: { label: 'Severidad Alta', variant: 'destructive' },
    medio: { label: 'Severidad Media', variant: 'default' },
    bajo: { label: 'Severidad Baja', variant: 'secondary' },
  };

  const criticalFindings: CriticalFinding[] = [
    {
      id: 'brand-drift',
      title: 'Dispersión de Marcas por Artículo',
      severity: 'alto',
      metric: {
        label: 'Artículos afectados',
        value: `${DISPERSION_ARTICULOS_AFECTADOS.toLocaleString()} de ${TOTAL_ARTICULOS_AUDITADOS.toLocaleString()}`,
        percentage: `${formatPercentage(
          DISPERSION_ARTICULOS_AFECTADOS,
          TOTAL_ARTICULOS_AUDITADOS,
          1,
        )} del catálogo auditado`,
      },
      observation:
        'Se detectó una dispersión importante en la asignación de marcas: 898 artículos (14.4%) están asociados a más de una marca distinta.',
      validationNeed:
        'Confirmar si un mismo no_arti puede tener múltiples marcas o si debemos estandarizar la captura antes de consolidar reportes.',
      impact: [
        'Los artículos genéricos como "VENTAS-I" (79 marcas) y "VENTAS" (61 marcas) distorsionan los tableros comerciales.',
        'La dispersión dificulta la negociación con proveedores y provoca reprocesos en forecasting y pricing.',
      ],
      query: `SELECT
  no_arti,
  COUNT(DISTINCT marca) AS total_marcas_distintas,
  ARRAY_AGG(DISTINCT marca) AS marca,
  ARRAY_AGG(DISTINCT bodega) AS bodegas,
  ARRAY_AGG(no_comodato) AS nb_comodatos
FROM promed.facturacion_detallada
GROUP BY no_arti
ORDER BY COUNT(DISTINCT marca) DESC;`,
      samples: {
        caption: 'Muestra de artículos con mayor dispersión',
        columns: [
          { key: 'article', label: 'Artículo' },
          { key: 'brands', label: 'Marcas distintas' },
        ],
        rows: [
          { article: 'VENTAS-I', brands: '79' },
          { article: 'VENTAS', brands: '61' },
          { article: 'VCM015', brands: '6' },
          { article: 'VCM039', brands: '6' },
          { article: 'SLA-MO11', brands: '6' },
        ],
      } satisfies SampleTable,
    },
    {
      id: 'comodato-number-without-flag',
      title: 'Número de comodato sin indicador activo',
      severity: 'alto',
      metric: {
        label: 'Líneas de factura',
        value: COMODATO_NUMERO_SIN_INDICADOR.toLocaleString(),
        percentage: `${formatPercentage(
          COMODATO_NUMERO_SIN_INDICADOR,
          TOTAL_REGISTROS,
        )} del universo`,
      },
      observation:
        '17 líneas registran un número de comodato (no_comodato) pero tienen el indicador ind_comodato vacío.',
      validationNeed:
        'Validar si existe alguna excepción funcional que permita capturar el número sin marcar el indicador. De lo contrario debe corregirse la lógica de captura.',
      impact: [
        'Sin indicador activo el activo no se monitorea en auditorías físicas.',
        'Riesgo de fuga de activos médicos o de duplicidad en campo.',
      ],
      query: `SELECT
  no_factu,
  tipo_doc,
  marca,
  ind_comodato,
  no_comodato
FROM promed.facturacion_detallada
WHERE no_comodato IS NOT NULL
  AND TRIM(no_comodato) <> ''
  AND TRIM(ind_comodato) = '';`,
      samples: {
        caption: 'Ejemplos de comodatos con número sin indicador',
        columns: [
          { key: 'invoice', label: 'Factura' },
          { key: 'type', label: 'Tipo' },
          { key: 'brand', label: 'Marca' },
          { key: 'comodato', label: 'No. Comodato' },
        ],
        rows: [
          { invoice: '6582906', type: 'FC', brand: '1144', comodato: 'SYS04' },
          { invoice: '6576706', type: 'FC', brand: '57', comodato: 'SYS02' },
          { invoice: '6574206', type: 'DF', brand: '57', comodato: 'CO-27' },
          { invoice: '48754906', type: 'FA', brand: '13', comodato: 'QE-51' },
          { invoice: '48713806', type: 'FA', brand: '455', comodato: 'GA-66' },
        ],
      } satisfies SampleTable,
    },
    {
      id: 'comodato-flag-without-number',
      title: 'Indicador de comodato sin número asociado',
      severity: 'alto',
      metric: {
        label: 'Líneas de factura',
        value: COMODATO_INDICADOR_SIN_NUMERO.toLocaleString(),
        percentage: `${formatPercentage(
          COMODATO_INDICADOR_SIN_NUMERO,
          TOTAL_REGISTROS,
        )} del universo`,
      },
      observation:
        '53 líneas están marcadas como comodato (ind_comodato = "S") pero el número del activo está vacío.',
      validationNeed:
        'Confirmar con negocio si se puede imprimir una factura como comodato sin capturar el identificador del activo. Si no, debemos bloquear la operación.',
      impact: [
        'Imposible rastrear el activo entregado al cliente: la trazabilidad se rompe desde origen.',
        'Auditoría pierde pista del activo y no puede conciliar inventario contra campo.',
      ],
      query: `SELECT
  no_factu,
  tipo_doc,
  marca,
  ind_comodato,
  no_comodato
FROM promed.facturacion_detallada
WHERE ind_comodato = 'S'
  AND TRIM(ind_comodato) <> ''
  AND TRIM(no_comodato) = '';`,
      samples: {
        caption: 'Muestra de indicadores sin número de comodato',
        columns: [
          { key: 'invoice', label: 'Factura' },
          { key: 'type', label: 'Tipo' },
          { key: 'brand', label: 'Marca' },
          { key: 'flag', label: 'Indicador' },
        ],
        rows: [
          { invoice: '6581906', type: 'FA', brand: '228', flag: 'S' },
          { invoice: '48796606', type: 'FA', brand: '13', flag: 'S' },
          { invoice: '48784206', type: 'FA', brand: '16', flag: 'S' },
          { invoice: '4371606', type: 'FA', brand: '4', flag: 'S' },
          { invoice: '4344906', type: 'FC', brand: '73', flag: 'S' },
        ],
      } satisfies SampleTable,
    },
    {
      id: 'multiple-physical-invoices',
      title: 'Múltiples números físicos por factura lógica',
      severity: 'medio',
      metric: {
        label: 'Facturas impactadas',
        value: FACTURAS_MULTIPLES_FISICOS.toLocaleString(),
        percentage: `${formatPercentage(
          FACTURAS_MULTIPLES_FISICOS,
          TOTAL_REGISTROS,
        )} del universo`,
      },
      observation:
        '430 facturas lógicas (`no_factu`) están asociadas a más de un comprobante físico (`no_fisico`).',
      validationNeed:
        'Necesitamos confirmar con facturación si se permite esta relación 1:N o si se trata de reprocesos manuales que debemos consolidar.',
      impact: [
        'El equipo tarda horas conciliando comprobantes físicos contra el folio lógico.',
        'Los auditores externos cuestionan la trazabilidad al encontrar duplicidades en papel.',
      ],
      query: `WITH temp0 AS (
  SELECT
    no_factu,
    COUNT(DISTINCT no_fisico) AS total_n_fisico
  FROM promed.facturacion_detallada
  GROUP BY no_factu
)
SELECT COUNT(*)
FROM temp0
WHERE total_n_fisico > 1;`,
    },
    {
      id: 'margin-misalignment',
      title: 'Ganancia impresa no coincide con la fórmula',
      severity: 'alto',
      metric: {
        label: 'Líneas impresas revisadas',
        value: '100% del subconjunto impreso',
        percentage: 'Todas las líneas impresas presentan discrepancias',
      },
      observation:
        'El cálculo de ganancia `(unidades * precio) - coste - impuesto` es consistente en líneas no impresas, pero cambia al momento de la impresión.',
      validationNeed:
        'Revisar la lógica aplicada en el flujo de impresión: ¿se está usando otra fórmula o se sobreescribe el campo ganancia?',
      impact: [
        'Los reportes financieros impresos pierden confiabilidad y deben recalcularse manualmente.',
        'Control interno no puede certificar márgenes ante auditoría externa.',
      ],
      query: `SELECT
  no_factu,
  no_linea,
  ganancia AS ganancia_registrada,
  ((unidades * precio) - coste - impuesto) AS ganancia_recalculada
FROM promed.facturacion_detallada
WHERE impresa = true
  AND ganancia IS DISTINCT FROM ((unidades * precio) - coste - impuesto);`,
    },
  ];

  const validationHighlights: ValidationHighlight[] = [
    {
      id: 'negative-returns',
      title: 'Devoluciones negativas coherentes',
      outcome: 'Validado',
      description:
        'Todas las líneas con cantidad negativa (devoluciones) se emitieron con tipo_doc = DF.',
      query: `SELECT
  tipo_doc,
  COUNT(*) AS total
FROM promed.facturacion_detallada
WHERE cantidad LIKE '-%'
GROUP BY tipo_doc;`,
    },
  ] as const;

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
                <div className="bg-background">
                  <div className="mx-auto max-w-5xl px-4 py-6">
                    <img
                      src={dmsScreenshot}
                      alt="Dashboard volumétrico en dms.alteridad.org con métricas prioritarias"
                      className="w-full h-auto rounded-xl shadow-2xl border border-black/10 object-contain"
                      loading="lazy"
                    />
                  </div>
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
                  <strong>Herramienta:</strong> DMS Alteridad
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

        {/* Hallazgos críticos */}
        <section className="mb-16">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <h3 className="text-3xl font-bold text-foreground">Hallazgos críticos con evidencia</h3>
            <Badge variant="outline">SQL + muestras reales</Badge>
          </div>

          <div className="space-y-8">
            {criticalFindings.map((finding) => {
              const severity = severityConfig[finding.severity];

              return (
                <Card key={finding.id} className="border border-border/60 shadow-lg">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{finding.metric.label}</p>
                        <CardTitle className="text-2xl">{finding.title}</CardTitle>
                      </div>
                      <Badge variant={severity.variant}>{severity.label}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>
                        <strong>{finding.metric.value}</strong>
                      </span>
                      {finding.metric.percentage && <span>{finding.metric.percentage}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                          Observación
                        </p>
                        <p className="text-sm text-foreground">{finding.observation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                          Validación requerida
                        </p>
                        <p className="text-sm text-foreground">{finding.validationNeed}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-2">
                        Impacto inmediato
                      </p>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        {finding.impact.map((impact) => (
                          <li key={impact}>{impact}</li>
                        ))}
                      </ul>
                    </div>

                    <Accordion type="single" collapsible>
                      <AccordionItem value={`query-${finding.id}`}>
                        <AccordionTrigger className="text-sm font-semibold">
                          Ver SQL y evidencia
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="rounded-lg bg-muted p-4 text-xs font-mono whitespace-pre-wrap">
                            {finding.query}
                          </div>

                          {finding.samples && (
                            <div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    {finding.samples.columns.map((column) => (
                                      <TableHead key={`${finding.id}-${column.key}`}>
                                        {column.label}
                                      </TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {finding.samples.rows.map((row, rowIndex) => (
                                    <TableRow key={`${finding.id}-row-${rowIndex}`}>
                                      {finding.samples.columns.map((column) => (
                                        <TableCell
                                          key={`${finding.id}-${column.key}-${rowIndex}`}
                                        >
                                          {row[column.key]}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <TableCaption>{finding.samples.caption}</TableCaption>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Validaciones consistentes */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Validaciones consistentes</h3>

          <div className="grid gap-6 md:grid-cols-2">
            {validationHighlights.map((highlight) => (
              <Card
                key={highlight.id}
                className="border-l-4 border-l-emerald-500 shadow-md bg-emerald-50/10"
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-xl">{highlight.title}</CardTitle>
                    <Badge variant="secondary">{highlight.outcome}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted p-4 text-xs font-mono whitespace-pre-wrap">
                    {highlight.query}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                <p className="text-sm text-muted-foreground mt-2">
                  Limpieza manual de catálogos y comodatos antes de publicar cifras confiables.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Carga Operativa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-destructive">Muy Alta</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Dos equipos concilian `no_factu` contra `no_fisico` y vuelven a capturar evidencia.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Riesgo de Auditoría</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-600">Alto</p>
                <p className="text-sm text-muted-foreground mt-2">
                  430 facturas con múltiples comprobantes + 70 comodatos inconsistentes generan hallazgos inmediatos.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Confiabilidad de Reportes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-600">Media</p>
                <p className="text-sm text-muted-foreground mt-2">
                  La ganancia impresa debe recalcularse línea por línea antes de compartirla con dirección.
                </p>
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
