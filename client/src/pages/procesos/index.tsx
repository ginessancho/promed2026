import { useState, useEffect } from 'react';
import { ArrowLeft, Box, Package, Gavel, Wrench, Ship, ArrowRight, ChevronDown, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESOS CRÍTICOS - Análisis de Costos Operacionales
// Top 3 con métricas editables + Lista secundaria
// ═══════════════════════════════════════════════════════════════════════════════

type ConfidenceLevel = 'confirmed' | 'estimated' | 'unknown';
type DataSource = 'kawak' | 'bamboohr' | 'quicksight' | 'odoo' | 'apex' | 'redshift' | 'naf' | 'interview';
type MetricUnit = 'USD' | 'count' | 'hours' | 'percent' | 'days';

// Data source tag configuration
const DATA_SOURCE_CONFIG: Record<DataSource, { label: string; color: string }> = {
  kawak: { label: 'Kawak', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  bamboohr: { label: 'BambooHR', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  quicksight: { label: 'QuickSight', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  odoo: { label: 'Odoo', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  apex: { label: 'APEX', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  redshift: { label: 'Redshift', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  naf: { label: 'NAF', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  interview: { label: 'Entrevista', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
};

function DataSourceTag({ source }: { source: DataSource }) {
  const config = DATA_SOURCE_CONFIG[source];
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

// Metric definitions per process
interface MetricDefinition {
  key: string;
  label: string;
  unit: MetricUnit;
  sources: DataSource[];
  description: string;
}

interface ProcesoConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  href: string;
  priority: number;
  metrics: MetricDefinition[];
  keyQuestions: string[];
}

// Top 3 procesos prioritarios con métricas predefinidas
const top3Procesos: ProcesoConfig[] = [
  {
    id: 'comodatos',
    title: 'Comodatos',
    subtitle: 'Equipos en préstamo a clientes',
    icon: Box,
    description: 'Equipos médicos entregados en comodato a hospitales y clínicas. Trazabilidad de contratos, facturación de fees mensuales y consumibles asociados.',
    href: '/procesos/comodatos',
    priority: 1,
    metrics: [
      { key: 'contracts_active', label: 'Contratos activos', unit: 'count', sources: ['naf', 'kawak'], description: 'Número de contratos de comodato vigentes' },
      { key: 'contracts_unbilled', label: 'Contratos sin facturar', unit: 'count', sources: ['quicksight', 'interview'], description: 'Equipos en uso sin fee mensual facturado' },
      { key: 'monthly_fee_avg', label: 'Fee mensual promedio', unit: 'USD', sources: ['quicksight', 'naf'], description: 'Valor promedio de fee por equipo' },
      { key: 'unbilled_annual', label: 'Pérdida anual estimada', unit: 'USD', sources: ['quicksight'], description: 'contracts_unbilled × monthly_fee_avg × 12' },
    ],
    keyQuestions: [
      '¿Cuántos contratos de comodato activos existen hoy?',
      '¿Cuál es el fee mensual promedio por equipo?',
      '¿Qué porcentaje de comodatos tienen facturación al día?',
    ],
  },
  {
    id: 'consignacion',
    title: 'Consignación',
    subtitle: 'Inventario en sitio del cliente',
    icon: Package,
    description: 'Inventario de consumibles ubicado físicamente en hospitales para uso inmediato. Control de uso, reposición y facturación cuando se consume.',
    href: '/procesos/consignacion',
    priority: 2,
    metrics: [
      { key: 'inventory_total', label: 'Valor inventario consignado', unit: 'USD', sources: ['naf', 'redshift'], description: 'Valor total de inventario en sitios de clientes' },
      { key: 'unreported_pct', label: 'Consumo no reportado', unit: 'percent', sources: ['interview', 'quicksight'], description: '% de consumos que no se facturan' },
      { key: 'reconciliation_freq', label: 'Frecuencia reconciliación', unit: 'days', sources: ['kawak', 'interview'], description: 'Días entre reconciliaciones físicas' },
      { key: 'unbilled_annual', label: 'Pérdida anual estimada', unit: 'USD', sources: ['quicksight'], description: 'inventory_total × unreported_pct × rotación' },
    ],
    keyQuestions: [
      '¿Cuál es el valor total de inventario en consignación?',
      '¿Con qué frecuencia se reconcilia el inventario físico?',
      '¿Qué porcentaje de consumos se reporta y factura?',
    ],
  },
  {
    id: 'admin',
    title: 'Administración Operacional',
    subtitle: 'Multas, SLAs y pagos bloqueantes',
    icon: Gavel,
    description: 'Costos por multas contractuales (SLAs incumplidos), pagos a proveedores que bloquean mercancía, y fechas críticas sin visibilidad centralizada.',
    href: '/procesos/administracion',
    priority: 3,
    metrics: [
      { key: 'sla_penalties', label: 'Multas SLA anuales', unit: 'USD', sources: ['quicksight', 'naf'], description: 'Total pagado en multas por incumplimiento' },
      { key: 'blocked_shipments', label: 'Embarques bloqueados/año', unit: 'count', sources: ['odoo', 'interview'], description: 'Veces que proveedor retuvo mercancía' },
      { key: 'blocked_value_avg', label: 'Valor promedio bloqueado', unit: 'USD', sources: ['naf', 'quicksight'], description: 'Valor promedio de cada bloqueo' },
      { key: 'opportunity_cost', label: 'Costo de oportunidad anual', unit: 'USD', sources: ['interview'], description: 'Ventas perdidas por retrasos' },
    ],
    keyQuestions: [
      '¿Cuánto se paga anualmente en multas por SLA?',
      '¿Con qué frecuencia un proveedor retiene mercancía?',
      '¿Existe visibilidad de pagos urgentes vs impacto?',
    ],
  },
];

// Procesos secundarios (Top 4-10)
const secundaryProcesos: ProcesoConfig[] = [
  {
    id: 'servicio-tecnico',
    title: 'Servicio Técnico',
    subtitle: 'OT, repuestos, garantías',
    icon: Wrench,
    description: 'Órdenes de trabajo, técnicos en campo, repuestos consumidos, cumplimiento de garantías.',
    href: '/procesos/servicio-tecnico',
    priority: 4,
    metrics: [
      { key: 'ot_without_invoice', label: 'OT sin factura', unit: 'count', sources: ['apex', 'interview'], description: 'OT completadas sin factura emitida' },
      { key: 'parts_unbilled', label: 'Repuestos no facturados', unit: 'USD', sources: ['naf', 'quicksight'], description: 'Valor de repuestos usados sin cobrar' },
    ],
    keyQuestions: [
      '¿Cuántas OT terminan sin factura completa?',
      '¿Cuál es el valor promedio de repuestos no facturados?',
    ],
  },
  {
    id: 'importaciones',
    title: 'Importaciones + Costeo',
    subtitle: 'Landed cost, recepciones',
    icon: Ship,
    description: 'Cálculo de landed cost, recepciones parciales, documentos de aduana, márgenes correctos.',
    href: '/procesos/importaciones',
    priority: 5,
    metrics: [
      { key: 'costing_errors', label: 'Errores de costeo/año', unit: 'count', sources: ['quicksight', 'interview'], description: 'Número de errores de landed cost' },
      { key: 'margin_impact', label: 'Impacto en margen', unit: 'USD', sources: ['quicksight'], description: 'Diferencia por errores de costeo' },
    ],
    keyQuestions: [
      '¿Con qué frecuencia hay errores de costeo?',
      '¿Cuál es el lag entre recepción física y sistema?',
    ],
  },
];

const confidenceLevelLabels: Record<ConfidenceLevel, string> = {
  confirmed: 'Confirmado',
  estimated: 'Estimado',
  unknown: 'Sin datos',
};

interface DataPointState {
  value: number | null;
  source: DataSource | null;
  sourceDetail: string;
  confidenceLevel: ConfidenceLevel;
}

function MetricRow({ 
  processId, 
  metric,
  dataPoint,
  onSave,
  isSaving,
}: { 
  processId: string;
  metric: MetricDefinition;
  dataPoint?: DataPointState;
  onSave: (data: DataPointState) => void;
  isSaving: boolean;
}) {
  const [localState, setLocalState] = useState<DataPointState>({
    value: dataPoint?.value ?? null,
    source: dataPoint?.source ?? null,
    sourceDetail: dataPoint?.sourceDetail ?? '',
    confidenceLevel: dataPoint?.confidenceLevel ?? 'unknown',
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (dataPoint) {
      setLocalState({
        value: dataPoint.value,
        source: dataPoint.source,
        sourceDetail: dataPoint.sourceDetail,
        confidenceLevel: dataPoint.confidenceLevel,
      });
      setHasChanges(false);
    }
  }, [dataPoint]);

  const updateField = <K extends keyof DataPointState>(field: K, value: DataPointState[K]) => {
    setLocalState(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const formatValue = (value: number | null, unit: MetricUnit) => {
    if (value === null) return '—';
    if (unit === 'USD') return `$${value.toLocaleString('en-US')}`;
    if (unit === 'percent') return `${value}%`;
    if (unit === 'days') return `${value} días`;
    return value.toLocaleString('en-US');
  };

  const parseInput = (value: string): number | null => {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    if (!cleaned) return null;
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-border/50 last:border-0">
      {/* Label + Sources */}
      <div className="col-span-4 space-y-1">
        <p className="text-sm font-medium text-foreground">{metric.label}</p>
        <div className="flex flex-wrap gap-1">
          {metric.sources.map(s => <DataSourceTag key={s} source={s} />)}
        </div>
      </div>
      
      {/* Value Input */}
      <div className="col-span-2">
        <Input
          type="text"
          placeholder="—"
          className="h-8 text-sm"
          value={localState.value !== null ? localState.value.toString() : ''}
          onChange={(e) => updateField('value', parseInput(e.target.value))}
        />
      </div>

      {/* Unit Display */}
      <div className="col-span-1 text-xs text-muted-foreground">
        {metric.unit}
      </div>

      {/* Source Select */}
      <div className="col-span-2">
        <Select 
          value={localState.source || ''} 
          onValueChange={(v) => updateField('source', v as DataSource)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Fuente" />
          </SelectTrigger>
          <SelectContent>
            {metric.sources.map(s => (
              <SelectItem key={s} value={s}>{DATA_SOURCE_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Confidence + Save */}
      <div className="col-span-3 flex items-center gap-1">
        <Select 
          value={localState.confidenceLevel} 
          onValueChange={(v) => updateField('confidenceLevel', v as ConfidenceLevel)}
        >
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">✓ Confirmado</SelectItem>
            <SelectItem value="estimated">~ Estimado</SelectItem>
            <SelectItem value="unknown">? Sin datos</SelectItem>
          </SelectContent>
        </Select>
        {hasChanges && (
          <Button 
            size="sm" 
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => { onSave(localState); setHasChanges(false); }}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          </Button>
        )}
      </div>
    </div>
  );
}

function ProcessCard({ proceso, isTop3 }: { proceso: ProcesoConfig; isTop3: boolean }) {
  const Icon = proceso.icon;
  const utils = trpc.useUtils();
  
  const { data: estimates } = trpc.processEstimates.list.useQuery();
  const { data: dataPoints } = trpc.processDataPoints.list.useQuery({ processId: proceso.id });
  
  const updateEstimateMutation = trpc.processEstimates.update.useMutation({
    onSuccess: () => utils.processEstimates.list.invalidate(),
  });
  const updateDataPointMutation = trpc.processDataPoints.update.useMutation({
    onSuccess: () => utils.processDataPoints.list.invalidate(),
  });

  const existingEstimate = estimates?.find(e => e.id === proceso.id);

  const [assumptions, setAssumptions] = useState('');
  const [assumptionsChanged, setAssumptionsChanged] = useState(false);

  useEffect(() => {
    if (existingEstimate?.assumptions) {
      setAssumptions(existingEstimate.assumptions);
    }
  }, [existingEstimate?.assumptions]);

  const handleSaveAssumptions = () => {
    updateEstimateMutation.mutate({
      id: proceso.id,
      assumptions,
    });
    setAssumptionsChanged(false);
  };

  const handleSaveDataPoint = (metricKey: string, unit: MetricUnit, data: DataPointState) => {
    updateDataPointMutation.mutate({
      id: `${proceso.id}:${metricKey}`,
      processId: proceso.id,
      metricKey,
      value: data.value,
      unit,
      source: data.source,
      sourceDetail: data.sourceDetail,
      confidenceLevel: data.confidenceLevel,
    });
  };

  const getDataPointState = (metricKey: string): DataPointState | undefined => {
    const dp = dataPoints?.find(d => d.metricKey === metricKey);
    if (!dp) return undefined;
    return {
      value: dp.value,
      source: dp.source as DataSource | null,
      sourceDetail: dp.sourceDetail || '',
      confidenceLevel: dp.confidenceLevel as ConfidenceLevel,
    };
  };

  // Calculate total from last metric (usually the "annual loss" metric)
  const lastMetric = proceso.metrics[proceso.metrics.length - 1];
  const totalDataPoint = dataPoints?.find(d => d.metricKey === lastMetric.key);
  const totalValue = totalDataPoint?.value;
  const totalConfidence = totalDataPoint?.confidenceLevel as ConfidenceLevel | undefined;

  return (
    <Card className="bg-card border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-muted">
              <Icon className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl">{proceso.title}</CardTitle>
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-bold">
                  #{proceso.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{proceso.subtitle}</p>
            </div>
          </div>
          {totalValue !== null && totalValue !== undefined && (
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">
                ${totalValue.toLocaleString('en-US')}
              </p>
              <p className="text-xs text-muted-foreground">
                USD/año • {totalConfidence ? confidenceLevelLabels[totalConfidence] : 'Sin datos'}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {proceso.description}
        </p>

        {isTop3 && (
          <>
            {/* Metrics Table */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground mb-2 pb-2 border-b">
                <div className="col-span-4">Métrica</div>
                <div className="col-span-2">Valor</div>
                <div className="col-span-1">Unidad</div>
                <div className="col-span-2">Fuente</div>
                <div className="col-span-3">Confianza</div>
              </div>
              {proceso.metrics.map((metric) => (
                <MetricRow
                  key={metric.key}
                  processId={proceso.id}
                  metric={metric}
                  dataPoint={getDataPointState(metric.key)}
                  onSave={(data) => handleSaveDataPoint(metric.key, metric.unit, data)}
                  isSaving={updateDataPointMutation.isPending}
                />
              ))}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Notas de investigación
              </label>
              <Textarea
                placeholder="Ej: Dato de QuickSight dashboard Finanzas. Confirmado con Gerente de Operaciones, 15/01/2025..."
                className="min-h-[60px] text-sm"
                value={assumptions}
                onChange={(e) => { setAssumptions(e.target.value); setAssumptionsChanged(true); }}
              />
              {assumptionsChanged && (
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleSaveAssumptions}
                    disabled={updateEstimateMutation.isPending}
                    className="gap-1"
                  >
                    {updateEstimateMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    Guardar notas
                  </Button>
                </div>
              )}
            </div>

            {/* Key Questions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Preguntas para validar</p>
              <ul className="space-y-1">
                {proceso.keyQuestions.map((question, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* CTA */}
        <div className="flex items-center justify-end pt-3 border-t">
          <Link href={proceso.href}>
            <Button variant="secondary" size="sm" className="gap-1">
              Ver detalle
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function SecondaryProcessRow({ proceso }: { proceso: ProcesoConfig }) {
  const Icon = proceso.icon;
  const { data: dataPoints } = trpc.processDataPoints.list.useQuery({ processId: proceso.id });
  
  // Get the last metric value (usually annual loss)
  const lastMetric = proceso.metrics[proceso.metrics.length - 1];
  const totalDataPoint = dataPoints?.find(d => d.metricKey === lastMetric.key);

  const formatUSD = (value: number | null | undefined) => {
    if (!value) return 'Sin datos';
    return `$${value.toLocaleString('en-US')} USD/año`;
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">{proceso.title}</p>
            <span className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
              #{proceso.priority}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{proceso.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {formatUSD(totalDataPoint?.value)}
          </p>
          {totalDataPoint?.confidenceLevel && totalDataPoint.confidenceLevel !== 'unknown' && (
            <p className="text-xs text-muted-foreground">
              {confidenceLevelLabels[totalDataPoint.confidenceLevel as ConfidenceLevel]}
            </p>
          )}
        </div>
        <Link href={proceso.href}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Data tools configuration for methodology section
const DATA_TOOLS = [
  { id: 'kawak', label: 'Kawak', description: '600+ procedimientos formalizados', color: 'bg-blue-100 text-blue-700' },
  { id: 'bamboohr', label: 'BambooHR', description: 'Headcount, salarios, org chart', color: 'bg-green-100 text-green-700' },
  { id: 'quicksight', label: 'QuickSight', description: 'Dashboards financieros', color: 'bg-purple-100 text-purple-700' },
  { id: 'odoo', label: 'Odoo', description: 'CRM, operaciones actuales', color: 'bg-orange-100 text-orange-700' },
  { id: 'apex', label: 'APEX', description: 'Transacciones del sistema actual', color: 'bg-gray-100 text-gray-700' },
  { id: 'redshift', label: 'AWS Redshift', description: 'Data warehouse centralizado', color: 'bg-red-100 text-red-700' },
  { id: 'naf', label: 'NAF 6.0', description: 'ERP legacy (inventario, finanzas)', color: 'bg-amber-100 text-amber-700' },
  { id: 'interview', label: 'Entrevistas', description: 'Validación con responsables de área', color: 'bg-yellow-100 text-yellow-700' },
];

export default function ProcesosIndex() {
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());
  
  const { data: dataPoints } = trpc.processDataPoints.list.useQuery({});
  
  // Calculate total for Top 3 from their last metrics
  const top3Total = top3Procesos.reduce((sum, p) => {
    const lastMetric = p.metrics[p.metrics.length - 1];
    const dp = dataPoints?.find(d => d.processId === p.id && d.metricKey === lastMetric.key);
    return sum + (dp?.value || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Portal Principal
              </Button>
            </Link>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Procesos Críticos</p>
              <p className="text-xs text-muted-foreground">Actualizado {formattedDate}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-10">
        {/* Hero */}
        <section className="space-y-4 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Análisis de Costos Operacionales
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            Procesos Críticos a Investigar
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Procesos que funcionan pero presentan fricciones con posible impacto financiero. 
            El objetivo es cuantificar cada métrica usando datos de las herramientas disponibles 
            y validar con entrevistas donde sea necesario.
          </p>
        </section>

        {/* Top 3 Summary */}
        {top3Total > 0 && (
          <Card className="bg-card border-2">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Impacto anual estimado (Top 3)</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${top3Total.toLocaleString('en-US')} USD
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Basado en datos recopilados</p>
                  <p>Actualizado {formattedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top 3 Process Cards */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Top 3 Prioridades</h2>
          {top3Procesos.map((proceso) => (
            <ProcessCard key={proceso.id} proceso={proceso} isTop3={true} />
          ))}
        </section>

        {/* Secondary Processes */}
        <Collapsible open={secondaryOpen} onOpenChange={setSecondaryOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between gap-2">
              <span>Procesos Secundarios (#{secundaryProcesos[0]?.priority} - #{secundaryProcesos[secundaryProcesos.length - 1]?.priority})</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${secondaryOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-3">
            {secundaryProcesos.map((proceso) => (
              <SecondaryProcessRow key={proceso.id} proceso={proceso} />
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Data Sources / Tools */}
        <Card className="bg-card border">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-foreground mb-4">Fuentes de Datos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cada métrica debe validarse con al menos una fuente. Las herramientas disponibles:
            </p>
            <div className="grid gap-3 md:grid-cols-4">
              {DATA_TOOLS.map((tool) => (
                <div key={tool.id} className="flex items-start gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${tool.color} shrink-0`}>
                    {tool.label}
                  </span>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Methodology */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-foreground mb-2">Metodología de Cuantificación</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Para cada proceso, las métricas deben capturar:
            </p>
            <div className="grid gap-4 md:grid-cols-4 text-sm">
              {[
                { label: 'Re-trabajo manual', detail: 'Horas/semana × costo hora × 52', sources: ['bamboohr', 'interview'] },
                { label: 'Ingresos no capturados', detail: 'Unidades × precio × frecuencia', sources: ['quicksight', 'naf'] },
                { label: 'Penalidades evitables', detail: 'Multas + intereses + costos', sources: ['quicksight', 'odoo'] },
                { label: 'Inventario no controlado', detail: 'Valor × % pérdida × rotación', sources: ['naf', 'redshift'] },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <div className="flex gap-1 flex-wrap">
                    {item.sources.map(s => (
                      <span key={s} className={`px-1.5 py-0.5 rounded text-xs ${DATA_SOURCE_CONFIG[s as DataSource].color}`}>
                        {DATA_SOURCE_CONFIG[s as DataSource].label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-6 border-t">
          <p>
            Los valores se actualizan conforme se recopilan datos de cada fuente.
            Los datos confirmados reemplazan estimaciones iniciales.
          </p>
        </div>
      </main>
    </div>
  );
}
