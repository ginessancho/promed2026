import { useMemo, useState } from 'react';
import { 
  ArrowLeft, Calculator, TrendingUp, TrendingDown, DollarSign, 
  Users, AlertCircle, BarChart3, Settings2, RefreshCw
} from 'lucide-react';
import { 
  Area, AreaChart, Bar, BarChart, CartesianGrid, 
  XAxis, YAxis, ReferenceLine 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartContainer, ChartTooltip, ChartTooltipContent, 
  ChartLegend, ChartLegendContent, type ChartConfig 
} from '@/components/ui/chart';
import { Link } from 'wouter';

// ═══════════════════════════════════════════════════════════════════════════════
// ESCENARIOS PREDEFINIDOS - Basados en ERPTransitions.md y RFP
// ═══════════════════════════════════════════════════════════════════════════════

type Scenario = 'conservative' | 'base' | 'optimistic';

const scenarioLabels: Record<Scenario, { label: string; description: string }> = {
  conservative: { 
    label: 'Conservador', 
    description: 'Costos altos, beneficios menores, contingencia incluida' 
  },
  base: { 
    label: 'Base', 
    description: 'Valores más probables según benchmarks de mercado' 
  },
  optimistic: { 
    label: 'Optimista', 
    description: 'Negociación favorable, adopción rápida' 
  },
};

// Valores del RFP y ERPTransitions.md
const scenarios: Record<Scenario, typeof defaultAssumptions> = {
  conservative: {
    // Licencias NetSuite (Kimberlite Partners, Oct 2025)
    netsuiteBaseMonthly: 2_800,
    netsuiteUserLicense: 129,
    netsuiteSelfServiceLicense: 49,
    fullUsers: 80,                    // Finanzas (62) + Importaciones parcial + Gerentes
    selfServiceUsers: 600,            // Transacciones (600) + Servicio Técnico parcial
    modulesMonthly: 3_200,            // OneWorld + Advanced Inventory + Fixed Assets + más
    
    // Implementación
    implementationCost: 450_000,      // Alto del rango
    implementationMonths: 18,
    trainingCost: 75_000,
    yearOneSupport: 80_000,           // Hypercare extendido
    ongoingSupportAnnual: 48_000,
    
    // Situación actual NAF
    nafMaintenanceAnnual: 35_000,
    nafStaffHours: 1_500,
    hourlyRate: 22,
    manualProcessHoursYear: 12_000,
    errorCorrectionHoursYear: 2_500,
    
    // Beneficios (conservadores)
    efficiencyGainPercent: 18,
    errorReductionPercent: 30,
    
    // Contingencia
    contingencyPercent: 20,
  },
  base: {
    netsuiteBaseMonthly: 2_500,
    netsuiteUserLicense: 129,
    netsuiteSelfServiceLicense: 49,
    fullUsers: 80,
    selfServiceUsers: 520,
    modulesMonthly: 2_500,
    
    implementationCost: 350_000,
    implementationMonths: 12,
    trainingCost: 55_000,
    yearOneSupport: 60_000,
    ongoingSupportAnnual: 36_000,
    
    nafMaintenanceAnnual: 45_000,
    nafStaffHours: 2_000,
    hourlyRate: 25,
    manualProcessHoursYear: 15_000,
    errorCorrectionHoursYear: 3_000,
    
    efficiencyGainPercent: 25,
    errorReductionPercent: 40,
    
    contingencyPercent: 10,
  },
  optimistic: {
    netsuiteBaseMonthly: 2_200,
    netsuiteUserLicense: 115,         // Negociación por volumen
    netsuiteSelfServiceLicense: 45,
    fullUsers: 70,                    // Más usuarios en self-service
    selfServiceUsers: 450,
    modulesMonthly: 2_000,
    
    implementationCost: 280_000,
    implementationMonths: 10,
    trainingCost: 45_000,
    yearOneSupport: 45_000,
    ongoingSupportAnnual: 30_000,
    
    nafMaintenanceAnnual: 55_000,     // Más costos ocultos identificados
    nafStaffHours: 2_500,
    hourlyRate: 28,
    manualProcessHoursYear: 18_000,
    errorCorrectionHoursYear: 4_000,
    
    efficiencyGainPercent: 30,
    errorReductionPercent: 50,
    
    contingencyPercent: 5,
  },
};

const defaultAssumptions = scenarios.base;
type Assumptions = typeof defaultAssumptions;

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE CONTROLES
// ═══════════════════════════════════════════════════════════════════════════════

const assumptionControls: Array<{
  key: keyof Assumptions;
  label: string;
  category: 'licencias' | 'usuarios' | 'implementacion' | 'actual' | 'beneficios';
  helper?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}> = [
  // Licencias
  { key: 'netsuiteBaseMonthly', label: 'NetSuite base', category: 'licencias', helper: 'Mid-Market Edition', min: 1000, max: 5000, step: 100 },
  { key: 'netsuiteUserLicense', label: 'Licencia full user', category: 'licencias', min: 80, max: 180, step: 5 },
  { key: 'netsuiteSelfServiceLicense', label: 'Licencia self-service', category: 'licencias', min: 30, max: 80, step: 5 },
  { key: 'modulesMonthly', label: 'Módulos adicionales', category: 'licencias', helper: 'OneWorld, Adv. Inventory', min: 1000, max: 6000, step: 100 },
  
  // Usuarios (basado en RFP: Finanzas 62, Transacciones 600, Importaciones 80, Regulatorio 7, Servicio Técnico 150)
  { key: 'fullUsers', label: 'Usuarios full access', category: 'usuarios', helper: 'Finanzas, gerentes, buyers', min: 50, max: 150, step: 5 },
  { key: 'selfServiceUsers', label: 'Usuarios self-service', category: 'usuarios', helper: 'Operativos, técnicos', min: 200, max: 800, step: 20 },
  
  // Implementación
  { key: 'implementationCost', label: 'Implementación', category: 'implementacion', min: 200000, max: 600000, step: 25000 },
  { key: 'trainingCost', label: 'Training + Change Mgmt', category: 'implementacion', min: 20000, max: 100000, step: 5000 },
  { key: 'yearOneSupport', label: 'Soporte año 1', category: 'implementacion', min: 30000, max: 120000, step: 5000 },
  { key: 'ongoingSupportAnnual', label: 'Soporte anual (año 2+)', category: 'implementacion', min: 20000, max: 80000, step: 2000 },
  { key: 'contingencyPercent', label: 'Contingencia', category: 'implementacion', suffix: '%', min: 0, max: 30, step: 5 },
  
  // Situación actual
  { key: 'nafMaintenanceAnnual', label: 'Mantenimiento NAF', category: 'actual', min: 20000, max: 80000, step: 5000 },
  { key: 'nafStaffHours', label: 'Horas IT dedicadas/año', category: 'actual', min: 500, max: 4000, step: 100 },
  { key: 'hourlyRate', label: 'Costo hora promedio', category: 'actual', min: 15, max: 50, step: 1 },
  { key: 'manualProcessHoursYear', label: 'Horas procesos manuales', category: 'actual', helper: 'Data entry, reconciliación', min: 5000, max: 30000, step: 1000 },
  { key: 'errorCorrectionHoursYear', label: 'Horas corrección errores', category: 'actual', min: 1000, max: 8000, step: 500 },
  
  // Beneficios
  { key: 'efficiencyGainPercent', label: 'Mejora eficiencia', category: 'beneficios', suffix: '%', min: 10, max: 40, step: 2 },
  { key: 'errorReductionPercent', label: 'Reducción errores', category: 'beneficios', suffix: '%', min: 20, max: 60, step: 5 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const formatMoneyK = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return formatMoney(value);
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ERPCostoBeneficio() {
  const [scenario, setScenario] = useState<Scenario>('base');
  const [assumptions, setAssumptions] = useState<Assumptions>({ ...defaultAssumptions });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Cambiar escenario
  const handleScenarioChange = (newScenario: Scenario) => {
    setScenario(newScenario);
    setAssumptions({ ...scenarios[newScenario] });
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // CÁLCULOS DERIVADOS
  // ═══════════════════════════════════════════════════════════════════════════════

  // Costos NetSuite mensuales
  const netsuiteMonthly = useMemo(() => {
    const base = assumptions.netsuiteBaseMonthly;
    const fullUsersCost = assumptions.fullUsers * assumptions.netsuiteUserLicense;
    const selfServiceCost = assumptions.selfServiceUsers * assumptions.netsuiteSelfServiceLicense;
    const modules = assumptions.modulesMonthly;
    return base + fullUsersCost + selfServiceCost + modules;
  }, [assumptions]);

  const netsuiteAnnual = netsuiteMonthly * 12;

  // Costo total año 1 (con contingencia)
  const yearOneCost = useMemo(() => {
    const baseCost = assumptions.implementationCost + 
                     netsuiteAnnual + 
                     assumptions.trainingCost + 
                     assumptions.yearOneSupport;
    const contingency = baseCost * (assumptions.contingencyPercent / 100);
    return baseCost + contingency;
  }, [assumptions, netsuiteAnnual]);

  // Costo anual ongoing (año 2+)
  const ongoingAnnualCost = useMemo(() => {
    return netsuiteAnnual + assumptions.ongoingSupportAnnual;
  }, [netsuiteAnnual, assumptions.ongoingSupportAnnual]);

  // Costos actuales (NAF + ineficiencias)
  const currentAnnualCost = useMemo(() => {
    const nafMaintenance = assumptions.nafMaintenanceAnnual;
    const itStaffCost = assumptions.nafStaffHours * assumptions.hourlyRate;
    const manualProcessCost = assumptions.manualProcessHoursYear * assumptions.hourlyRate;
    const errorCost = assumptions.errorCorrectionHoursYear * assumptions.hourlyRate;
    return nafMaintenance + itStaffCost + manualProcessCost + errorCost;
  }, [assumptions]);

  // Ahorros anuales esperados
  const annualSavings = useMemo(() => {
    const manualSavings = assumptions.manualProcessHoursYear * 
                          (assumptions.efficiencyGainPercent / 100) * 
                          assumptions.hourlyRate;
    const errorSavings = assumptions.errorCorrectionHoursYear * 
                         (assumptions.errorReductionPercent / 100) * 
                         assumptions.hourlyRate;
    const nafElimination = assumptions.nafMaintenanceAnnual;
    const itReduction = assumptions.nafStaffHours * 0.5 * assumptions.hourlyRate; // 50% IT liberado
    return manualSavings + errorSavings + nafElimination + itReduction;
  }, [assumptions]);

  // Proyección 5 años
  const fiveYearProjection = useMemo(() => {
    const years = [];
    let cumulativeNetSuite = 0;
    let cumulativeNAF = 0;
    let cumulativeSavings = 0;

    for (let year = 1; year <= 5; year++) {
      const netSuiteCost = year === 1 ? yearOneCost : ongoingAnnualCost;
      const nafCost = currentAnnualCost;
      const savings = year === 1 ? annualSavings * 0.5 : annualSavings; // Año 1: solo 6 meses de beneficio

      cumulativeNetSuite += netSuiteCost;
      cumulativeNAF += nafCost;
      cumulativeSavings += savings;

      const netBenefit = cumulativeSavings + cumulativeNAF - cumulativeNetSuite;

      years.push({
        year: `Año ${year}`,
        netSuiteCost,
        nafCost,
        savings,
        cumulativeNetSuite,
        cumulativeNAF,
        cumulativeSavings,
        netBenefit,
        cashFlow: savings - netSuiteCost + nafCost,
      });
    }
    return years;
  }, [yearOneCost, ongoingAnnualCost, currentAnnualCost, annualSavings]);

  // Métricas de ROI
  const roi = useMemo(() => {
    const totalInvestment = yearOneCost + (ongoingAnnualCost * 4);
    const totalSavings = annualSavings * 0.5 + annualSavings * 4; // Año 1 parcial
    const fiveYearROI = ((totalSavings - totalInvestment) / totalInvestment) * 100;
    
    // Payback calculation
    let cumCost = 0;
    let cumSavings = 0;
    let paybackMonths = 0;
    
    for (let month = 1; month <= 60; month++) {
      if (month <= 12) {
        cumCost += yearOneCost / 12;
        cumSavings += (annualSavings * 0.5) / 12; // 50% en año 1
      } else {
        cumCost += ongoingAnnualCost / 12;
        cumSavings += annualSavings / 12;
      }
      cumSavings += currentAnnualCost / 12; // Ahorro de costos NAF
      
      if (cumSavings >= cumCost && paybackMonths === 0) {
        paybackMonths = month;
      }
    }
    
    return {
      fiveYearROI,
      paybackMonths: paybackMonths || 60,
      totalInvestment,
      totalSavings: totalSavings + currentAnnualCost * 5,
      netBenefit: fiveYearProjection[4]?.netBenefit ?? 0,
    };
  }, [yearOneCost, ongoingAnnualCost, annualSavings, currentAnnualCost, fiveYearProjection]);

  // Datos para gráfico de flujo de caja
  const cashFlowChartData = useMemo(() => {
    return fiveYearProjection.map(year => ({
      year: year.year,
      'Costo NetSuite': -year.netSuiteCost,
      'Ahorro NAF': year.nafCost,
      'Eficiencias': year.savings,
      'Flujo Neto': year.cashFlow,
    }));
  }, [fiveYearProjection]);

  // Datos para gráfico acumulado
  const cumulativeChartData = useMemo(() => {
    return [
      { year: 'Inicio', netSuite: 0, sinCambio: 0 },
      ...fiveYearProjection.map(year => ({
        year: year.year,
        netSuite: -year.cumulativeNetSuite,
        sinCambio: -(year.cumulativeNAF - year.cumulativeSavings),
        beneficioNeto: year.netBenefit,
      })),
    ];
  }, [fiveYearProjection]);

  // Breakdown de licencias
  const licenseBreakdown = useMemo(() => [
    { concept: 'NetSuite Mid-Market base', monthly: assumptions.netsuiteBaseMonthly },
    { concept: `Full users (${assumptions.fullUsers} × $${assumptions.netsuiteUserLicense})`, monthly: assumptions.fullUsers * assumptions.netsuiteUserLicense },
    { concept: `Self-service (${assumptions.selfServiceUsers} × $${assumptions.netsuiteSelfServiceLicense})`, monthly: assumptions.selfServiceUsers * assumptions.netsuiteSelfServiceLicense },
    { concept: 'Módulos adicionales', monthly: assumptions.modulesMonthly },
  ], [assumptions]);

  const handleAssumptionChange = (key: keyof Assumptions, value: number) => {
    setAssumptions(prev => ({ ...prev, [key]: value }));
  };

  const resetToScenario = () => setAssumptions({ ...scenarios[scenario] });

  // Chart configs
  const cashFlowChartConfig: ChartConfig = {
    'Costo NetSuite': { label: 'Costo NetSuite', color: 'hsl(var(--chart-1))' },
    'Ahorro NAF': { label: 'Ahorro costos NAF', color: 'hsl(var(--chart-2))' },
    'Eficiencias': { label: 'Eficiencias operativas', color: 'hsl(var(--chart-3))' },
    'Flujo Neto': { label: 'Flujo neto', color: 'hsl(var(--chart-4))' },
  };

  const cumulativeChartConfig: ChartConfig = {
    netSuite: { label: 'Con NetSuite', color: 'hsl(142 71% 45%)' },
    sinCambio: { label: 'Sin cambio (NAF)', color: 'hsl(0 84% 60%)' },
    beneficioNeto: { label: 'Beneficio acumulado', color: 'hsl(217 91% 60%)' },
  };

  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/erp">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver a ERP
              </Button>
            </Link>
            <div className="text-right">
              <h1 className="text-lg font-bold">Análisis Costo-Beneficio</h1>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Intro */}
        <section className="space-y-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            NAF 6.0 → Oracle NetSuite
          </p>
          <h2 className="text-2xl font-bold">
            Calculadora de TCO y ROI para Migración ERP
          </h2>
          <p className="text-sm text-muted-foreground">
            Modelo interactivo basado en datos del RFP de PROMED (7 subsidiarias, 313K ítems, 600+ usuarios) 
            y benchmarks de mercado (Kimberlite Partners, Oct 2025). Selecciona un escenario o ajusta las variables.
          </p>
        </section>

        {/* Scenario Selector */}
        <Card>
          <CardContent className="pt-5">
            <Tabs value={scenario} onValueChange={(v) => handleScenarioChange(v as Scenario)}>
              <TabsList className="grid w-full grid-cols-3">
                {(Object.keys(scenarios) as Scenario[]).map((s) => (
                  <TabsTrigger key={s} value={s} className="text-xs sm:text-sm">
                    {scenarioLabels[s].label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {(Object.keys(scenarios) as Scenario[]).map((s) => (
                <TabsContent key={s} value={s} className="mt-3">
                  <p className="text-sm text-muted-foreground">{scenarioLabels[s].description}</p>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">INVERSIÓN AÑO 1</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{formatMoneyK(yearOneCost)}</p>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                Impl. + licencias + training
                {assumptions.contingencyPercent > 0 && ` (+${assumptions.contingencyPercent}% contingencia)`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900 border-sky-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-sky-600" />
                <span className="text-xs text-sky-600 font-medium">LICENCIAS/MES</span>
              </div>
              <p className="text-2xl font-bold text-sky-900 dark:text-sky-100">{formatMoneyK(netsuiteMonthly)}</p>
              <p className="text-xs text-sky-700 dark:text-sky-300 mt-1">{formatMoney(netsuiteAnnual)} anuales</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">AHORRO ANUAL</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{formatMoneyK(annualSavings)}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Eficiencias + reducción errores</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-violet-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-violet-600" />
                <span className="text-xs text-violet-600 font-medium">PAYBACK</span>
              </div>
              <p className="text-2xl font-bold text-violet-900 dark:text-violet-100">
                {roi.paybackMonths} meses
              </p>
              <p className="text-xs text-violet-700 dark:text-violet-300 mt-1">
                ROI 5 años: {roi.fiveYearROI > 0 ? '+' : ''}{roi.fiveYearROI.toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Cumulative Cash Flow Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Flujo de Caja Acumulado (5 años)
              </CardTitle>
              <CardDescription>Comparativa: Con NetSuite vs. mantener NAF</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={cumulativeChartConfig} className="h-[280px] w-full">
                <AreaChart data={cumulativeChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis 
                    tickFormatter={(v) => formatMoneyK(Math.abs(v))} 
                    tick={{ fontSize: 11 }} 
                    width={60}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} />} 
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  <Area 
                    type="monotone" 
                    dataKey="beneficioNeto" 
                    stroke="var(--color-beneficioNeto)" 
                    fill="var(--color-beneficioNeto)" 
                    fillOpacity={0.3}
                    name="Beneficio neto"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Annual Cash Flow */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Flujo de Caja Anual
              </CardTitle>
              <CardDescription>Costos y ahorros por año</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={cashFlowChartConfig} className="h-[280px] w-full">
                <BarChart data={cashFlowChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis 
                    tickFormatter={(v) => formatMoneyK(v)} 
                    tick={{ fontSize: 11 }} 
                    width={60}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} />} 
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                  <Bar dataKey="Costo NetSuite" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Ahorro NAF" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Eficiencias" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Year-by-Year Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proyección Detallada por Año</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Año</TableHead>
                  <TableHead className="text-right">Costo NetSuite</TableHead>
                  <TableHead className="text-right">Ahorro NAF</TableHead>
                  <TableHead className="text-right">Eficiencias</TableHead>
                  <TableHead className="text-right">Flujo Neto</TableHead>
                  <TableHead className="text-right">Beneficio Acum.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fiveYearProjection.map((year) => (
                  <TableRow key={year.year}>
                    <TableCell className="font-medium">{year.year}</TableCell>
                    <TableCell className="text-right text-red-600">{formatMoney(-year.netSuiteCost)}</TableCell>
                    <TableCell className="text-right text-emerald-600">{formatMoney(year.nafCost)}</TableCell>
                    <TableCell className="text-right text-blue-600">{formatMoney(year.savings)}</TableCell>
                    <TableCell className={`text-right font-medium ${year.cashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatMoney(year.cashFlow)}
                    </TableCell>
                    <TableCell className={`text-right font-bold ${year.netBenefit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {formatMoney(year.netBenefit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* License Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Desglose de Licencias Mensuales</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">USD/mes</TableHead>
                    <TableHead className="text-right">USD/año</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licenseBreakdown.map(item => (
                    <TableRow key={item.concept}>
                      <TableCell className="text-sm">{item.concept}</TableCell>
                      <TableCell className="text-right">{formatMoney(item.monthly)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatMoney(item.monthly * 12)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>Total licencias</TableCell>
                    <TableCell className="text-right text-primary">{formatMoney(netsuiteMonthly)}</TableCell>
                    <TableCell className="text-right text-primary">{formatMoney(netsuiteAnnual)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumen 5 Años</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">TCO NetSuite</p>
                  <p className="text-lg font-bold">{formatMoneyK(roi.totalInvestment)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Ahorros totales</p>
                  <p className="text-lg font-bold text-emerald-600">{formatMoneyK(roi.totalSavings)}</p>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                roi.netBenefit >= 0 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200' 
                  : 'bg-red-50 dark:bg-red-950/30 border-red-200'
              }`}>
                <p className={`text-xs font-medium mb-1 ${roi.netBenefit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  BENEFICIO NETO 5 AÑOS
                </p>
                <p className={`text-2xl font-bold ${roi.netBenefit >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                  {formatMoney(roi.netBenefit)}
                </p>
                <p className={`text-xs mt-1 ${roi.netBenefit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {roi.netBenefit >= 0 
                    ? 'Incluye eficiencias operacionales y eliminación de costos NAF'
                    : 'Considerar beneficios no cuantificados (escalabilidad, compliance, etc.)'
                  }
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  <strong>{assumptions.fullUsers + assumptions.selfServiceUsers}</strong> usuarios totales 
                  ({assumptions.fullUsers} full + {assumptions.selfServiceUsers} self-service)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Controls Toggle */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Variables del Modelo
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetToScenario} className="gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Restablecer
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Ocultar' : 'Mostrar'} controles
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {showAdvanced && (
            <CardContent className="space-y-6">
              {(['licencias', 'usuarios', 'implementacion', 'actual', 'beneficios'] as const).map(category => (
                <div key={category} className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {category === 'licencias' && '💳 Licencias NetSuite'}
                    {category === 'usuarios' && '👥 Usuarios'}
                    {category === 'implementacion' && '🚀 Implementación'}
                    {category === 'actual' && '📊 Situación Actual (NAF)'}
                    {category === 'beneficios' && '✨ Beneficios Esperados'}
                  </h4>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {assumptionControls
                      .filter(c => c.category === category)
                      .map(control => (
                        <div key={control.key} className="space-y-2">
                          <div className="flex justify-between items-baseline">
                            <label className="text-xs text-muted-foreground">{control.label}</label>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={assumptions[control.key]}
                                onChange={(e) => handleAssumptionChange(control.key, Number(e.target.value))}
                                className="w-24 h-7 text-xs text-right"
                              />
                              {control.suffix && <span className="text-xs text-muted-foreground">{control.suffix}</span>}
                            </div>
                          </div>
                          {control.min !== undefined && control.max !== undefined && (
                            <Slider
                              value={[assumptions[control.key]]}
                              onValueChange={([v]) => handleAssumptionChange(control.key, v)}
                              min={control.min}
                              max={control.max}
                              step={control.step ?? 1}
                              className="w-full"
                            />
                          )}
                          {control.helper && (
                            <p className="text-xs text-muted-foreground">{control.helper}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Caveats */}
        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200">
          <CardContent className="pt-5">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">Notas Importantes</p>
                <ul className="space-y-1 text-amber-700 dark:text-amber-300 text-xs">
                  <li>• <strong>Licencias:</strong> Basadas en precios de lista Kimberlite Partners (Oct 2025). Negociación por volumen puede reducir 10-15%.</li>
                  <li>• <strong>Implementación:</strong> Rango $250K-$450K según complejidad. Incluye integraciones con Shopify, WMS, Oracle EPM.</li>
                  <li>• <strong>Usuarios:</strong> RFP indica ~900 usuarios totales (62 finanzas + 600 transacciones + 150 servicio técnico + otros).</li>
                  <li>• <strong>Eficiencias:</strong> Benchmarks de industria sugieren 25% mejora operacional (BringIT, 2025).</li>
                  <li>• <strong>No incluye:</strong> Costos de oportunidad, riesgos de migración, beneficios intangibles (escalabilidad, compliance multi-país).</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between pt-6 border-t">
          <Link href="/erp">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a ERP
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Portal Principal
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
