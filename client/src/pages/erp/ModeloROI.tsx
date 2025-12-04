import { useState, useMemo } from 'react';
import { 
  ArrowLeft, ChevronDown, ChevronRight, DollarSign, TrendingUp, 
  Clock, Percent, Calculator, CheckCircle2, AlertCircle, XCircle,
  Server, Users, Settings, Link2, Eye, Wallet, ShieldCheck, Package, HelpCircle, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'wouter';

// ═══════════════════════════════════════════════════════════════════════════════
// TIPOS Y CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════

type FieldStatus = 'confirmed' | 'estimated' | 'required';

interface FieldDefinition {
  definition: string;
  formula?: string;
  example?: string;
}

const statusConfig: Record<FieldStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  confirmed: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Confirmado' },
  estimated: { icon: AlertCircle, color: 'text-amber-500', label: 'Estimado' },
  required: { icon: XCircle, color: 'text-red-500', label: 'Requerido' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEFINICIONES Y FÓRMULAS
// ═══════════════════════════════════════════════════════════════════════════════

const fieldDefinitions: Record<string, FieldDefinition> = {
  // 1A. Infraestructura
  licenciasOracleDB: {
    definition: 'Costo anual de licencias de Oracle Database para el ERP NAF.',
    formula: 'Monto fijo según contrato con Oracle',
  },
  developerSuite: {
    definition: 'Herramientas de desarrollo Oracle para programadores que mantienen NAF.',
    formula: 'Monto fijo según contrato con Oracle',
  },
  licenciasOAS: {
    definition: 'Oracle Application Server - servidor de aplicaciones para NAF.',
    formula: 'Monto fijo según contrato con Oracle',
  },
  mantenimientoCW: {
    definition: 'Contrato de mantenimiento con C&W (Cable & Wireless) para soporte de infraestructura.',
  },
  awsRamanujan: {
    definition: 'Instancia AWS "Ramanujan" - servidor de producción principal.',
    formula: '$550/mes × 12 = $6,600/año',
  },
  awsNAF: {
    definition: 'Instancia AWS dedicada para el ERP NAF.',
    formula: '$300/mes × 12 = $3,600/año',
  },
  awsAPEX: {
    definition: 'Instancia AWS para Oracle APEX (formularios y reportes).',
    formula: '$422/mes × 12 = $5,064/año',
  },
  awsAPEXDB: {
    definition: 'Base de datos Oracle en AWS para APEX.',
    formula: '$200/mes × 12 = $2,400/año',
  },
  quickSuite: {
    definition: 'Herramienta de visualización de datos (BI). No es el data lake, solo la capa de reportes.',
    formula: '(6 autores × $24) + (178 lectores × $3) = $678/mes × 12',
  },
  
  // 1B. Personal IT
  numDevs: {
    definition: 'Número de desarrolladores dedicados a mantener NAF y APEX.',
    example: 'Incluye corrección de errores, nuevas funcionalidades, integraciones.',
  },
  horasMesDev: {
    definition: 'Horas mensuales que cada desarrollador dedica a NAF/APEX.',
    formula: '160 hrs = jornada completa',
  },
  costoHoraDev: {
    definition: 'Costo por hora del desarrollador (salario + cargas sociales / horas trabajadas).',
    formula: 'Salario mensual ÷ 160 hrs × 1.4 (cargas)',
    example: '$4,800/mes ÷ 160 = $30/hr',
  },
  numAdminsInfra: {
    definition: 'FTE (Full Time Equivalent) de administradores de infraestructura dedicados a estos sistemas.',
    example: '0.5 = medio tiempo dedicado a NAF/APEX',
  },
  costoHoraAdminInfra: {
    definition: 'Costo por hora del administrador de infraestructura.',
  },
  
  // 1C. Administración
  horasMesGestionProveedores: {
    definition: 'Horas mensuales dedicadas a gestionar contratos y comunicación con Oracle, C&W, AWS.',
  },
  horasMesCoordinacionSistemas: {
    definition: 'Horas mensuales coordinando entre NAF, APEX y otros sistemas.',
  },
  horasMesTroubleshooting: {
    definition: 'Horas mensuales resolviendo problemas reportados por usuarios.',
  },
  costoHoraAdmin: {
    definition: 'Costo por hora del personal administrativo/gestión.',
  },
  
  // 1D. Integraciones
  horasMesMantenimientoIntegraciones: {
    definition: 'Horas mensuales manteniendo las 11 integraciones críticas (Shopify, WMS, Odoo, etc.).',
  },
  numIntegraciones: {
    definition: 'Número de sistemas integrados con NAF/APEX.',
    example: 'Shopify, Kbox, Odoo, Boston, WMS Eflow, Simpli-Route, Bitúa, WMS Manhattan, Smartlog, Google, Oracle EPM',
  },
  costoPromedioFixIntegracion: {
    definition: 'Costo promedio de corregir un problema de integración (horas dev + downtime).',
  },
  
  // 1E. Costos Ocultos
  horasSemanaRedigitacion: {
    definition: 'Horas semanales que empleados pasan re-digitando datos entre sistemas.',
    example: 'Copiar datos de Excel a NAF, de NAF a otro sistema, etc.',
  },
  horasSemanaReconciliacion: {
    definition: 'Horas semanales reconciliando datos entre sistemas (inventario, contabilidad, etc.).',
  },
  diasCierreMensual: {
    definition: 'Días laborales que toma cerrar el mes contable.',
    example: 'Benchmark: empresas con ERP moderno cierran en 3-5 días.',
  },
  costoPromedioError: {
    definition: 'Costo promedio de corregir un error (tiempo + NC + retrabajo).',
    example: 'Incluye: tiempo de investigación, corrección, comunicación con cliente.',
  },
  erroresPorMes: {
    definition: 'Número promedio de errores/correcciones que requieren atención mensualmente.',
  },
  costoHoraOperacional: {
    definition: 'Costo por hora promedio del personal operativo (no IT).',
    formula: 'Salario promedio ÷ 160 hrs',
  },
  
  // 2A. Licencias NetSuite
  baseNetSuite: {
    definition: 'Costo base mensual de NetSuite Mid-Market Edition.',
    formula: 'Precio estándar de Oracle NetSuite',
  },
  oneWorld: {
    definition: 'Módulo para operaciones multi-país y multi-subsidiaria.',
    formula: 'Requerido para 7 países',
  },
  advancedInventory: {
    definition: 'Gestión avanzada de inventario (lotes, series, ubicaciones).',
    formula: 'Requerido para trazabilidad de dispositivos médicos',
  },
  fixedAssets: {
    definition: 'Módulo de gestión de activos fijos y depreciación.',
  },
  fullUsers: {
    definition: 'Usuarios con acceso completo a NetSuite (crear, editar, aprobar transacciones).',
    example: 'Contadores, compradores, gerentes, analistas.',
  },
  costoFullUser: {
    definition: 'Costo mensual por usuario Full.',
    formula: '$129/usuario/mes (precio Oct 2025)',
  },
  selfServiceUsers: {
    definition: 'Usuarios con acceso limitado (consultas, aprobaciones simples, timesheet).',
    example: 'Empleados que solo consultan o hacen tareas básicas.',
  },
  costoSelfService: {
    definition: 'Costo mensual por usuario Self-Service.',
    formula: '$49/usuario/mes (precio Oct 2025)',
  },
  
  // 2B. Soporte
  soporteAnualNetSuite: {
    definition: 'Costo anual de soporte con partner de NetSuite post-implementación.',
  },
  horasMesAdminNetSuite: {
    definition: 'Horas mensuales de administración interna de NetSuite.',
  },
  costoHoraAdminNetSuite: {
    definition: 'Costo por hora de un admin/desarrollador NetSuite.',
    example: 'Generalmente más alto que desarrolladores de sistemas legacy.',
  },
  
  // 3. Inversión
  implementacionMin: {
    definition: 'Rango mínimo del costo de implementación (consultoría, configuración, desarrollo).',
    formula: 'Basado en benchmarks de mercado para proyectos similares',
  },
  implementacionMax: {
    definition: 'Rango máximo del costo de implementación.',
  },
  trainingMin: {
    definition: 'Rango mínimo de capacitación y gestión del cambio.',
  },
  trainingMax: {
    definition: 'Rango máximo de capacitación.',
  },
  soporteAno1Min: {
    definition: 'Rango mínimo de soporte hypercare en el primer año.',
  },
  soporteAno1Max: {
    definition: 'Rango máximo de soporte año 1.',
  },
  contingenciaPct: {
    definition: 'Porcentaje adicional para imprevistos.',
    formula: 'Se aplica sobre el total de implementación + training + soporte',
    example: '15% es estándar para proyectos de esta complejidad.',
  },
  
  // 4A. Eficiencia
  horasSemanaAhorradas: {
    definition: 'Horas semanales que se ahorrarán al eliminar re-digitación y procesos manuales.',
    formula: 'Beneficio anual = horas × 52 semanas × costo/hora',
  },
  reduccionDiasCierre: {
    definition: 'Días que se reducirá el cierre mensual con NetSuite.',
    formula: 'Beneficio = días × 8 hrs × 12 meses × costo/hora',
    example: 'Si hoy cierran en 10 días y con NetSuite en 5, reducción = 5 días.',
  },
  horasMesAhorradasReportes: {
    definition: 'Horas mensuales ahorradas en generación de reportes (automáticos vs manuales).',
  },
  
  // 4B. Revenue Recovery
  perdidaComodatos: {
    definition: 'Ingresos perdidos anualmente por comodatos (equipos prestados) no trackeados o no facturados.',
    example: 'Equipos en cliente sin facturación de uso, equipos perdidos, etc.',
  },
  perdidaSTNoFacturado: {
    definition: 'Ingresos perdidos por servicios técnicos realizados pero no facturados.',
    example: 'Visitas, repuestos, horas de trabajo no registradas.',
  },
  perdidaShrinkage: {
    definition: 'Pérdidas por "shrinkage" de inventario (diferencias, pérdidas, obsolescencia no detectada).',
    formula: 'Diferencia entre inventario teórico y físico × costo',
  },
  pctRecuperableRevenue: {
    definition: 'Porcentaje de las pérdidas que se estima recuperar con mejor trazabilidad.',
    example: '50% es conservador. Algunos ERP recuperan hasta 80%.',
  },
  
  // 4C. Errores
  costoAnualCorrecciones: {
    definition: 'Costo anual total de correcciones, notas de crédito, retrabajos por errores.',
    formula: 'Incluye: tiempo, NC emitidas, devoluciones, penalidades.',
  },
  pctReduccionErrores: {
    definition: 'Porcentaje de reducción esperada en errores con un ERP integrado.',
    example: '60% es benchmark típico. Automatización elimina errores de digitación.',
  },
  
  // 4D. Working Capital
  cuentasPorCobrarPromedio: {
    definition: 'Saldo promedio de Cuentas por Cobrar (CxC o AR - Accounts Receivable).',
    formula: 'Promedio de los últimos 12 meses de CxC',
    example: 'Si CxC fluctúa entre $4M y $6M, promedio = $5M',
  },
  dsoActual: {
    definition: 'DSO = Days Sales Outstanding. Días promedio que tardas en cobrar a clientes.',
    formula: 'DSO = (CxC ÷ Ventas Anuales) × 365',
    example: 'DSO de 60 días significa que en promedio cobras a 2 meses.',
  },
  dsoObjetivo: {
    definition: 'DSO objetivo después de implementar NetSuite.',
    example: 'Reducción típica: 15-20%. Si DSO actual = 60, objetivo = 45-50.',
  },
  inventarioPromedio: {
    definition: 'Valor promedio del inventario durante el año.',
    formula: 'Promedio de los últimos 12 meses de inventario valorizado',
  },
  dioActual: {
    definition: 'DIO = Days Inventory Outstanding. Días promedio que el inventario permanece en bodega.',
    formula: 'DIO = (Inventario ÷ Costo de Ventas) × 365',
    example: 'DIO de 90 días significa que rotas inventario cada 3 meses.',
  },
  dioObjetivo: {
    definition: 'DIO objetivo con mejor gestión de inventario.',
    example: 'Reducción típica: 10-20%. Mayor rotación = menos capital atrapado.',
  },
  costoCapital: {
    definition: 'Costo de oportunidad del capital. Tasa que podrías ganar si ese dinero estuviera invertido.',
    formula: 'Beneficio WC = Capital Liberado × Costo de Capital',
    example: '8% es típico. Puede ser tasa de préstamo bancario o costo de equity.',
  },
  
  // 4E. Compliance
  costoPreparacionAuditorias: {
    definition: 'Costo anual de preparar documentación y atender auditorías (internas y externas).',
    formula: 'Incluye: horas de personal, honorarios de auditores adicionales, correcciones.',
  },
  multasEvitables: {
    definition: 'Multas o penalidades anuales que podrían evitarse con mejor cumplimiento.',
    example: 'Multas fiscales por errores, penalidades de clientes por incumplimiento.',
  },
  pctReduccionCompliance: {
    definition: 'Porcentaje de reducción esperada en costos de compliance.',
    example: 'NetSuite mejora audit trails y automatiza reportes regulatorios.',
  },
  
  // KPIs
  roi: {
    definition: 'ROI = Return on Investment. Retorno sobre la inversión.',
    formula: 'ROI = (Beneficio Total - Inversión) ÷ Inversión × 100%',
    example: 'ROI de 85% significa que por cada $1 invertido, recuperas $1.85',
  },
  payback: {
    definition: 'Período de recuperación. Tiempo para recuperar la inversión inicial.',
    formula: 'Payback = Inversión ÷ Beneficio Neto Anual',
    example: 'Payback de 2.5 años significa que en 2.5 años recuperas lo invertido.',
  },
  npv: {
    definition: 'NPV = Net Present Value. Valor presente neto de los flujos futuros.',
    formula: 'NPV = Suma de (Flujos Futuros) - Inversión Inicial',
    example: 'NPV positivo indica que el proyecto genera valor.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATOS INICIALES - Organizados por categoría
// ═══════════════════════════════════════════════════════════════════════════════

interface ModelData {
  // 1. COSTOS ACTUALES
  // 1A. Infraestructura & Licencias
  licenciasOracleDB: number;
  developerSuite: number;
  licenciasOAS: number;
  mantenimientoCW: number;
  awsRamanujan: number;
  awsNAF: number;
  awsAPEX: number;
  awsAPEXDB: number;
  quickSuite: number;
  
  // 1B. Personal IT
  numDevs: number | null;
  horasMesDev: number;
  costoHoraDev: number | null;
  numAdminsInfra: number | null;
  costoHoraAdminInfra: number | null;
  
  // 1C. Administración
  horasMesGestionProveedores: number | null;
  horasMesCoordinacionSistemas: number | null;
  horasMesTroubleshooting: number | null;
  costoHoraAdmin: number | null;
  
  // 1D. Integraciones
  horasMesMantenimientoIntegraciones: number | null;
  numIntegraciones: number;
  costoPromedioFixIntegracion: number | null;
  
  // 1E. Costos Ocultos
  horasSemanaRedigitacion: number | null;
  horasSemanaReconciliacion: number | null;
  diasCierreMensual: number | null;
  costoPromedioError: number | null;
  erroresPorMes: number | null;
  costoHoraOperacional: number;
  
  // 2. COSTOS NETSUITE
  // 2A. Licencias
  baseNetSuite: number;
  oneWorld: number;
  advancedInventory: number;
  fixedAssets: number;
  fullUsers: number;
  costoFullUser: number;
  selfServiceUsers: number;
  costoSelfService: number;
  
  // 2B. Soporte Ongoing
  soporteAnualNetSuite: number | null;
  horasMesAdminNetSuite: number | null;
  costoHoraAdminNetSuite: number | null;
  
  // 3. INVERSIÓN
  implementacionMin: number;
  implementacionMax: number;
  trainingMin: number;
  trainingMax: number;
  soporteAno1Min: number;
  soporteAno1Max: number;
  contingenciaPct: number;
  
  // 4. BENEFICIOS
  // 4A. Eficiencia Operacional
  horasSemanaAhorradas: number;
  reduccionDiasCierre: number | null;
  horasMesAhorradasReportes: number | null;
  
  // 4B. Revenue Recovery
  perdidaComodatos: number | null;
  perdidaSTNoFacturado: number | null;
  perdidaShrinkage: number | null;
  pctRecuperableRevenue: number;
  
  // 4C. Reducción Errores
  costoAnualCorrecciones: number;
  pctReduccionErrores: number;
  
  // 4D. Working Capital
  cuentasPorCobrarPromedio: number | null;
  dsoActual: number | null;
  dsoObjetivo: number | null;
  inventarioPromedio: number | null;
  dioActual: number | null;
  dioObjetivo: number | null;
  costoCapital: number;
  
  // 4E. Compliance
  costoPreparacionAuditorias: number;
  multasEvitables: number | null;
  pctReduccionCompliance: number;
  
  // Horizonte
  aniosAnalisis: number;
}

const initialData: ModelData = {
  // 1A. Infraestructura & Licencias (CONFIRMADOS)
  licenciasOracleDB: 9214,
  developerSuite: 1877,
  licenciasOAS: 9161,
  mantenimientoCW: 9500,
  awsRamanujan: 6600,
  awsNAF: 3600,
  awsAPEX: 5064,
  awsAPEXDB: 2400,
  quickSuite: 8136,
  
  // 1B. Personal IT (PARCIAL)
  numDevs: 2,
  horasMesDev: 160,
  costoHoraDev: 30,
  numAdminsInfra: 0.5,
  costoHoraAdminInfra: 25,
  
  // 1C. Administración (ESTIMADO)
  horasMesGestionProveedores: 8,
  horasMesCoordinacionSistemas: 20,
  horasMesTroubleshooting: 40,
  costoHoraAdmin: 20,
  
  // 1D. Integraciones (ESTIMADO)
  horasMesMantenimientoIntegraciones: 40,
  numIntegraciones: 11,
  costoPromedioFixIntegracion: 500,
  
  // 1E. Costos Ocultos (ESTIMADO)
  horasSemanaRedigitacion: 40,
  horasSemanaReconciliacion: 20,
  diasCierreMensual: 10,
  costoPromedioError: 200,
  erroresPorMes: 15,
  costoHoraOperacional: 15,
  
  // 2A. Licencias NetSuite (CONFIRMADO)
  baseNetSuite: 2500,
  oneWorld: 1500,
  advancedInventory: 500,
  fixedAssets: 300,
  fullUsers: 100,
  costoFullUser: 129,
  selfServiceUsers: 50,
  costoSelfService: 49,
  
  // 2B. Soporte Ongoing (ESTIMADO)
  soporteAnualNetSuite: 35000,
  horasMesAdminNetSuite: 40,
  costoHoraAdminNetSuite: 35,
  
  // 3. INVERSIÓN (RANGOS)
  implementacionMin: 550000,
  implementacionMax: 800000,
  trainingMin: 80000,
  trainingMax: 120000,
  soporteAno1Min: 60000,
  soporteAno1Max: 90000,
  contingenciaPct: 15,
  
  // 4A. Eficiencia Operacional (ESTIMADO)
  horasSemanaAhorradas: 40,
  reduccionDiasCierre: 5,
  horasMesAhorradasReportes: 40,
  
  // 4B. Revenue Recovery (ESTIMADO)
  perdidaComodatos: 100000,
  perdidaSTNoFacturado: 80000,
  perdidaShrinkage: 50000,
  pctRecuperableRevenue: 50,
  
  // 4C. Reducción Errores (ESTIMADO)
  costoAnualCorrecciones: 50000,
  pctReduccionErrores: 60,
  
  // 4D. Working Capital (TBD)
  cuentasPorCobrarPromedio: null,
  dsoActual: null,
  dsoObjetivo: null,
  inventarioPromedio: null,
  dioActual: null,
  dioObjetivo: null,
  costoCapital: 8,
  
  // 4E. Compliance (ESTIMADO)
  costoPreparacionAuditorias: 30000,
  multasEvitables: 10000,
  pctReduccionCompliance: 40,
  
  // Horizonte
  aniosAnalisis: 5,
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
// COMPONENTES
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: FieldStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function InputField({ 
  label, 
  value, 
  onChange, 
  status, 
  unit = 'currency',
  fieldKey,
  disabled = false 
}: { 
  label: string; 
  value: number | null; 
  onChange: (v: number | null) => void; 
  status: FieldStatus;
  unit?: 'currency' | 'hours' | 'days' | 'percent' | 'number';
  fieldKey?: string;
  disabled?: boolean;
}) {
  const prefix = unit === 'currency' ? '$' : '';
  const suffix = unit === 'hours' ? 'hrs' : unit === 'days' ? 'días' : unit === 'percent' ? '%' : '';
  const definition = fieldKey ? fieldDefinitions[fieldKey] : null;
  
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <Label className="text-xs text-muted-foreground truncate">{label}</Label>
          {definition && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3 h-3 text-muted-foreground/60 hover:text-primary cursor-help flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-3" side="top">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{definition.definition}</p>
                  {definition.formula && (
                    <div className="pt-1 border-t">
                      <p className="text-xs font-medium text-primary">Fórmula:</p>
                      <p className="text-xs font-mono bg-muted/50 px-1 rounded">{definition.formula}</p>
                    </div>
                  )}
                  {definition.example && (
                    <div className="pt-1 border-t">
                      <p className="text-xs font-medium text-amber-600">Ejemplo:</p>
                      <p className="text-xs text-muted-foreground">{definition.example}</p>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-xs text-muted-foreground">{prefix}</span>}
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            className="h-8 text-sm"
            disabled={disabled}
          />
          {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}

function Section({ 
  title, 
  icon: Icon, 
  children, 
  total,
  defaultOpen = false,
  variant = 'default'
}: { 
  title: string; 
  icon: typeof Server; 
  children: React.ReactNode; 
  total?: number;
  defaultOpen?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const variantStyles = {
    default: 'border-border',
    success: 'border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20',
    warning: 'border-amber-200 bg-amber-50/30 dark:bg-amber-950/20',
    danger: 'border-red-200 bg-red-50/30 dark:bg-red-950/20',
  };
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={variantStyles[variant]}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Icon className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">{title}</CardTitle>
              </div>
              {total !== undefined && (
                <span className="text-lg font-bold text-primary">{formatMoney(total)}/año</span>
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function KPICard({ 
  label, 
  value, 
  subvalue,
  icon: Icon,
  variant = 'default',
  definitionKey
}: { 
  label: string; 
  value: string; 
  subvalue?: string;
  icon: typeof DollarSign;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  definitionKey?: string;
}) {
  const variants = {
    default: 'border-border',
    success: 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30',
    warning: 'border-amber-200 bg-amber-50 dark:bg-amber-950/30',
    danger: 'border-red-200 bg-red-50 dark:bg-red-950/30',
  };
  
  const textVariants = {
    default: 'text-foreground',
    success: 'text-emerald-700 dark:text-emerald-300',
    warning: 'text-amber-700 dark:text-amber-300',
    danger: 'text-red-700 dark:text-red-300',
  };

  const definition = definitionKey ? fieldDefinitions[definitionKey] : null;
  
  return (
    <Card className={variants[variant]}>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-4 h-4 ${textVariants[variant]}`} />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
          {definition && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground/50 hover:text-primary cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-3" side="bottom">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{definition.definition}</p>
                  {definition.formula && (
                    <div className="pt-1 border-t">
                      <p className="text-xs font-medium text-primary">Fórmula:</p>
                      <p className="text-xs font-mono bg-muted/50 px-1 rounded">{definition.formula}</p>
                    </div>
                  )}
                  {definition.example && (
                    <div className="pt-1 border-t">
                      <p className="text-xs font-medium text-amber-600">Ejemplo:</p>
                      <p className="text-xs text-muted-foreground">{definition.example}</p>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className={`text-2xl font-bold ${textVariants[variant]}`}>{value}</p>
        {subvalue && <p className="text-xs text-muted-foreground mt-0.5">{subvalue}</p>}
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ModeloROI() {
  const [data, setData] = useState<ModelData>(initialData);
  
  const updateField = <K extends keyof ModelData>(key: K, value: ModelData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // CÁLCULOS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const calculations = useMemo(() => {
    // 1. COSTOS ACTUALES
    const infraLicencias = 
      data.licenciasOracleDB + data.developerSuite + data.licenciasOAS +
      data.mantenimientoCW + data.awsRamanujan + data.awsNAF +
      data.awsAPEX + data.awsAPEXDB + data.quickSuite;
    
    const personalIT = 
      ((data.numDevs ?? 0) * data.horasMesDev * 12 * (data.costoHoraDev ?? 0)) +
      ((data.numAdminsInfra ?? 0) * data.horasMesDev * 12 * (data.costoHoraAdminInfra ?? 0));
    
    const administracion = 
      (((data.horasMesGestionProveedores ?? 0) + 
        (data.horasMesCoordinacionSistemas ?? 0) + 
        (data.horasMesTroubleshooting ?? 0)) * 12 * (data.costoHoraAdmin ?? 0));
    
    const integraciones = 
      ((data.horasMesMantenimientoIntegraciones ?? 0) * 12 * (data.costoHoraDev ?? 0)) +
      ((data.costoPromedioFixIntegracion ?? 0) * 12); // 1 fix por mes
    
    const costosOcultos = 
      (((data.horasSemanaRedigitacion ?? 0) + (data.horasSemanaReconciliacion ?? 0)) * 52 * data.costoHoraOperacional) +
      ((data.costoPromedioError ?? 0) * (data.erroresPorMes ?? 0) * 12);
    
    const totalCostosActuales = infraLicencias + personalIT + administracion + integraciones + costosOcultos;
    
    // 2. COSTOS NETSUITE
    const licenciasNetSuiteMes = 
      data.baseNetSuite + data.oneWorld + data.advancedInventory + data.fixedAssets +
      (data.fullUsers * data.costoFullUser) + (data.selfServiceUsers * data.costoSelfService);
    const licenciasNetSuiteAnual = licenciasNetSuiteMes * 12;
    
    const soporteOngoing = 
      (data.soporteAnualNetSuite ?? 0) +
      ((data.horasMesAdminNetSuite ?? 0) * 12 * (data.costoHoraAdminNetSuite ?? 0));
    
    const totalCostosNetSuiteAnual = licenciasNetSuiteAnual + soporteOngoing;
    
    // 3. INVERSIÓN
    const implementacionMid = (data.implementacionMin + data.implementacionMax) / 2;
    const trainingMid = (data.trainingMin + data.trainingMax) / 2;
    const soporteAno1Mid = (data.soporteAno1Min + data.soporteAno1Max) / 2;
    const subtotalInversion = implementacionMid + trainingMid + soporteAno1Mid;
    const contingencia = subtotalInversion * (data.contingenciaPct / 100);
    const totalInversion = subtotalInversion + contingencia + licenciasNetSuiteAnual;
    
    // 4. BENEFICIOS ANUALES
    const eficienciaOperacional = 
      (data.horasSemanaAhorradas * 52 * data.costoHoraOperacional) +
      ((data.reduccionDiasCierre ?? 0) * 8 * 12 * data.costoHoraOperacional) +
      ((data.horasMesAhorradasReportes ?? 0) * 12 * data.costoHoraOperacional);
    
    const totalRevenueLost = (data.perdidaComodatos ?? 0) + (data.perdidaSTNoFacturado ?? 0) + (data.perdidaShrinkage ?? 0);
    const revenueRecovery = totalRevenueLost * (data.pctRecuperableRevenue / 100);
    
    const reduccionErrores = data.costoAnualCorrecciones * (data.pctReduccionErrores / 100);
    
    // Working Capital (si hay datos)
    let workingCapitalBenefit = 0;
    if (data.cuentasPorCobrarPromedio && data.dsoActual && data.dsoObjetivo) {
      const reduccionAR = data.cuentasPorCobrarPromedio * ((data.dsoActual - data.dsoObjetivo) / data.dsoActual);
      workingCapitalBenefit += reduccionAR * (data.costoCapital / 100);
    }
    if (data.inventarioPromedio && data.dioActual && data.dioObjetivo) {
      const reduccionInv = data.inventarioPromedio * ((data.dioActual - data.dioObjetivo) / data.dioActual);
      workingCapitalBenefit += reduccionInv * (data.costoCapital / 100);
    }
    
    const complianceBenefit = 
      (data.costoPreparacionAuditorias + (data.multasEvitables ?? 0)) * (data.pctReduccionCompliance / 100);
    
    const totalBeneficiosAnuales = 
      eficienciaOperacional + revenueRecovery + reduccionErrores + workingCapitalBenefit + complianceBenefit;
    
    // AHORRO DE COSTOS (Sistema actual - NetSuite ongoing)
    const ahorroCostosAnual = totalCostosActuales - totalCostosNetSuiteAnual;
    
    // BENEFICIO NETO ANUAL (desde año 2)
    const beneficioNetoAnual = totalBeneficiosAnuales + ahorroCostosAnual;
    
    // ROI CALCULATION
    // Año 1: Inversión + costos NS - beneficios parciales (25%)
    // Año 2+: Costos NS - beneficios totales
    
    const flujoAno0 = -totalInversion;
    const flujoAno1 = -totalCostosNetSuiteAnual + (totalBeneficiosAnuales * 0.25);
    const flujoAno2Plus = beneficioNetoAnual;
    
    // NPV (sin descuento para simplificar)
    const npv = flujoAno0 + flujoAno1 + (flujoAno2Plus * (data.aniosAnalisis - 1));
    
    // ROI = (Beneficio Total - Inversión) / Inversión
    const beneficioTotal = (flujoAno1 > 0 ? flujoAno1 : 0) + (flujoAno2Plus * (data.aniosAnalisis - 1));
    const roi = totalInversion > 0 ? ((beneficioTotal - totalInversion) / totalInversion) * 100 : 0;
    
    // Payback
    const paybackPeriod = beneficioNetoAnual > 0 ? totalInversion / beneficioNetoAnual : Infinity;
    
    // TCO Comparison (5 años)
    const tcoActual5Anos = totalCostosActuales * data.aniosAnalisis;
    const tcoNetSuite5Anos = totalInversion + (totalCostosNetSuiteAnual * (data.aniosAnalisis - 1));
    const beneficios5Anos = (totalBeneficiosAnuales * 0.25) + (totalBeneficiosAnuales * (data.aniosAnalisis - 1));
    const tcoNetSuiteNeto5Anos = tcoNetSuite5Anos - beneficios5Anos;
    
    return {
      // Costos Actuales
      infraLicencias,
      personalIT,
      administracion,
      integraciones,
      costosOcultos,
      totalCostosActuales,
      
      // Costos NetSuite
      licenciasNetSuiteMes,
      licenciasNetSuiteAnual,
      soporteOngoing,
      totalCostosNetSuiteAnual,
      
      // Inversión
      implementacionMid,
      trainingMid,
      soporteAno1Mid,
      contingencia,
      totalInversion,
      
      // Beneficios
      eficienciaOperacional,
      revenueRecovery,
      reduccionErrores,
      workingCapitalBenefit,
      complianceBenefit,
      totalBeneficiosAnuales,
      
      // Ahorro
      ahorroCostosAnual,
      beneficioNetoAnual,
      
      // KPIs
      roi,
      paybackPeriod,
      npv,
      
      // TCO 5 años
      tcoActual5Anos,
      tcoNetSuite5Anos,
      beneficios5Anos,
      tcoNetSuiteNeto5Anos,
    };
  }, [data]);

  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-slate-50/50 to-gray-50/30 dark:via-slate-950/30 dark:to-gray-950/20">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/erp">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Módulo ERP
                </Button>
              </Link>
              <div className="text-right">
                <h1 className="text-lg font-bold">Modelo ROI</h1>
                <p className="text-xs text-muted-foreground">NAF → NetSuite • {formattedDate}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* EXECUTIVE SUMMARY */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Executive Summary</p>
                <h2 className="text-xl font-bold">Métricas Clave del Proyecto</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Confirmado</span>
                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500" /> Estimado</span>
                <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Requerido</span>
              </div>
            </div>
            
            {/* KPI Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <KPICard 
                label="ROI" 
                value={`${calculations.roi.toFixed(0)}%`}
                subvalue={`a ${data.aniosAnalisis} años`}
                icon={Percent}
                variant={calculations.roi > 50 ? 'success' : calculations.roi > 0 ? 'warning' : 'danger'}
                definitionKey="roi"
              />
              <KPICard 
                label="Payback" 
                value={calculations.paybackPeriod === Infinity ? '∞' : `${calculations.paybackPeriod.toFixed(1)} años`}
                icon={Clock}
                variant={calculations.paybackPeriod <= 3 ? 'success' : calculations.paybackPeriod <= 5 ? 'warning' : 'danger'}
                definitionKey="payback"
              />
              <KPICard 
                label="NPV" 
                value={formatMoneyK(calculations.npv)}
                subvalue={`a ${data.aniosAnalisis} años`}
                icon={TrendingUp}
                variant={calculations.npv > 0 ? 'success' : 'danger'}
                definitionKey="npv"
              />
              <KPICard 
                label="Beneficio Anual" 
                value={formatMoneyK(calculations.beneficioNetoAnual)}
                subvalue="desde año 2"
                icon={DollarSign}
                variant="success"
              />
              <KPICard 
                label="Inversión Total" 
                value={formatMoneyK(calculations.totalInversion)}
                subvalue="año 1"
                icon={Calculator}
                variant="default"
              />
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* TCO COMPARISON */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          
          <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Comparación TCO a {data.aniosAnalisis} años
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200">
                  <p className="text-xs font-medium text-red-600 mb-1">MANTENER NAF + APEX</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{formatMoneyK(calculations.tcoActual5Anos)}</p>
                  <p className="text-xs text-red-600/70">{formatMoneyK(calculations.totalCostosActuales)}/año × {data.aniosAnalisis}</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200">
                  <p className="text-xs font-medium text-emerald-600 mb-1">MIGRAR A NETSUITE (neto)</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatMoneyK(calculations.tcoNetSuiteNeto5Anos)}</p>
                  <p className="text-xs text-emerald-600/70">TCO - beneficios</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                  <p className="text-xs font-medium text-blue-600 mb-1">DIFERENCIA</p>
                  <p className={`text-2xl font-bold ${calculations.tcoActual5Anos - calculations.tcoNetSuiteNeto5Anos > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {calculations.tcoActual5Anos - calculations.tcoNetSuiteNeto5Anos > 0 ? '+' : ''}
                    {formatMoneyK(calculations.tcoActual5Anos - calculations.tcoNetSuiteNeto5Anos)}
                  </p>
                  <p className="text-xs text-blue-600/70">ahorro con NetSuite</p>
                </div>
              </div>
              
              {/* Horizonte */}
              <div className="mt-4 pt-4 border-t flex items-center gap-4">
                <Label className="text-sm">Horizonte de análisis:</Label>
                <Input
                  type="number"
                  value={data.aniosAnalisis}
                  onChange={(e) => updateField('aniosAnalisis', Number(e.target.value) || 5)}
                  className="w-20 h-8"
                  min={1}
                  max={10}
                />
                <span className="text-sm text-muted-foreground">años</span>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* DRIVERS DE VALOR */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Drivers de Valor (Beneficios Anuales)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Eficiencia Operacional', value: calculations.eficienciaOperacional, color: 'bg-blue-500' },
                { label: 'Revenue Recovery', value: calculations.revenueRecovery, color: 'bg-emerald-500' },
                { label: 'Reducción de Errores', value: calculations.reduccionErrores, color: 'bg-amber-500' },
                { label: 'Working Capital', value: calculations.workingCapitalBenefit, color: 'bg-purple-500' },
                { label: 'Compliance & Auditoría', value: calculations.complianceBenefit, color: 'bg-violet-500' },
              ].sort((a, b) => b.value - a.value).map((driver) => {
                const pct = calculations.totalBeneficiosAnuales > 0 
                  ? (driver.value / calculations.totalBeneficiosAnuales) * 100 
                  : 0;
                return (
                  <div key={driver.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{driver.label}</span>
                      <span className="font-medium">{formatMoneyK(driver.value)}/año ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${driver.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t flex items-center justify-between font-semibold">
                <span>Total Beneficios Anuales</span>
                <span className="text-emerald-600">{formatMoney(calculations.totalBeneficiosAnuales)}</span>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* SECCIONES DETALLADAS (Colapsables) */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalle de Variables
            </h3>
            
            {/* 1. COSTOS ACTUALES */}
            <Section 
              title="1. Costos Actuales (TCO NAF + APEX)" 
              icon={Server}
              total={calculations.totalCostosActuales}
              defaultOpen={true}
              variant="danger"
            >
              <div className="space-y-6">
                {/* 1A. Infraestructura */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">1A. Infraestructura & Licencias</h4>
                    <span className="text-sm font-semibold">{formatMoney(calculations.infraLicencias)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="Licencias Oracle DB" value={data.licenciasOracleDB} onChange={(v) => updateField('licenciasOracleDB', v ?? 0)} status="confirmed" fieldKey="licenciasOracleDB" />
                    <InputField label="Developer Suite" value={data.developerSuite} onChange={(v) => updateField('developerSuite', v ?? 0)} status="confirmed" fieldKey="developerSuite" />
                    <InputField label="Licencias OAS" value={data.licenciasOAS} onChange={(v) => updateField('licenciasOAS', v ?? 0)} status="confirmed" fieldKey="licenciasOAS" />
                    <InputField label="Mantenimiento C&W" value={data.mantenimientoCW} onChange={(v) => updateField('mantenimientoCW', v ?? 0)} status="confirmed" fieldKey="mantenimientoCW" />
                    <InputField label="AWS Ramanujan" value={data.awsRamanujan} onChange={(v) => updateField('awsRamanujan', v ?? 0)} status="confirmed" fieldKey="awsRamanujan" />
                    <InputField label="AWS NAF" value={data.awsNAF} onChange={(v) => updateField('awsNAF', v ?? 0)} status="confirmed" fieldKey="awsNAF" />
                    <InputField label="AWS APEX" value={data.awsAPEX} onChange={(v) => updateField('awsAPEX', v ?? 0)} status="confirmed" fieldKey="awsAPEX" />
                    <InputField label="AWS APEX DB" value={data.awsAPEXDB} onChange={(v) => updateField('awsAPEXDB', v ?? 0)} status="confirmed" fieldKey="awsAPEXDB" />
                    <InputField label="QuickSuite" value={data.quickSuite} onChange={(v) => updateField('quickSuite', v ?? 0)} status="confirmed" fieldKey="quickSuite" />
                  </div>
                </div>
                
                {/* 1B. Personal IT */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">1B. Personal IT</h4>
                    <span className="text-sm font-semibold">{formatMoney(calculations.personalIT)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="# Desarrolladores NAF/APEX" value={data.numDevs} onChange={(v) => updateField('numDevs', v)} status="estimated" unit="number" fieldKey="numDevs" />
                    <InputField label="Horas/mes por dev" value={data.horasMesDev} onChange={(v) => updateField('horasMesDev', v ?? 0)} status="confirmed" unit="hours" fieldKey="horasMesDev" />
                    <InputField label="Costo/hora dev" value={data.costoHoraDev} onChange={(v) => updateField('costoHoraDev', v)} status="estimated" fieldKey="costoHoraDev" />
                    <InputField label="# Admins Infra (FTE)" value={data.numAdminsInfra} onChange={(v) => updateField('numAdminsInfra', v)} status="estimated" unit="number" fieldKey="numAdminsInfra" />
                    <InputField label="Costo/hora admin infra" value={data.costoHoraAdminInfra} onChange={(v) => updateField('costoHoraAdminInfra', v)} status="estimated" fieldKey="costoHoraAdminInfra" />
                  </div>
                </div>
                
                {/* 1C. Administración */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">1C. Administración & Gestión</h4>
                    <span className="text-sm font-semibold">{formatMoney(calculations.administracion)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="Hrs/mes gestión proveedores" value={data.horasMesGestionProveedores} onChange={(v) => updateField('horasMesGestionProveedores', v)} status="estimated" unit="hours" fieldKey="horasMesGestionProveedores" />
                    <InputField label="Hrs/mes coordinación sistemas" value={data.horasMesCoordinacionSistemas} onChange={(v) => updateField('horasMesCoordinacionSistemas', v)} status="estimated" unit="hours" fieldKey="horasMesCoordinacionSistemas" />
                    <InputField label="Hrs/mes troubleshooting" value={data.horasMesTroubleshooting} onChange={(v) => updateField('horasMesTroubleshooting', v)} status="estimated" unit="hours" fieldKey="horasMesTroubleshooting" />
                    <InputField label="Costo/hora admin" value={data.costoHoraAdmin} onChange={(v) => updateField('costoHoraAdmin', v)} status="estimated" fieldKey="costoHoraAdmin" />
                  </div>
                </div>
                
                {/* 1D. Integraciones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">1D. Mantenimiento Integraciones</h4>
                    <span className="text-sm font-semibold">{formatMoney(calculations.integraciones)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="Hrs/mes mantenimiento integraciones" value={data.horasMesMantenimientoIntegraciones} onChange={(v) => updateField('horasMesMantenimientoIntegraciones', v)} status="estimated" unit="hours" fieldKey="horasMesMantenimientoIntegraciones" />
                    <InputField label="# Integraciones críticas" value={data.numIntegraciones} onChange={(v) => updateField('numIntegraciones', v ?? 0)} status="confirmed" unit="number" fieldKey="numIntegraciones" />
                    <InputField label="Costo promedio fix/cambio" value={data.costoPromedioFixIntegracion} onChange={(v) => updateField('costoPromedioFixIntegracion', v)} status="estimated" fieldKey="costoPromedioFixIntegracion" />
                  </div>
                </div>
                
                {/* 1E. Costos Ocultos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">1E. Costos Ocultos Operacionales</h4>
                    <span className="text-sm font-semibold">{formatMoney(calculations.costosOcultos)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="Hrs/semana re-digitación" value={data.horasSemanaRedigitacion} onChange={(v) => updateField('horasSemanaRedigitacion', v)} status="estimated" unit="hours" fieldKey="horasSemanaRedigitacion" />
                    <InputField label="Hrs/semana reconciliación manual" value={data.horasSemanaReconciliacion} onChange={(v) => updateField('horasSemanaReconciliacion', v)} status="estimated" unit="hours" fieldKey="horasSemanaReconciliacion" />
                    <InputField label="Días cierre mensual actual" value={data.diasCierreMensual} onChange={(v) => updateField('diasCierreMensual', v)} status="estimated" unit="days" fieldKey="diasCierreMensual" />
                    <InputField label="Costo promedio por error" value={data.costoPromedioError} onChange={(v) => updateField('costoPromedioError', v)} status="estimated" fieldKey="costoPromedioError" />
                    <InputField label="# Errores por mes" value={data.erroresPorMes} onChange={(v) => updateField('erroresPorMes', v)} status="estimated" unit="number" fieldKey="erroresPorMes" />
                    <InputField label="Costo/hora operacional" value={data.costoHoraOperacional} onChange={(v) => updateField('costoHoraOperacional', v ?? 0)} status="estimated" fieldKey="costoHoraOperacional" />
                  </div>
                </div>
              </div>
            </Section>

            {/* 2. COSTOS NETSUITE */}
            <Section 
              title="2. Costos NetSuite (TCO Futuro)" 
              icon={Package}
              total={calculations.totalCostosNetSuiteAnual}
              variant="success"
            >
              <div className="space-y-6">
                {/* 2A. Licencias */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">2A. Licencias NetSuite</h4>
                    <span className="text-sm font-semibold">{formatMoney(calculations.licenciasNetSuiteAnual)}/año</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <InputField label="Base NetSuite/mes" value={data.baseNetSuite} onChange={(v) => updateField('baseNetSuite', v ?? 0)} status="confirmed" fieldKey="baseNetSuite" />
                    <InputField label="OneWorld/mes" value={data.oneWorld} onChange={(v) => updateField('oneWorld', v ?? 0)} status="confirmed" fieldKey="oneWorld" />
                    <InputField label="Adv. Inventory/mes" value={data.advancedInventory} onChange={(v) => updateField('advancedInventory', v ?? 0)} status="confirmed" fieldKey="advancedInventory" />
                    <InputField label="Fixed Assets/mes" value={data.fixedAssets} onChange={(v) => updateField('fixedAssets', v ?? 0)} status="confirmed" fieldKey="fixedAssets" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <InputField label="Full Users" value={data.fullUsers} onChange={(v) => updateField('fullUsers', v ?? 0)} status="estimated" unit="number" fieldKey="fullUsers" />
                    <InputField label="Costo Full User/mes" value={data.costoFullUser} onChange={(v) => updateField('costoFullUser', v ?? 0)} status="confirmed" fieldKey="costoFullUser" />
                    <InputField label="Self-Service Users" value={data.selfServiceUsers} onChange={(v) => updateField('selfServiceUsers', v ?? 0)} status="estimated" unit="number" fieldKey="selfServiceUsers" />
                    <InputField label="Costo Self-Service/mes" value={data.costoSelfService} onChange={(v) => updateField('costoSelfService', v ?? 0)} status="confirmed" fieldKey="costoSelfService" />
                  </div>
                  <div className="p-2 rounded bg-muted/50 text-sm">
                    Costo mensual licencias: <strong>{formatMoney(calculations.licenciasNetSuiteMes)}</strong>
                  </div>
                </div>
                
                {/* 2B. Soporte */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">2B. Soporte Ongoing (Año 2+)</h4>
                    <span className="text-sm font-semibold">{formatMoney(calculations.soporteOngoing)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="Soporte NetSuite anual" value={data.soporteAnualNetSuite} onChange={(v) => updateField('soporteAnualNetSuite', v)} status="estimated" fieldKey="soporteAnualNetSuite" />
                    <InputField label="Hrs/mes admin interno NS" value={data.horasMesAdminNetSuite} onChange={(v) => updateField('horasMesAdminNetSuite', v)} status="estimated" unit="hours" fieldKey="horasMesAdminNetSuite" />
                    <InputField label="Costo/hora admin NS" value={data.costoHoraAdminNetSuite} onChange={(v) => updateField('costoHoraAdminNetSuite', v)} status="estimated" fieldKey="costoHoraAdminNetSuite" />
                  </div>
                </div>
              </div>
            </Section>

            {/* 3. INVERSIÓN */}
            <Section 
              title="3. Inversión (Implementación)" 
              icon={Wallet}
              total={calculations.totalInversion}
              variant="warning"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Rangos basados en benchmarks de mercado para proyectos similares (7 países, 11 integraciones).
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Implementación</h4>
                    <div className="grid gap-3 grid-cols-2">
                      <InputField label="Mínimo" value={data.implementacionMin} onChange={(v) => updateField('implementacionMin', v ?? 0)} status="estimated" fieldKey="implementacionMin" />
                      <InputField label="Máximo" value={data.implementacionMax} onChange={(v) => updateField('implementacionMax', v ?? 0)} status="estimated" fieldKey="implementacionMax" />
                    </div>
                    <p className="text-xs text-muted-foreground">Punto medio: {formatMoney(calculations.implementacionMid)}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Training & Change Management</h4>
                    <div className="grid gap-3 grid-cols-2">
                      <InputField label="Mínimo" value={data.trainingMin} onChange={(v) => updateField('trainingMin', v ?? 0)} status="estimated" fieldKey="trainingMin" />
                      <InputField label="Máximo" value={data.trainingMax} onChange={(v) => updateField('trainingMax', v ?? 0)} status="estimated" fieldKey="trainingMax" />
                    </div>
                    <p className="text-xs text-muted-foreground">Punto medio: {formatMoney(calculations.trainingMid)}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Soporte Año 1 (Hypercare)</h4>
                    <div className="grid gap-3 grid-cols-2">
                      <InputField label="Mínimo" value={data.soporteAno1Min} onChange={(v) => updateField('soporteAno1Min', v ?? 0)} status="estimated" fieldKey="soporteAno1Min" />
                      <InputField label="Máximo" value={data.soporteAno1Max} onChange={(v) => updateField('soporteAno1Max', v ?? 0)} status="estimated" fieldKey="soporteAno1Max" />
                    </div>
                    <p className="text-xs text-muted-foreground">Punto medio: {formatMoney(calculations.soporteAno1Mid)}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Contingencia</h4>
                    <InputField label="% Contingencia" value={data.contingenciaPct} onChange={(v) => updateField('contingenciaPct', v ?? 0)} status="estimated" unit="percent" fieldKey="contingenciaPct" />
                    <p className="text-xs text-muted-foreground">Monto: {formatMoney(calculations.contingencia)}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Inversión Total Año 1: <strong>{formatMoney(calculations.totalInversion)}</strong>
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Incluye implementación + training + soporte año 1 + licencias año 1 + contingencia
                  </p>
                </div>
              </div>
            </Section>

            {/* 4. BENEFICIOS */}
            <Section 
              title="4. Beneficios Anuales" 
              icon={TrendingUp}
              total={calculations.totalBeneficiosAnuales}
              variant="success"
            >
              <div className="space-y-6">
                {/* 4A. Eficiencia */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">4A. Eficiencia Operacional</h4>
                    <span className="text-sm font-semibold text-emerald-600">{formatMoney(calculations.eficienciaOperacional)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="Hrs/semana ahorradas (re-digitación)" value={data.horasSemanaAhorradas} onChange={(v) => updateField('horasSemanaAhorradas', v ?? 0)} status="estimated" unit="hours" fieldKey="horasSemanaAhorradas" />
                    <InputField label="Reducción días cierre" value={data.reduccionDiasCierre} onChange={(v) => updateField('reduccionDiasCierre', v)} status="estimated" unit="days" fieldKey="reduccionDiasCierre" />
                    <InputField label="Hrs/mes ahorradas reportes" value={data.horasMesAhorradasReportes} onChange={(v) => updateField('horasMesAhorradasReportes', v)} status="estimated" unit="hours" fieldKey="horasMesAhorradasReportes" />
                  </div>
                </div>
                
                {/* 4B. Revenue Recovery */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">4B. Revenue Recovery</h4>
                    <span className="text-sm font-semibold text-emerald-600">{formatMoney(calculations.revenueRecovery)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <InputField label="Pérdida comodatos no tracked" value={data.perdidaComodatos} onChange={(v) => updateField('perdidaComodatos', v)} status="estimated" fieldKey="perdidaComodatos" />
                    <InputField label="Pérdida ST no facturado" value={data.perdidaSTNoFacturado} onChange={(v) => updateField('perdidaSTNoFacturado', v)} status="estimated" fieldKey="perdidaSTNoFacturado" />
                    <InputField label="Pérdida shrinkage inventario" value={data.perdidaShrinkage} onChange={(v) => updateField('perdidaShrinkage', v)} status="estimated" fieldKey="perdidaShrinkage" />
                    <InputField label="% Recuperable" value={data.pctRecuperableRevenue} onChange={(v) => updateField('pctRecuperableRevenue', v ?? 0)} status="estimated" unit="percent" fieldKey="pctRecuperableRevenue" />
                  </div>
                </div>
                
                {/* 4C. Reducción Errores */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">4C. Reducción de Errores</h4>
                    <span className="text-sm font-semibold text-emerald-600">{formatMoney(calculations.reduccionErrores)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InputField label="Costo anual correcciones/NC" value={data.costoAnualCorrecciones} onChange={(v) => updateField('costoAnualCorrecciones', v ?? 0)} status="estimated" fieldKey="costoAnualCorrecciones" />
                    <InputField label="% Reducción esperada" value={data.pctReduccionErrores} onChange={(v) => updateField('pctReduccionErrores', v ?? 0)} status="estimated" unit="percent" fieldKey="pctReduccionErrores" />
                  </div>
                </div>
                
                {/* 4D. Working Capital */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">4D. Working Capital</h4>
                    <span className="text-sm font-semibold text-emerald-600">{formatMoney(calculations.workingCapitalBenefit)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="CxC promedio" value={data.cuentasPorCobrarPromedio} onChange={(v) => updateField('cuentasPorCobrarPromedio', v)} status="required" fieldKey="cuentasPorCobrarPromedio" />
                    <InputField label="DSO actual" value={data.dsoActual} onChange={(v) => updateField('dsoActual', v)} status="required" unit="days" fieldKey="dsoActual" />
                    <InputField label="DSO objetivo" value={data.dsoObjetivo} onChange={(v) => updateField('dsoObjetivo', v)} status="required" unit="days" fieldKey="dsoObjetivo" />
                    <InputField label="Inventario promedio" value={data.inventarioPromedio} onChange={(v) => updateField('inventarioPromedio', v)} status="required" fieldKey="inventarioPromedio" />
                    <InputField label="DIO actual" value={data.dioActual} onChange={(v) => updateField('dioActual', v)} status="required" unit="days" fieldKey="dioActual" />
                    <InputField label="DIO objetivo" value={data.dioObjetivo} onChange={(v) => updateField('dioObjetivo', v)} status="required" unit="days" fieldKey="dioObjetivo" />
                  </div>
                  <InputField label="Costo de capital (%)" value={data.costoCapital} onChange={(v) => updateField('costoCapital', v ?? 0)} status="estimated" unit="percent" fieldKey="costoCapital" />
                </div>
                
                {/* 4E. Compliance */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">4E. Compliance & Auditoría</h4>
                    <span className="text-sm font-semibold text-emerald-600">{formatMoney(calculations.complianceBenefit)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField label="Costo preparación auditorías" value={data.costoPreparacionAuditorias} onChange={(v) => updateField('costoPreparacionAuditorias', v ?? 0)} status="estimated" fieldKey="costoPreparacionAuditorias" />
                    <InputField label="Multas evitables" value={data.multasEvitables} onChange={(v) => updateField('multasEvitables', v)} status="estimated" fieldKey="multasEvitables" />
                    <InputField label="% Reducción esperada" value={data.pctReduccionCompliance} onChange={(v) => updateField('pctReduccionCompliance', v ?? 0)} status="estimated" unit="percent" fieldKey="pctReduccionCompliance" />
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* FOOTER */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          
          <div className="flex justify-between pt-6 border-t">
            <Link href="/erp">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver a ERP
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link href="/erp/mapeo-modulos">
                <Button variant="outline" size="sm">
                  Mapeo de Módulos
                </Button>
              </Link>
              <Link href="/erp/resumen-decisiones">
                <Button size="sm">
                  Resumen Decisiones
                </Button>
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-xs text-muted-foreground pb-6">
            <p>
              Este modelo es una herramienta de estimación. Los valores marcados como "Estimado" requieren validación.
              Las cifras finales dependerán de las cotizaciones de los partners de implementación.
            </p>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

