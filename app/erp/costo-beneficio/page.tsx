"use client";

import { useMemo, useState } from 'react';
import { 
  ArrowLeft, DollarSign, Users, AlertCircle, HelpCircle,
  CheckCircle2, XCircle, Calculator, Info, TrendingUp, Clock, Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

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
    transacciones: 600,  // ⚠️ Necesita clarificación - ver ResumenDecisiones
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
// COSTOS ACTUALES CONOCIDOS (Datos recopilados de PROMED)
// Fuente: Análisis de workshop Dic 2024
// ═══════════════════════════════════════════════════════════════════════════════

const COSTOS_ACTUALES = {
  // Licencias Oracle anuales
  soporteOracleDB: 9_214,      // Soporte Oracle DB
  developerSuite: 1_877,       // Developer Suite
  soporteOracleOAS: 9_161,     // Soporte Oracle OAS
  // Subtotal licencias: ~$20,251/año

  // Mantenimiento externo
  mantenimientoCW: 9_500,      // Mantenimiento C&W
  
  // AWS - NAF
  awsRamanujan: 6_600,         // Servidor Ramanujan
  awsNaf: 3_600,               // NAF en AWS
  // Subtotal AWS NAF: ~$10,200/año

  // AWS - APEX
  apexInstancia: 5_064,        // Instancia APEX
  apexDB: 2_400,               // Base de datos APEX
  // Subtotal APEX: ~$7,464/año

  // QuickSuite (Data Lake visualization)
  quickSuiteAutores: 6,        // 6 autores × ~$42/mes
  quickSuiteLectores: 178,     // 178 lectores × ~$3.40/mes
  quickSuiteEstimado: 8_000,   // Estimado anual

  // IT interno (PENDIENTE - datos incompletos)
  // Se sabe: 160 horas/mes/dev
  // Falta: # de devs, costo/hora
  itDevHorasMes: 160,
  itDevs: null as number | null,        // PENDIENTE
  itCostoHora: null as number | null,   // PENDIENTE
};

const calcularTotalConocido = () => {
  return COSTOS_ACTUALES.soporteOracleDB +
         COSTOS_ACTUALES.developerSuite +
         COSTOS_ACTUALES.soporteOracleOAS +
         COSTOS_ACTUALES.mantenimientoCW +
         COSTOS_ACTUALES.awsRamanujan +
         COSTOS_ACTUALES.awsNaf +
         COSTOS_ACTUALES.apexInstancia +
         COSTOS_ACTUALES.apexDB +
         COSTOS_ACTUALES.quickSuiteEstimado;
};

const TOTAL_CONOCIDO_SIN_IT = calcularTotalConocido(); // ~$55,415/año

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
  
  // Datos que necesitamos de PROMED (pre-poblados con datos conocidos)
  const [nafCostAnnual, setNafCostAnnual] = useState<number | null>(
    COSTOS_ACTUALES.soporteOracleDB + COSTOS_ACTUALES.developerSuite + 
    COSTOS_ACTUALES.soporteOracleOAS + COSTOS_ACTUALES.mantenimientoCW +
    COSTOS_ACTUALES.awsRamanujan + COSTOS_ACTUALES.awsNaf
  ); // ~$39,951
  const [apexCostAnnual, setApexCostAnnual] = useState<number | null>(
    COSTOS_ACTUALES.apexInstancia + COSTOS_ACTUALES.apexDB
  ); // ~$7,464
  const [itHoursDedicatedToNaf, setItHoursDedicatedToNaf] = useState<number | null>(
    COSTOS_ACTUALES.itDevHorasMes * 12 // 1,920 horas/año (1 dev) - pero pueden ser más
  );
  const [itCostPerHour, setItCostPerHour] = useState<number | null>(30); // Estimado para Panamá
  const [numDevs, setNumDevs] = useState<number | null>(2); // PENDIENTE confirmar
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // VARIABLES PARA ESTIMACIÓN DE ROI
  // ═══════════════════════════════════════════════════════════════════════════════
  
  // Eficiencia operacional - horas ahorradas por automatización
  const [horasAhorradasSemana, setHorasAhorradasSemana] = useState<number>(40); // horas/semana de re-tipeo eliminado
  const [costoHoraOperacional, setCostoHoraOperacional] = useState<number>(15); // USD/hora promedio empleado
  
  // Revenue recovery - ingresos recuperados
  const [revenueLostAnual, setRevenueLostAnual] = useState<number>(200_000); // Revenue leakage estimado (comodatos, ST no facturado)
  const [recoveryPercent, setRecoveryPercent] = useState<number>(50); // % que se puede recuperar
  
  // Reducción de errores y correcciones
  const [costoCorrrecionesAnual, setCostoCorrrecionesAnual] = useState<number>(50_000); // Costo de correcciones, retrabajos
  const [reduccionErrores, setReduccionErrores] = useState<number>(60); // % reducción esperada
  
  // Reducción de auditoría y compliance
  const [costoAuditoriaAnual, setCostoAuditoriaAnual] = useState<number>(30_000); // Preparación de auditorías, multas
  const [reduccionAuditoria, setReduccionAuditoria] = useState<number>(40); // % reducción
  
  // Horizonte de análisis
  const [aniosAnalisis, setAniosAnalisis] = useState<number>(5);

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

  // ═══════════════════════════════════════════════════════════════════════════════
  // CÁLCULO DE ROI
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const roiCalculation = useMemo(() => {
    // Costo actual total anual
    const currentAnnualCost = TOTAL_CONOCIDO_SIN_IT + 
      (numDevs && itCostPerHour ? numDevs * COSTOS_ACTUALES.itDevHorasMes * 12 * itCostPerHour : 0);
    
    // Costos NetSuite
    const yearOneCostMid = (yearOneRange.min + yearOneRange.max) / 2;
    const ongoingCostMid = (ongoingAnnual.min + ongoingAnnual.max) / 2;
    
    // Total NetSuite a N años (Año 1 + (N-1) años ongoing)
    const totalNetSuiteCost = yearOneCostMid + (ongoingCostMid * (aniosAnalisis - 1));
    
    // Total costo actual a N años (sin NetSuite)
    const totalCurrentCost = currentAnnualCost * aniosAnalisis;
    
    // BENEFICIOS ANUALES (empiezan desde año 2, parcialmente en año 1)
    
    // 1. Eficiencia operacional - horas ahorradas
    const ahorroEficiencia = horasAhorradasSemana * 52 * costoHoraOperacional;
    
    // 2. Revenue recovery
    const ahorroRevenue = revenueLostAnual * (recoveryPercent / 100);
    
    // 3. Reducción de errores
    const ahorroErrores = costoCorrrecionesAnual * (reduccionErrores / 100);
    
    // 4. Reducción auditoría
    const ahorroAuditoria = costoAuditoriaAnual * (reduccionAuditoria / 100);
    
    // Total beneficios anuales
    const beneficiosAnuales = ahorroEficiencia + ahorroRevenue + ahorroErrores + ahorroAuditoria;
    
    // Beneficios a N años (año 1 = 25%, años siguientes = 100%)
    const beneficiosTotales = (beneficiosAnuales * 0.25) + (beneficiosAnuales * (aniosAnalisis - 1));
    
    // Ahorro de costos vs sistema actual (después de implementación)
    // Año 1: pagamos NetSuite y aún tenemos costos de transición
    // Año 2+: solo NetSuite ongoing vs costo actual completo
    const ahorroSistemaAnual = currentAnnualCost - ongoingCostMid;
    const ahorroSistemaTotales = ahorroSistemaAnual * (aniosAnalisis - 1); // Solo desde año 2
    
    // Inversión neta (Año 1)
    const inversionNeta = yearOneCostMid;
    
    // Beneficio neto total
    const beneficioNetoTotal = beneficiosTotales + ahorroSistemaTotales;
    
    // ROI = (Beneficio - Inversión) / Inversión × 100
    const roi = ((beneficioNetoTotal - inversionNeta) / inversionNeta) * 100;
    
    // Payback period (años)
    // Beneficio anual neto (desde año 2) = beneficios + ahorro sistema
    const beneficioAnualNeto = beneficiosAnuales + ahorroSistemaAnual;
    const paybackPeriod = beneficioAnualNeto > 0 ? inversionNeta / beneficioAnualNeto : Infinity;
    
    // NPV simplificado (sin descuento temporal por ahora)
    const npv = beneficioNetoTotal - inversionNeta;
    
    return {
      currentAnnualCost,
      yearOneCostMid,
      ongoingCostMid,
      totalNetSuiteCost,
      totalCurrentCost,
      beneficiosAnuales,
      beneficiosTotales,
      ahorroSistemaAnual,
      ahorroSistemaTotales,
      inversionNeta,
      beneficioNetoTotal,
      roi,
      paybackPeriod,
      npv,
      desglose: {
        eficiencia: ahorroEficiencia,
        revenue: ahorroRevenue,
        errores: ahorroErrores,
        auditoria: ahorroAuditoria,
      }
    };
  }, [
    numDevs, itCostPerHour, yearOneRange, ongoingAnnual, aniosAnalisis,
    horasAhorradasSemana, costoHoraOperacional, revenueLostAnual, recoveryPercent,
    costoCorrrecionesAnual, reduccionErrores, costoAuditoriaAnual, reduccionAuditoria
  ]);

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

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 3: COSTOS ACTUALES CONOCIDOS */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}

          <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <DollarSign className="w-5 h-5" />
                Costos Actuales Conocidos (NAF + APEX + AWS)
              </CardTitle>
              <CardDescription>
                Datos recopilados del análisis de workshop. Pre-poblados para el cálculo de ROI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">USD/año</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Licencias Oracle (DB + Developer Suite + OAS)</TableCell>
                    <TableCell className="text-right">{formatMoney(COSTOS_ACTUALES.soporteOracleDB + COSTOS_ACTUALES.developerSuite + COSTOS_ACTUALES.soporteOracleOAS)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mantenimiento C&W</TableCell>
                    <TableCell className="text-right">{formatMoney(COSTOS_ACTUALES.mantenimientoCW)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>AWS NAF (Ramanujan + NAF)</TableCell>
                    <TableCell className="text-right">{formatMoney(COSTOS_ACTUALES.awsRamanujan + COSTOS_ACTUALES.awsNaf)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>AWS APEX (Instancia + DB)</TableCell>
                    <TableCell className="text-right">{formatMoney(COSTOS_ACTUALES.apexInstancia + COSTOS_ACTUALES.apexDB)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>QuickSuite ({COSTOS_ACTUALES.quickSuiteAutores} autores + {COSTOS_ACTUALES.quickSuiteLectores} lectores)</TableCell>
                    <TableCell className="text-right">{formatMoney(COSTOS_ACTUALES.quickSuiteEstimado)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-blue-100 dark:bg-blue-900/30 font-semibold">
                    <TableCell>Subtotal (sin mano de obra IT)</TableCell>
                    <TableCell className="text-right text-blue-700 dark:text-blue-300">{formatMoney(TOTAL_CONOCIDO_SIN_IT)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* SECCIÓN 4: COSTO IT INTERNO (LO QUE FALTA) */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <AlertCircle className="w-5 h-5" />
                Costo de IT Interno (Pendiente Confirmar)
              </CardTitle>
              <CardDescription>
                Sabemos que dedican 160h/mes/dev, pero falta confirmar cuántos devs y a qué costo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Número de devs */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    ¿Cuántos devs trabajan en NAF/APEX?
                    <span className="text-xs text-amber-600 font-normal">(Confirmar)</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="Número de desarrolladores"
                    value={numDevs ?? ''}
                    onChange={(e) => setNumDevs(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>

                {/* Costo por hora */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Costo promedio/hora (USD)
                    <span className="text-xs text-amber-600 font-normal">(Confirmar)</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="Costo hora dev"
                    value={itCostPerHour ?? ''}
                    onChange={(e) => setItCostPerHour(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>

                {/* Resultado */}
                <div className="space-y-2">
                  <Label>Costo IT interno estimado/año</Label>
                  <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                      {numDevs && itCostPerHour 
                        ? formatMoney(numDevs * COSTOS_ACTUALES.itDevHorasMes * 12 * itCostPerHour)
                        : '—'}
                    </p>
                    <p className="text-xs text-amber-600">
                      {numDevs && itCostPerHour 
                        ? `${numDevs} devs × 160h/mes × 12 meses × $${itCostPerHour}/h`
                        : 'Completa los campos'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cálculo total */}
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <p className="text-sm font-medium text-foreground mb-3">Resumen de Costos Actuales Totales</p>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Infra + Licencias</p>
                    <p className="text-lg font-bold">{formatMoney(TOTAL_CONOCIDO_SIN_IT)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IT Interno</p>
                    <p className="text-lg font-bold text-amber-600">
                      {numDevs && itCostPerHour 
                        ? formatMoney(numDevs * COSTOS_ACTUALES.itDevHorasMes * 12 * itCostPerHour)
                        : '(pendiente)'}
                    </p>
                  </div>
                  <div className="md:col-span-2 p-3 rounded-lg bg-primary/10">
                    <p className="text-xs text-muted-foreground">TOTAL ANUAL ACTUAL</p>
                    <p className="text-2xl font-bold text-primary">
                      {numDevs && itCostPerHour 
                        ? formatMoney(TOTAL_CONOCIDO_SIN_IT + (numDevs * COSTOS_ACTUALES.itDevHorasMes * 12 * itCostPerHour))
                        : formatMoney(TOTAL_CONOCIDO_SIN_IT) + ' + IT'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparación con NetSuite */}
              {numDevs && itCostPerHour && (
                <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-3">
                      Comparación con NetSuite (Año 2+)
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Costo actual total/año</p>
                        <p className="text-lg font-bold">
                          {formatMoney(TOTAL_CONOCIDO_SIN_IT + (numDevs * COSTOS_ACTUALES.itDevHorasMes * 12 * itCostPerHour))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">NetSuite Año 2+ (promedio)</p>
                        <p className="text-lg font-bold">{formatMoneyK((ongoingAnnual.min + ongoingAnnual.max) / 2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Diferencia anual</p>
                        <p className={`text-lg font-bold ${
                          (TOTAL_CONOCIDO_SIN_IT + (numDevs * COSTOS_ACTUALES.itDevHorasMes * 12 * itCostPerHour)) - ((ongoingAnnual.min + ongoingAnnual.max) / 2) < 0 
                            ? 'text-red-600' 
                            : 'text-emerald-600'
                        }`}>
                          {formatMoney(
                            (TOTAL_CONOCIDO_SIN_IT + (numDevs * COSTOS_ACTUALES.itDevHorasMes * 12 * itCostPerHour)) -
                            ((ongoingAnnual.min + ongoingAnnual.max) / 2)
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-amber-600 mt-3">
                      ⚠️ Esto es solo comparación de costos directos. NetSuite probablemente costará más, 
                      pero el ROI viene de eficiencia operacional, no de ahorro en licencias.
                    </p>
                  </CardContent>
                </Card>
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
          {/* SECCIÓN 5: ESTIMACIÓN DE ROI */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}

          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <TrendingUp className="w-5 h-5" />
                Estimación de ROI (Variables Ajustables)
              </CardTitle>
              <CardDescription>
                Ajusta las variables para estimar el retorno de inversión. Los valores pre-poblados son estimaciones conservadoras.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Horizonte de análisis */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <Label className="whitespace-nowrap">Horizonte de análisis:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={aniosAnalisis}
                    onChange={(e) => setAniosAnalisis(Number(e.target.value) || 5)}
                    className="w-20"
                    min={1}
                    max={10}
                  />
                  <span className="text-sm text-muted-foreground">años</span>
                </div>
              </div>

              {/* Variables de beneficios */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Eficiencia Operacional */}
                <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Eficiencia Operacional
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Horas de re-tipeo y trabajo manual eliminado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Horas/semana ahorradas</Label>
                        <Input
                          type="number"
                          value={horasAhorradasSemana}
                          onChange={(e) => setHorasAhorradasSemana(Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Costo/hora (USD)</Label>
                        <Input
                          type="number"
                          value={costoHoraOperacional}
                          onChange={(e) => setCostoHoraOperacional(Number(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/30">
                      <p className="text-xs text-muted-foreground">Ahorro anual:</p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {formatMoney(roiCalculation.desglose.eficiencia)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Recovery */}
                <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Revenue Recovery
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Ingresos perdidos por falta de trazabilidad (comodatos, ST no facturado)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Leakage anual (USD)</Label>
                        <Input
                          type="number"
                          value={revenueLostAnual}
                          onChange={(e) => setRevenueLostAnual(Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">% Recuperable</Label>
                        <Input
                          type="number"
                          value={recoveryPercent}
                          onChange={(e) => setRecoveryPercent(Number(e.target.value) || 0)}
                          max={100}
                        />
                      </div>
                    </div>
                    <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-900/30">
                      <p className="text-xs text-muted-foreground">Recuperación anual:</p>
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                        {formatMoney(roiCalculation.desglose.revenue)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Reducción de Errores */}
                <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-amber-600" />
                      Reducción de Errores
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Costo de correcciones, retrabajos, NC por errores
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Costo correcciones/año</Label>
                        <Input
                          type="number"
                          value={costoCorrrecionesAnual}
                          onChange={(e) => setCostoCorrrecionesAnual(Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">% Reducción</Label>
                        <Input
                          type="number"
                          value={reduccionErrores}
                          onChange={(e) => setReduccionErrores(Number(e.target.value) || 0)}
                          max={100}
                        />
                      </div>
                    </div>
                    <div className="p-2 rounded bg-amber-100 dark:bg-amber-900/30">
                      <p className="text-xs text-muted-foreground">Ahorro anual:</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                        {formatMoney(roiCalculation.desglose.errores)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Reducción Auditoría */}
                <Card className="bg-violet-50/50 dark:bg-violet-950/20 border-violet-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-violet-600" />
                      Compliance & Auditoría
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Preparación de auditorías, multas evitadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Costo auditoría/año</Label>
                        <Input
                          type="number"
                          value={costoAuditoriaAnual}
                          onChange={(e) => setCostoAuditoriaAnual(Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">% Reducción</Label>
                        <Input
                          type="number"
                          value={reduccionAuditoria}
                          onChange={(e) => setReduccionAuditoria(Number(e.target.value) || 0)}
                          max={100}
                        />
                      </div>
                    </div>
                    <div className="p-2 rounded bg-violet-100 dark:bg-violet-900/30">
                      <p className="text-xs text-muted-foreground">Ahorro anual:</p>
                      <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
                        {formatMoney(roiCalculation.desglose.auditoria)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumen de Beneficios */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900 border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
                  Resumen de Beneficios Anuales (desde Año 2)
                </p>
                <div className="grid gap-3 md:grid-cols-5">
                  <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                    <p className="text-xs text-muted-foreground">Eficiencia</p>
                    <p className="text-sm font-bold">{formatMoneyK(roiCalculation.desglose.eficiencia)}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-sm font-bold">{formatMoneyK(roiCalculation.desglose.revenue)}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                    <p className="text-xs text-muted-foreground">Errores</p>
                    <p className="text-sm font-bold">{formatMoneyK(roiCalculation.desglose.errores)}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                    <p className="text-xs text-muted-foreground">Auditoría</p>
                    <p className="text-sm font-bold">{formatMoneyK(roiCalculation.desglose.auditoria)}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-emerald-200 dark:bg-emerald-800">
                    <p className="text-xs text-muted-foreground">Total/Año</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                      {formatMoneyK(roiCalculation.beneficiosAnuales)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resultados ROI */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Resultados del Análisis a {aniosAnalisis} años
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    <p className="text-xs text-muted-foreground">Inversión Año 1</p>
                    <p className="text-xl font-bold text-foreground">{formatMoneyK(roiCalculation.inversionNeta)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    <p className="text-xs text-muted-foreground">Beneficio Total ({aniosAnalisis} años)</p>
                    <p className="text-xl font-bold text-emerald-600">{formatMoneyK(roiCalculation.beneficioNetoTotal)}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${roiCalculation.roi > 0 ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className={`text-2xl font-bold ${roiCalculation.roi > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {roiCalculation.roi.toFixed(0)}%
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${roiCalculation.paybackPeriod <= 3 ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-amber-100 dark:bg-amber-900/50'}`}>
                    <p className="text-xs text-muted-foreground">Payback Period</p>
                    <p className={`text-2xl font-bold ${roiCalculation.paybackPeriod <= 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {roiCalculation.paybackPeriod === Infinity ? '∞' : roiCalculation.paybackPeriod.toFixed(1)} años
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabla comparativa TCO */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">
                  Comparación TCO a {aniosAnalisis} años
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Mantener NAF+APEX</TableHead>
                      <TableHead className="text-right">Migrar a NetSuite</TableHead>
                      <TableHead className="text-right">Diferencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Costos de sistemas ({aniosAnalisis} años)</TableCell>
                      <TableCell className="text-right">{formatMoney(roiCalculation.totalCurrentCost)}</TableCell>
                      <TableCell className="text-right">{formatMoney(roiCalculation.totalNetSuiteCost)}</TableCell>
                      <TableCell className={`text-right font-medium ${roiCalculation.totalCurrentCost - roiCalculation.totalNetSuiteCost > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatMoney(roiCalculation.totalCurrentCost - roiCalculation.totalNetSuiteCost)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Beneficios operacionales ({aniosAnalisis} años)</TableCell>
                      <TableCell className="text-right text-muted-foreground">$0</TableCell>
                      <TableCell className="text-right text-emerald-600">+{formatMoney(roiCalculation.beneficiosTotales)}</TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">+{formatMoney(roiCalculation.beneficiosTotales)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-primary/5 font-semibold">
                      <TableCell>Valor Neto Total</TableCell>
                      <TableCell className="text-right">{formatMoney(roiCalculation.totalCurrentCost)}</TableCell>
                      <TableCell className="text-right">{formatMoney(roiCalculation.totalNetSuiteCost - roiCalculation.beneficiosTotales)}</TableCell>
                      <TableCell className={`text-right ${roiCalculation.npv > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {roiCalculation.npv > 0 ? '+' : ''}{formatMoney(roiCalculation.npv)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">⚠️ Importante:</p>
                <ul className="space-y-0.5 ml-3">
                  <li>• Estos son <strong>estimados conservadores</strong> para ejercicio de análisis</li>
                  <li>• Los beneficios reales dependen de la adopción y ejecución del proyecto</li>
                  <li>• El ROI no incluye beneficios intangibles (mejor toma de decisiones, escalabilidad, etc.)</li>
                  <li>• Se asume que los beneficios empiezan parcialmente (25%) en Año 1 y 100% desde Año 2</li>
                </ul>
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
