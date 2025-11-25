import { useMemo, useState } from 'react';
import { 
  ArrowLeft, DollarSign, Users, AlertCircle, HelpCircle,
  CheckCircle2, XCircle, Calculator, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'wouter';

// ═══════════════════════════════════════════════════════════════════════════════
// PRECIOS NETSUITE (Fuente: Kimberlite Partners, Oct 2025)
// ═══════════════════════════════════════════════════════════════════════════════

const NETSUITE_PRICING = {
  baseMonthly: 2_500,           // Mid-Market Edition
  fullUserMonthly: 129,         // Full User license
  selfServiceMonthly: 49,       // Self-Service license
  oneWorldMonthly: 1_500,       // OneWorld add-on (multi-subsidiary)
  advInventoryMonthly: 500,     // Advanced Inventory
  fixedAssetsMonthly: 300,      // Fixed Assets Management
};

// ═══════════════════════════════════════════════════════════════════════════════
// RANGOS DE IMPLEMENTACIÓN (Estimaciones conservadoras para proyecto de esta complejidad)
// Contexto: 7 países, 11 integraciones, 313K items, compliance multi-jurisdicción
// NOTA: Estos son estimados de referencia. Los 5 partners candidatos darán cotizaciones reales.
// ═══════════════════════════════════════════════════════════════════════════════

const IMPLEMENTATION_RANGES = {
  // Para 7 países, 11 integraciones, 5 años de data
  small: {  // Solo finanzas core, integraciones mínimas (3-4)
    implementation: { min: 350_000, max: 500_000 },
    training: { min: 50_000, max: 80_000 },
    yearOneSupport: { min: 40_000, max: 60_000 },
    timeline: '8-12 meses',
  },
  medium: { // Finanzas + operaciones, integraciones moderadas (6-8)
    implementation: { min: 550_000, max: 800_000 },
    training: { min: 80_000, max: 120_000 },
    yearOneSupport: { min: 60_000, max: 90_000 },
    timeline: '12-16 meses',
  },
  large: {  // Alcance completo con facturación, todas las integraciones (11)
    implementation: { min: 800_000, max: 1_200_000 },
    training: { min: 100_000, max: 150_000 },
    yearOneSupport: { min: 80_000, max: 120_000 },
    timeline: '16-20 meses',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATOS DEL RFP (Lo que sabemos)
// ═══════════════════════════════════════════════════════════════════════════════

const RFP_DATA = {
  users: {
    finanzas: 62,
    transacciones: 600,  // ⚠️ Necesita clarificación
    importaciones: 80,
    regulatorio: 7,
    servicioTecnico: 150,
    total: 899,
  },
  countries: 7,
  integrations: 11,
  dataYears: 5,
  items: 313_787,
  customers: 8_095,
  suppliers: 3_945,
};

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
  // Escenarios de usuarios (ajustables)
  const [fullUsers, setFullUsers] = useState(100);
  const [selfServiceUsers, setSelfServiceUsers] = useState(50);
  const [implementationSize, setImplementationSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Datos que necesitamos de PROMED (vacíos por defecto)
  const [nafCostAnnual, setNafCostAnnual] = useState<number | null>(null);
  const [apexCostAnnual, setApexCostAnnual] = useState<number | null>(null);
  const [itHoursDedicatedToNaf, setItHoursDedicatedToNaf] = useState<number | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════════
  // CÁLCULOS DE LICENCIAS (Esto SÍ lo podemos calcular)
  // ═══════════════════════════════════════════════════════════════════════════════

  const licenseCosts = useMemo(() => {
    const base = NETSUITE_PRICING.baseMonthly;
    const fullUsersCost = fullUsers * NETSUITE_PRICING.fullUserMonthly;
    const selfServiceCost = selfServiceUsers * NETSUITE_PRICING.selfServiceMonthly;
    const modules = NETSUITE_PRICING.oneWorldMonthly + 
                    NETSUITE_PRICING.advInventoryMonthly + 
                    NETSUITE_PRICING.fixedAssetsMonthly;
    
    const monthly = base + fullUsersCost + selfServiceCost + modules;
    const annual = monthly * 12;
    
    return {
      base,
      fullUsersCost,
      selfServiceCost,
      modules,
      monthly,
      annual,
    };
  }, [fullUsers, selfServiceUsers]);

  // Costos de implementación (rangos)
  const implRange = IMPLEMENTATION_RANGES[implementationSize];
  const implMidpoint = {
    implementation: (implRange.implementation.min + implRange.implementation.max) / 2,
    training: (implRange.training.min + implRange.training.max) / 2,
    yearOneSupport: (implRange.yearOneSupport.min + implRange.yearOneSupport.max) / 2,
  };

  // Año 1 total (rango)
  const yearOneRange = {
    min: implRange.implementation.min + implRange.training.min + implRange.yearOneSupport.min + licenseCosts.annual,
    max: implRange.implementation.max + implRange.training.max + implRange.yearOneSupport.max + licenseCosts.annual,
  };

  // Año 2+ (licencias + soporte ongoing ~$30-50K)
  const ongoingAnnual = {
    min: licenseCosts.annual + 25_000,
    max: licenseCosts.annual + 50_000,
  };

  // ¿Podemos calcular ROI?
  const canCalculateROI = nafCostAnnual !== null && nafCostAnnual > 0;

  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());

  return (
    <TooltipProvider>
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
                <h1 className="text-lg font-bold">Análisis de Costos</h1>
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
              Estimación de Costos para Migración ERP
            </h2>
            <p className="text-sm text-muted-foreground">
              Esta calculadora muestra <strong>lo que podemos estimar</strong> con información pública de NetSuite 
              y <strong>lo que necesitamos saber</strong> de PROMED para calcular el ROI real.
            </p>
          </section>

          {/* Status Cards - Qué sabemos vs qué falta */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  Lo que SÍ podemos calcular
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>✓ Costos de licencias NetSuite (precios públicos)</p>
                <p>✓ Rangos de implementación (benchmarks de mercado)</p>
                <p>✓ Estructura de usuarios por tipo de licencia</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <XCircle className="w-4 h-4" />
                  Lo que necesitamos de PROMED
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>✗ Costo anual actual de NAF (licencias, mantenimiento)</p>
                <p>✗ Costo anual de APEX (si aplica)</p>
                <p>✗ ¿Cuántos de los 899 usuarios necesitarían licencia NetSuite?</p>
                <p>✗ Horas de IT dedicadas a mantener NAF/APEX</p>
              </CardContent>
            </Card>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 1: COSTOS DE LICENCIAS (Calculable) */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Costos de Licencias NetSuite
              </CardTitle>
              <CardDescription>
                Basado en precios de Kimberlite Partners (Oct 2025). Ajusta los usuarios para ver el impacto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Controles de usuarios */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      Full Users
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Usuarios con acceso completo: crean transacciones, aprueban, generan reportes. 
                          Típicamente: Finanzas, Compras, Gerentes.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="text-sm font-medium">{fullUsers} × ${NETSUITE_PRICING.fullUserMonthly}/mes</span>
                  </div>
                  <Slider
                    value={[fullUsers]}
                    onValueChange={([v]) => setFullUsers(v)}
                    min={20}
                    max={300}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    RFP indica: Finanzas (62) + Import (80) + Regulatorio (7) = 149 potenciales
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      Self-Service Users
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Acceso limitado: consultas, aprobaciones simples, timesheet. 
                          Para usuarios que solo ven información o hacen tareas básicas.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="text-sm font-medium">{selfServiceUsers} × ${NETSUITE_PRICING.selfServiceMonthly}/mes</span>
                  </div>
                  <Slider
                    value={[selfServiceUsers]}
                    onValueChange={([v]) => setSelfServiceUsers(v)}
                    min={0}
                    max={500}
                    step={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Los 600 "Transacciones" y 150 "Serv. Técnico" necesitan clarificación
                  </p>
                </div>
              </div>

              {/* Resumen de tipos de licencia */}
              <div className="grid gap-3 md:grid-cols-3 p-4 rounded-lg bg-muted/30 border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">Full User - $129/mes</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-0.5 ml-5">
                    <li>✓ Crea transacciones, facturas, OC</li>
                    <li>✓ Aprobaciones y workflows</li>
                    <li>✓ Reportes completos</li>
                  </ul>
                  <p className="text-xs text-muted-foreground ml-5 italic">
                    → Contadores, Compradores, Gerentes
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium">Self-Service - $49/mes</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-0.5 ml-5">
                    <li>✓ Consulta información</li>
                    <li>✓ Aprobaciones simples</li>
                    <li>✗ No crea transacciones</li>
                  </ul>
                  <p className="text-xs text-muted-foreground ml-5 italic">
                    → Empleados, Consultores
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">Portal/App - $0/mes</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-0.5 ml-5">
                    <li>✓ App móvil externa</li>
                    <li>✓ WMS integrado</li>
                    <li>✗ Sin acceso directo a NetSuite</li>
                  </ul>
                  <p className="text-xs text-muted-foreground ml-5 italic">
                    → Técnicos campo, Bodegueros
                  </p>
                </div>
              </div>

              {/* Desglose de licencias */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">USD/mes</TableHead>
                    <TableHead className="text-right">USD/año</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>NetSuite Mid-Market Edition (base)</TableCell>
                    <TableCell className="text-right">{formatMoney(licenseCosts.base)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatMoney(licenseCosts.base * 12)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Full Users ({fullUsers} × ${NETSUITE_PRICING.fullUserMonthly})</TableCell>
                    <TableCell className="text-right">{formatMoney(licenseCosts.fullUsersCost)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatMoney(licenseCosts.fullUsersCost * 12)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Self-Service ({selfServiceUsers} × ${NETSUITE_PRICING.selfServiceMonthly})</TableCell>
                    <TableCell className="text-right">{formatMoney(licenseCosts.selfServiceCost)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatMoney(licenseCosts.selfServiceCost * 12)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Módulos (OneWorld + Adv. Inventory + Fixed Assets)
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground ml-1 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>OneWorld: $1,500/mes (multi-país)</p>
                          <p>Adv. Inventory: $500/mes</p>
                          <p>Fixed Assets: $300/mes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right">{formatMoney(licenseCosts.modules)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatMoney(licenseCosts.modules * 12)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5 font-semibold">
                    <TableCell>Total Licencias</TableCell>
                    <TableCell className="text-right text-primary">{formatMoney(licenseCosts.monthly)}</TableCell>
                    <TableCell className="text-right text-primary">{formatMoney(licenseCosts.annual)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Resumen de licencias */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">LICENCIAS/MES</p>
                    <p className="text-2xl font-bold">{formatMoneyK(licenseCosts.monthly)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">LICENCIAS/AÑO</p>
                    <p className="text-2xl font-bold">{formatMoneyK(licenseCosts.annual)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">USUARIOS TOTALES</p>
                    <p className="text-2xl font-bold">{fullUsers + selfServiceUsers}</p>
                    <p className="text-xs text-muted-foreground">{fullUsers} full + {selfServiceUsers} self-service</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 2: COSTOS DE IMPLEMENTACIÓN (Rangos) */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Costos de Implementación (Rangos)
              </CardTitle>
              <CardDescription>
                Estimaciones basadas en benchmarks de mercado para proyectos similares (7 países, 11 integraciones).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selector de alcance */}
              <Tabs value={implementationSize} onValueChange={(v) => setImplementationSize(v as typeof implementationSize)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="small">Alcance Reducido</TabsTrigger>
                  <TabsTrigger value="medium">Alcance Estándar</TabsTrigger>
                  <TabsTrigger value="large">Alcance Completo</TabsTrigger>
                </TabsList>
                <TabsContent value="small" className="mt-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Solo módulos financieros core.</strong> Contabilidad, CxP, CxC, Tesorería, Activos Fijos. 
                    Mínimas integraciones. Sin facturación.
                  </p>
                </TabsContent>
                <TabsContent value="medium" className="mt-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Finanzas + Operaciones.</strong> Core + Inventario, Compras, Importaciones. 
                    Integraciones con WMS y sistemas principales.
                  </p>
                </TabsContent>
                <TabsContent value="large" className="mt-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Alcance completo incluyendo facturación.</strong> Todos los módulos, todas las integraciones, 
                    reemplazo de APEX.
                  </p>
                </TabsContent>
              </Tabs>

              {/* Tabla de rangos */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Mínimo</TableHead>
                    <TableHead className="text-right">Máximo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Implementación (consultoría, configuración, integraciones)</TableCell>
                    <TableCell className="text-right">{formatMoney(implRange.implementation.min)}</TableCell>
                    <TableCell className="text-right">{formatMoney(implRange.implementation.max)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Training y Change Management</TableCell>
                    <TableCell className="text-right">{formatMoney(implRange.training.min)}</TableCell>
                    <TableCell className="text-right">{formatMoney(implRange.training.max)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Soporte Año 1 (hypercare, estabilización)</TableCell>
                    <TableCell className="text-right">{formatMoney(implRange.yearOneSupport.min)}</TableCell>
                    <TableCell className="text-right">{formatMoney(implRange.yearOneSupport.max)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Licencias Año 1</TableCell>
                    <TableCell className="text-right" colSpan={2}>{formatMoney(licenseCosts.annual)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5 font-semibold">
                    <TableCell>TOTAL AÑO 1</TableCell>
                    <TableCell className="text-right text-primary">{formatMoney(yearOneRange.min)}</TableCell>
                    <TableCell className="text-right text-primary">{formatMoney(yearOneRange.max)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/50">
                    <TableCell>Año 2+ (licencias + soporte ongoing)</TableCell>
                    <TableCell className="text-right">{formatMoney(ongoingAnnual.min)}</TableCell>
                    <TableCell className="text-right">{formatMoney(ongoingAnnual.max)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Timeline */}
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm">
                  <strong>Timeline estimado:</strong> {implRange.timeline}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Incluye: Análisis, Configuración, Migración de datos, UAT, Training, Go-live, Estabilización
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 3: DATOS NECESARIOS PARA ROI */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <AlertCircle className="w-5 h-5" />
                Para Calcular ROI Necesitamos
              </CardTitle>
              <CardDescription>
                Sin estos datos de PROMED, cualquier cálculo de ROI sería especulativo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Costo NAF */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    ¿Cuánto cuesta NAF al año?
                    <span className="text-xs text-amber-600 font-normal">(Pregunta para Jorge/Janette)</span>
                  </Label>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground self-center">$</span>
                    <Input
                      type="number"
                      placeholder="Licencias + mantenimiento + soporte"
                      value={nafCostAnnual ?? ''}
                      onChange={(e) => setNafCostAnnual(e.target.value ? Number(e.target.value) : null)}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground self-center">/año</span>
                  </div>
                </div>

                {/* Costo APEX */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    ¿Cuánto cuesta APEX al año?
                    <span className="text-xs text-amber-600 font-normal">(Pregunta para Jorge/Janette)</span>
                  </Label>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground self-center">$</span>
                    <Input
                      type="number"
                      placeholder="Si aplica - sistema de facturación"
                      value={apexCostAnnual ?? ''}
                      onChange={(e) => setApexCostAnnual(e.target.value ? Number(e.target.value) : null)}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground self-center">/año</span>
                  </div>
                </div>

                {/* Horas IT */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    ¿Cuántas horas de IT se dedican a NAF/APEX al año?
                    <span className="text-xs text-amber-600 font-normal">(Pregunta para Janette)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Horas totales del equipo IT"
                      value={itHoursDedicatedToNaf ?? ''}
                      onChange={(e) => setItHoursDedicatedToNaf(e.target.value ? Number(e.target.value) : null)}
                      className="w-48"
                    />
                    <span className="text-muted-foreground self-center">horas/año</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye: soporte, troubleshooting, reportes custom, mantenimiento, parches, etc.
                  </p>
                </div>
              </div>

              {/* Resultado condicional */}
              {canCalculateROI ? (
                <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                      Con los datos ingresados:
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Costo actual estimado/año</p>
                        <p className="text-lg font-bold">
                          {formatMoney((nafCostAnnual || 0) + (apexCostAnnual || 0) + ((itHoursDedicatedToNaf || 0) * 30))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Costo NetSuite Año 2+</p>
                        <p className="text-lg font-bold">{formatMoneyK((ongoingAnnual.min + ongoingAnnual.max) / 2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Diferencia anual</p>
                        <p className="text-lg font-bold">
                          {formatMoney(
                            ((nafCostAnnual || 0) + (apexCostAnnual || 0) + ((itHoursDedicatedToNaf || 0) * 30)) -
                            ((ongoingAnnual.min + ongoingAnnual.max) / 2)
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-amber-600 mt-3">
                      ⚠️ Esto NO incluye beneficios de eficiencia, solo comparación de costos directos.
                      El ROI real requiere cuantificar mejoras operacionales.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    Ingresa al menos el costo anual de NAF para ver una comparación básica.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 4: PREGUNTAS CLAVE */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Preguntas Críticas para PROMED
              </CardTitle>
              <CardDescription>
                Estas respuestas determinan el presupuesto real del proyecto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200">
                  <p className="font-medium text-red-800 dark:text-red-200 mb-2">
                    🔴 Los 600 "usuarios de Transacciones"
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    ¿Son usuarios de APEX? ¿Cuántos crean transacciones vs. solo consultan? 
                    <strong> La diferencia puede ser ~$700K/año en licencias.</strong>
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200">
                  <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                    🟡 ¿Facturación va a NetSuite?
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Si APEX se mantiene o se mueve a Odoo, el alcance de NetSuite se reduce significativamente.
                    Esto cambia el escenario de "Completo" a "Estándar".
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                  <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    🔵 Servicio Técnico (150 usuarios)
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    ¿Necesitan acceso ERP completo o pueden usar app móvil/portal? 
                    Portal = $0, Full user = $19K/mes adicionales.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted border">
                  <p className="font-medium mb-2">📊 Costos actuales</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• ¿Cuánto pagan por NAF al año? (licencias, mantenimiento, infra)</li>
                    <li>• ¿Cuánto cuesta APEX?</li>
                    <li>• ¿Cuántas horas de IT dedican a estos sistemas?</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* RESUMEN FINAL */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4">📋 Resumen de Escenarios (Estimados de Referencia)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escenario</TableHead>
                    <TableHead>Usuarios</TableHead>
                    <TableHead className="text-right">Año 1 (Total)</TableHead>
                    <TableHead className="text-right">Año 2+</TableHead>
                    <TableHead>Timeline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Reducido
                      <p className="text-xs text-muted-foreground font-normal">Solo finanzas core</p>
                    </TableCell>
                    <TableCell>~70-100</TableCell>
                    <TableCell className="text-right">
                      {formatMoneyK(IMPLEMENTATION_RANGES.small.implementation.min + IMPLEMENTATION_RANGES.small.training.min + IMPLEMENTATION_RANGES.small.yearOneSupport.min + (70 * 129 + 30 * 49 + 4800) * 12)} - {formatMoneyK(IMPLEMENTATION_RANGES.small.implementation.max + IMPLEMENTATION_RANGES.small.training.max + IMPLEMENTATION_RANGES.small.yearOneSupport.max + (100 * 129 + 50 * 49 + 4800) * 12)}
                    </TableCell>
                    <TableCell className="text-right">~$180-220K</TableCell>
                    <TableCell>{IMPLEMENTATION_RANGES.small.timeline}</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5">
                    <TableCell className="font-medium">
                      Estándar
                      <p className="text-xs text-muted-foreground font-normal">Finanzas + Operaciones</p>
                    </TableCell>
                    <TableCell>~150-200</TableCell>
                    <TableCell className="text-right">
                      {formatMoneyK(IMPLEMENTATION_RANGES.medium.implementation.min + IMPLEMENTATION_RANGES.medium.training.min + IMPLEMENTATION_RANGES.medium.yearOneSupport.min + (120 * 129 + 80 * 49 + 4800) * 12)} - {formatMoneyK(IMPLEMENTATION_RANGES.medium.implementation.max + IMPLEMENTATION_RANGES.medium.training.max + IMPLEMENTATION_RANGES.medium.yearOneSupport.max + (150 * 129 + 100 * 49 + 4800) * 12)}
                    </TableCell>
                    <TableCell className="text-right">~$300-400K</TableCell>
                    <TableCell>{IMPLEMENTATION_RANGES.medium.timeline}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Completo
                      <p className="text-xs text-muted-foreground font-normal">+ Facturación (reemplaza APEX)</p>
                    </TableCell>
                    <TableCell>~400-600</TableCell>
                    <TableCell className="text-right">
                      {formatMoneyK(IMPLEMENTATION_RANGES.large.implementation.min + IMPLEMENTATION_RANGES.large.training.min + IMPLEMENTATION_RANGES.large.yearOneSupport.min + (250 * 129 + 350 * 49 + 4800) * 12)} - {formatMoneyK(IMPLEMENTATION_RANGES.large.implementation.max + IMPLEMENTATION_RANGES.large.training.max + IMPLEMENTATION_RANGES.large.yearOneSupport.max + (350 * 129 + 450 * 49 + 4800) * 12)}
                    </TableCell>
                    <TableCell className="text-right">~$550-750K</TableCell>
                    <TableCell>{IMPLEMENTATION_RANGES.large.timeline}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>📌 Nota:</strong> Hay <strong>5 partners candidatos</strong> con experiencia para este proyecto. 
                  Los costos reales vendrán de sus cotizaciones formales una vez se defina el alcance y usuarios.
                </p>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Estos rangos son estimaciones conservadoras de mercado para proyectos de complejidad similar 
                (7 países, múltiples integraciones, industria regulada).
              </p>
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
            <Link href="/erp/mapeo-modulos">
              <Button size="sm">
                Mapeo de Módulos
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
