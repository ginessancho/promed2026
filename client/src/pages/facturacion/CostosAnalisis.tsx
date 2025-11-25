import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  ArrowLeft,
  ClipboardList,
  DollarSign,
  LineChart,
  Repeat,
  ShieldCheck,
  Target,
  Timer,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import MermaidDiagram from "@/components/MermaidDiagram";
import { asIsDiagram, purchaseOrderDiagram } from "@/data/diagrams";

const HOURS_PER_MONTH = 160;
const MIGRATION_WINDOW = "30 de mayo → 18 de octubre";

const currency0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currency2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatMoney = (value: number, digits: 0 | 2 = 0) =>
  digits === 2 ? currency2.format(value) : currency0.format(value);

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const manualStageBlueprint = [
  {
    concept: "Cotización + F-007",
    owners: "KAM + Especialista",
    minutes: 50,
    pain: "Datos replicados 3 veces; condiciones especiales quedan en correos.",
  },
  {
    concept: "Revisión especialista",
    owners: "Especialista",
    minutes: 30,
    pain: "Cruces manuales contra listas de precio y combos.",
  },
  {
    concept: "Carga manual en Odoo",
    owners: "Admins Panamá",
    minutes: 40,
    pain: "Duplican información ya aprobada en F-007.",
  },
  {
    concept: "Control y SLA de facturación",
    owners: "Sale support / KAM",
    minutes: 25,
    pain: "Correos y hojas de cálculo para perseguir aprobaciones.",
  },
  {
    concept: "Digitación en NAF",
    owners: "Admins resto / Shared services",
    minutes: 35,
    pain: "No existe integración directa; se llenan 4 pantallas por factura.",
  },
];

const defaultAssumptions = {
  baseSalary: 1_500,
  kamCount: 14,
  adminsPanamaCount: 10,
  adminsRestCount: 6,
  supervisorsCount: 2,
  leadersCount: 1,
  ordersPerAdmin: 60,
  supportHours: 12,
  supportRate: 45,
  penaltyMonthly: 1_200,
  opportunityCost: 8_000,
  odooUsers: 222,
  migrationCost: 8_500,
  reprocessRate: 0.31,
  reprocessMinutes: 65,
  f007Rate: 0.22,
  f007Minutes: 50,
  invoiceLeadTimeCurrent: 3, // días desde aprobación a factura hoy
  invoiceLeadTimeFuture: 1, // días propuestos con DMS/automatización
  averageInvoiceValue: 4_800,
  proposalInitialFee: 5_000,
  proposalMonthlyFee: 3_000,
  proposalDurationMonths: 12,
};

type Assumptions = typeof defaultAssumptions;

type HeadcountKey =
  | "kamCount"
  | "adminsPanamaCount"
  | "adminsRestCount"
  | "supervisorsCount"
  | "leadersCount";

const roleDefinitions: Array<{
  role: string;
  headcountKey: HeadcountKey;
  dedication: number;
  notes: string;
}> = [
  {
    role: "KAM",
    headcountKey: "kamCount",
    dedication: 0.35,
    notes: "Gestionan cotizaciones, corrigen F-007 y negocian excepciones.",
  },
  {
    role: "Administradores Panamá",
    headcountKey: "adminsPanamaCount",
    dedication: 0.65,
    notes: "Digitación en Odoo y NAF, seguimiento de tiquetes, conciliación (hub).",
  },
  {
    role: "Administradores resto de países",
    headcountKey: "adminsRestCount",
    dedication: 0.6,
    notes: "Apoyan 8 países con menos volumen pero mismas fricciones.",
  },
  {
    role: "Supervisores de admins",
    headcountKey: "supervisorsCount",
    dedication: 0.5,
    notes: "Garantizan SLA y validan márgenes antes de escalar.",
  },
  {
    role: "Líder regional",
    headcountKey: "leadersCount",
    dedication: 0.4,
    notes: "Coordina con dirección, Gateway y equipos locales.",
  },
];

const assumptionControls: Array<{
  key: keyof Assumptions;
  label: string;
  suffix?: string;
  helper?: string;
  format?: "percent";
  step?: number;
}> = [
  { key: "baseSalary", label: "Salario promedio (USD/mes)", helper: "Tarifa base para roles operativos", step: 50 },
  { key: "kamCount", label: "KAM activos", step: 1 },
  { key: "adminsPanamaCount", label: "Admins Panamá", helper: "Hub principal", step: 1 },
  { key: "adminsRestCount", label: "Admins resto de países", helper: "Suma de 8 países", step: 1 },
  { key: "supervisorsCount", label: "Supervisores de admins", step: 1 },
  { key: "leadersCount", label: "Líderes regionales", step: 1 },
  { key: "ordersPerAdmin", label: "Órdenes/mes por admin", helper: "Usado para derivar volumen total", step: 5 },
  { key: "reprocessRate", label: "% órdenes reprocesadas", suffix: "%", format: "percent", step: 1 },
  { key: "reprocessMinutes", label: "Min extra por reproceso", step: 5 },
  { key: "f007Rate", label: "% loops F-007", suffix: "%", format: "percent", step: 1 },
  { key: "f007Minutes", label: "Min extra F-007", step: 5 },
  { key: "supportHours", label: "Horas soporte Gateway / mes", step: 1 },
  { key: "supportRate", label: "Tarifa soporte (USD/h)", step: 5 },
  { key: "penaltyMonthly", label: "Penalizaciones SLA / mes" },
  { key: "opportunityCost", label: "Costo de oportunidad / mes" },
  { key: "odooUsers", label: "Usuarios afectados (Odoo)", step: 10 },
  { key: "migrationCost", label: "Costo migración Gateway (único)", step: 500 },
  { key: "averageInvoiceValue", label: "Valor promedio factura (USD)", helper: "Ticket promedio de orden aprobada", step: 100 },
  { key: "invoiceLeadTimeCurrent", label: "Días actuales para facturar", helper: "Desde aprobación a factura", step: 0.5 },
  { key: "invoiceLeadTimeFuture", label: "Días propuestos con DMS", helper: "Escenario futuro", step: 0.5 },
  { key: "proposalInitialFee", label: "Adelanto inicial (USD)", helper: "Según propuesta económica", step: 250 },
  { key: "proposalMonthlyFee", label: "Servicio mensual (USD)", helper: "12 cuotas base", step: 100 },
  { key: "proposalDurationMonths", label: "Meses de servicio", step: 1 },
];

const migrationTimeline = [
  {
    date: "7 abr",
    detail: "OdooSH notifica migrar de v14 a v18. Empieza el reloj del riesgo.",
  },
  {
    date: "1 may",
    detail: "Selección de proveedor según disponibilidad y alcance de Gateway.",
  },
  {
    date: "15 may",
    detail: "Proveedor presenta plan de trabajo y calendario por módulos.",
  },
  {
    date: "19 may",
    detail: "Promed recibe propuesta con garantía y plan detallado.",
  },
  {
    date: "30 may",
    detail: "Inicio de migración técnica; revisión funcional módulo a módulo.",
  },
  {
    date: "18 ago",
    detail: "Fecha objetivo para entregar 20 módulos. No se cumplió → escalamiento.",
  },
  {
    date: "16 sep",
    detail: "Reunión con OdooSH: riesgo de perder la base v14 antes del 1 oct.",
  },
];

const nextSteps = [
  "Validar dedicación real por rol y ajustar headcount objetivo (FTE).",
  "Confirmar contratos de soporte Oracle / Gateway para integrar SLA al DMS.",
  "Cruzar histórico de penalizaciones y órdenes retrasadas con finanzas.",
  "Alinear a Ventas + Administración en un piloto Odoo ↔ DMS ↔ NAF (4 semanas).",
  "Aprobar presupuesto de conectores + DMS y calendarizar el arranque paralelo.",
];

export default function CostosAnalisis() {
  const formattedDate = new Intl.DateTimeFormat("es-PA", {
    dateStyle: "long",
  }).format(new Date());

  const [assumptions, setAssumptions] = useState<Assumptions>(() => ({
    ...defaultAssumptions,
  }));

  const minuteRate = useMemo(
    () => assumptions.baseSalary / HOURS_PER_MONTH / 60,
    [assumptions.baseSalary]
  );

  const roleCostAllocation = useMemo(() => {
    const {
      baseSalary,
      kamCount,
      adminsPanamaCount,
      adminsRestCount,
      supervisorsCount,
      leadersCount,
    } = assumptions;

    return roleDefinitions.map((role) => {
      const headcount =
        role.headcountKey === "kamCount"
          ? kamCount
          : role.headcountKey === "adminsPanamaCount"
            ? adminsPanamaCount
            : role.headcountKey === "adminsRestCount"
              ? adminsRestCount
              : role.headcountKey === "supervisorsCount"
                ? supervisorsCount
                : leadersCount;

      const monthlyCost = headcount * baseSalary;
      return {
        ...role,
        headcount,
        monthlyCost,
        allocation: monthlyCost * role.dedication,
      };
    });
  }, [
    assumptions.baseSalary,
    assumptions.kamCount,
    assumptions.adminsPanamaCount,
    assumptions.adminsRestCount,
    assumptions.supervisorsCount,
    assumptions.leadersCount,
  ]);

  const allocatedPayroll = useMemo(
    () => roleCostAllocation.reduce((acc, role) => acc + role.allocation, 0),
    [roleCostAllocation]
  );

  const headcountSummary = useMemo(() => {
    const totalAdmins = assumptions.adminsPanamaCount + assumptions.adminsRestCount;
    const totalTeam =
      assumptions.kamCount +
      totalAdmins +
      assumptions.supervisorsCount +
      assumptions.leadersCount;
    return {
      kam: assumptions.kamCount,
      adminsPanama: assumptions.adminsPanamaCount,
      adminsRest: assumptions.adminsRestCount,
      supervisors: assumptions.supervisorsCount,
      leaders: assumptions.leadersCount,
      totalAdmins,
      totalTeam,
    };
  }, [
    assumptions.kamCount,
    assumptions.adminsPanamaCount,
    assumptions.adminsRestCount,
    assumptions.supervisorsCount,
    assumptions.leadersCount,
  ]);

  const monthlyVolume = useMemo(
    () =>
      Math.max(
        0,
        Math.round(
          (assumptions.adminsPanamaCount + assumptions.adminsRestCount) *
            assumptions.ordersPerAdmin
        )
      ),
    [
      assumptions.adminsPanamaCount,
      assumptions.adminsRestCount,
      assumptions.ordersPerAdmin,
    ]
  );

  const manualStageCosts = useMemo(
    () =>
      manualStageBlueprint.map((stage) => {
        const perOrderCost = stage.minutes * minuteRate;
        const monthlyCost = perOrderCost * monthlyVolume;
        return { ...stage, perOrderCost, monthlyCost };
      }),
    [minuteRate, monthlyVolume]
  );

  const manualStageMonthlyTotal = useMemo(
    () => manualStageCosts.reduce((acc, stage) => acc + stage.monthlyCost, 0),
    [manualStageCosts]
  );

  const reprocessStats = useMemo(() => {
    const events = Math.round(monthlyVolume * assumptions.reprocessRate);
    const costPerEvent = assumptions.reprocessMinutes * minuteRate;
    return {
      rate: assumptions.reprocessRate,
      extraMinutes: assumptions.reprocessMinutes,
      events,
      costPerEvent,
    };
  }, [
    monthlyVolume,
    assumptions.reprocessRate,
    assumptions.reprocessMinutes,
    minuteRate,
  ]);

  const reprocessMonthlyCost = useMemo(
    () => reprocessStats.events * reprocessStats.costPerEvent,
    [reprocessStats.events, reprocessStats.costPerEvent]
  );

  const f007LoopStats = useMemo(() => {
    const events = Math.round(monthlyVolume * assumptions.f007Rate);
    const costPerEvent = assumptions.f007Minutes * minuteRate;
    return {
      rate: assumptions.f007Rate,
      extraMinutes: assumptions.f007Minutes,
      events,
      costPerEvent,
    };
  }, [
    monthlyVolume,
    assumptions.f007Rate,
    assumptions.f007Minutes,
    minuteRate,
  ]);

  const f007LoopMonthlyCost = useMemo(
    () => f007LoopStats.events * f007LoopStats.costPerEvent,
    [f007LoopStats.events, f007LoopStats.costPerEvent]
  );

  const gatewaySupportMonthly = useMemo(
    () => assumptions.supportHours * assumptions.supportRate,
    [assumptions.supportHours, assumptions.supportRate]
  );

  const currentMonthlyDirect = useMemo(
    () =>
      allocatedPayroll +
      reprocessMonthlyCost +
      gatewaySupportMonthly +
      assumptions.penaltyMonthly,
    [allocatedPayroll, reprocessMonthlyCost, gatewaySupportMonthly, assumptions.penaltyMonthly]
  );

  const currentMonthlyAllIn = useMemo(
    () => currentMonthlyDirect + assumptions.opportunityCost,
    [currentMonthlyDirect, assumptions.opportunityCost]
  );

  const futureOperatingModel = useMemo(
    () => [
      {
        component: "Equipo directo (3 coordinadores + 1 analista)",
        amount: 6_000,
        detail: "Supervisan excepciones en dashboards; admins migran al monitoreo.",
      },
      {
        component: "DMS + conectores Odoo ↔ NAF",
        amount: 2_500,
        detail:
          "Licencia y hosting del DMS (monitor) + conectores Odoo que automatizan validaciones y sincronización.",
      },
      {
        component: "Soporte Gateway / Oracle",
        amount: gatewaySupportMonthly,
        detail: `${assumptions.supportHours} h/mes a $${assumptions.supportRate} para incidentes puntuales.`,
      },
      {
        component: "Bolsa de mejoras y training",
        amount: 1_500,
        detail: `Simulaciones para ${assumptions.odooUsers} usuarios de Odoo y pilotos de DMS.`,
      },
    ],
    [gatewaySupportMonthly, assumptions.supportHours, assumptions.supportRate, assumptions.odooUsers]
  );

  const futureMonthlyTotal = useMemo(
    () => futureOperatingModel.reduce((acc, item) => acc + item.amount, 0),
    [futureOperatingModel]
  );

  const projectedSavings = useMemo(
    () => currentMonthlyAllIn - futureMonthlyTotal,
    [currentMonthlyAllIn, futureMonthlyTotal]
  );

  const dailyBilling = useMemo(
    () => (monthlyVolume * assumptions.averageInvoiceValue) / 30,
    [monthlyVolume, assumptions.averageInvoiceValue]
  );

  const workingCapitalLocked = useMemo(
    () => ({
      current: dailyBilling * assumptions.invoiceLeadTimeCurrent,
      future: dailyBilling * assumptions.invoiceLeadTimeFuture,
    }),
    [dailyBilling, assumptions.invoiceLeadTimeCurrent, assumptions.invoiceLeadTimeFuture]
  );

  const cashReleased = useMemo(
    () => workingCapitalLocked.current - workingCapitalLocked.future,
    [workingCapitalLocked]
  );

  const collectionVelocityLift = useMemo(
    () =>
      assumptions.invoiceLeadTimeCurrent <= 0
        ? 0
        : (assumptions.invoiceLeadTimeCurrent - assumptions.invoiceLeadTimeFuture) /
          assumptions.invoiceLeadTimeCurrent,
    [assumptions.invoiceLeadTimeCurrent, assumptions.invoiceLeadTimeFuture]
  );

  const proposalInvestment = useMemo(
    () => ({
      initial: assumptions.proposalInitialFee,
      monthly: assumptions.proposalMonthlyFee,
      duration: assumptions.proposalDurationMonths,
      monthlySubtotal: assumptions.proposalMonthlyFee * assumptions.proposalDurationMonths,
    }),
    [
      assumptions.proposalInitialFee,
      assumptions.proposalMonthlyFee,
      assumptions.proposalDurationMonths,
    ]
  );

  const proposalTotal = useMemo(
    () => proposalInvestment.initial + proposalInvestment.monthlySubtotal,
    [proposalInvestment]
  );

  const gatewayAnnualSupport = useMemo(
    () => gatewaySupportMonthly * 12,
    [gatewaySupportMonthly]
  );

  const projectAllIn = useMemo(
    () => proposalTotal + assumptions.migrationCost + gatewayAnnualSupport,
    [proposalTotal, assumptions.migrationCost, gatewayAnnualSupport]
  );

  const summaryStats = useMemo(
    () => [
      {
        label: "Costo mensual actual (all-in)",
        value: formatMoney(currentMonthlyAllIn),
        helper: "Mano de obra asignada + reprocesos + SLA + oportunidad perdida",
      },
      {
        label: "Escenario Promed fluye facturación",
        value: formatMoney(futureMonthlyTotal),
        helper: "3 coordinadores + conectores Odoo + DMS como monitor + soporte Gateway",
      },
      {
        label: "Ahorro neto estimado",
        value: formatMoney(projectedSavings),
        helper: "ROI < 3 meses con inversión referencial de $50k",
      },
      {
        label: "Velocidad de cobro",
        value: `${formatPercent(collectionVelocityLift)}`,
        helper: `De ${assumptions.invoiceLeadTimeCurrent} a ${assumptions.invoiceLeadTimeFuture} días · Liquidez liberada ${formatMoney(
          cashReleased
        )}`,
      },
    ],
    [
      currentMonthlyAllIn,
      futureMonthlyTotal,
      projectedSavings,
      collectionVelocityLift,
      assumptions.invoiceLeadTimeCurrent,
      assumptions.invoiceLeadTimeFuture,
      cashReleased,
    ]
  );

  const actionBlocks = useMemo(
    () => ({
      current: {
        title: "Sistema actual",
        subtitle: `${headcountSummary.kam} KAM + ${headcountSummary.totalAdmins} admins corrigiendo manualmente`,
        bullets: [
          "F-007, Odoo y NAF se completan por separado; ningún dato fluye solo.",
          `${formatPercent(assumptions.reprocessRate)} de las órdenes regresan al inicio; loops F-007 afectan al ${formatPercent(assumptions.f007Rate)}.`,
          "SLA de 7 días provoca penalizaciones e inventario inmovilizado.",
          "El Gateway se usa para migrar, no para eliminar la causa de errores.",
        ],
      },
      future: {
        title: "Promed que fluye",
        subtitle: "Odoo (CRM) + Oracle NAF + DMS en paralelo",
        bullets: [
          "KAM mantienen cotizaciones en Odoo; conectores validan en origen y sincronizan con NAF, mientras el DMS observa el pulso del proceso.",
          "Administradores se enfocan en excepciones (3 FTE) y no en digitación.",
          "Alertas SLA cero: Odoo genera hitos automatizados y el DMS alerta cuando aparecen cuellos de botella.",
          "Oracle NetSuite permanece como ERP; el DMS actúa como heart monitor y no como motor transaccional.",
        ],
      },
    }),
    [assumptions.reprocessRate, assumptions.f007Rate, headcountSummary.kam, headcountSummary.totalAdmins]
  );

  const externalCostItems = useMemo(
    () => [
      {
        concept: "Migración Gateway / Oracle NetSuite",
        amount: `${formatMoney(assumptions.migrationCost)} (único)`,
        detail: `Proyecto ${MIGRATION_WINDOW}. Referencia para cronograma de implementación.`,
      },
      {
        concept: "Soporte Gateway",
        amount: `${formatMoney(gatewaySupportMonthly)} / mes`,
        detail: `${assumptions.supportHours} h/mes estimadas a $${assumptions.supportRate} durante la transición.`,
      },
      {
        concept: "Penalizaciones SLA e intereses",
        amount: `${formatMoney(assumptions.penaltyMonthly)} / mes`,
        detail: "Facturas tardan 7 días promedio; Oracle cobra SLA al día siguiente.",
      },
      {
        concept: "Costo de oportunidad (órdenes en cola)",
        amount: `${formatMoney(assumptions.opportunityCost)} / mes`,
        detail: "Proyectos detenidos por validaciones y correcciones tardías.",
      },
    ],
    [
      assumptions.migrationCost,
      gatewaySupportMonthly,
      assumptions.supportHours,
      assumptions.supportRate,
      assumptions.penaltyMonthly,
      assumptions.opportunityCost,
    ]
  );

  const projectCostRows = useMemo(
    () => [
      {
        concept: "Adelanto inicial",
        amount: formatMoney(proposalInvestment.initial),
        note: "Activa levantamiento, mapeos y arquitectura.",
      },
      {
        concept: `Servicio mensual (${proposalInvestment.duration} meses)`,
        amount: `${formatMoney(proposalInvestment.monthly)} / mes`,
        note: `Subtotal ${formatMoney(proposalInvestment.monthlySubtotal)} · incluye coordinación, gobierno y reglas.`,
      },
      {
        concept: "Subtotal proyecto 12 meses",
        amount: formatMoney(proposalTotal),
        note: "Suma de adelanto + cuotas; base de la propuesta económica.",
      },
      {
        concept: "Gateway migración (único)",
        amount: formatMoney(assumptions.migrationCost),
        note: `Implementado del ${MIGRATION_WINDOW}.`,
      },
      {
        concept: "Gateway soporte (12 meses)",
        amount: `${formatMoney(gatewaySupportMonthly)} / mes`,
        note: `≈ ${formatMoney(gatewayAnnualSupport)} al año (${assumptions.supportHours} h/mes a $${assumptions.supportRate}).`,
      },
      {
        concept: "Inversión total + Gateway",
        amount: formatMoney(projectAllIn),
        note: "Incluye propuesta completa + migración + soporte Gateway anual.",
      },
    ],
    [
      proposalInvestment,
      proposalTotal,
      assumptions.migrationCost,
      gatewaySupportMonthly,
      gatewayAnnualSupport,
      assumptions.supportHours,
      assumptions.supportRate,
      projectAllIn,
    ]
  );

  const assumptionList = useMemo(
    () => [
      `Salario promedio ${formatMoney(assumptions.baseSalary)} (160 h/mes) → ${formatMoney(
        minuteRate,
        2
      )} por minuto de trabajo.`,
      `Volumen derivado: ${monthlyVolume.toLocaleString()} órdenes/mes (admins totales ${
        headcountSummary.totalAdmins
      } x ${assumptions.ordersPerAdmin} órdenes c/u) con ticket promedio de ${formatMoney(
        assumptions.averageInvoiceValue
      )}.`,
      `${formatPercent(assumptions.reprocessRate)} de órdenes regresan al inicio; ${formatPercent(
        assumptions.f007Rate
      )} requieren rehacer F-007.`,
      "Tras la aprobación del cliente, la factura puede tardar hasta 3 días por la cantidad de handoffs manuales.",
      `Soporte Gateway estimado en ${assumptions.supportHours} h/mes a $${assumptions.supportRate}/h hasta estabilizar.`,
      `Propuesta económica: adelanto ${formatMoney(
        proposalInvestment.initial
      )} + ${formatMoney(proposalInvestment.monthly)} / mes x ${proposalInvestment.duration} meses (total ${formatMoney(
        proposalTotal
      )}).`,
      `Gateway: migración ${formatMoney(assumptions.migrationCost)} + soporte mensual ${formatMoney(
        gatewaySupportMonthly
      )} (≈ ${formatMoney(gatewayAnnualSupport)} al año).`,
      `${assumptions.odooUsers} usuarios activos en Odoo impactados por reprocesos y cambios.`,
      "Cifras redondeadas; el CAPEX del DMS (≈$50k) se recupera en <3 meses.",
    ],
    [
      assumptions.baseSalary,
      minuteRate,
      monthlyVolume,
      assumptions.reprocessRate,
      assumptions.f007Rate,
      assumptions.supportHours,
      assumptions.supportRate,
      assumptions.odooUsers,
      proposalInvestment,
      proposalTotal,
      gatewaySupportMonthly,
      gatewayAnnualSupport,
      assumptions.migrationCost,
      headcountSummary.totalAdmins,
      assumptions.ordersPerAdmin,
    ]
  );

  const handleAssumptionInput = (
    control: (typeof assumptionControls)[number],
    rawValue: string
  ) => {
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) return;
    const normalized = control.format === "percent" ? parsed / 100 : parsed;
    setAssumptions((prev) => ({
      ...prev,
      [control.key]: normalized,
    }));
  };

  const resetAssumptions = () => setAssumptions({ ...defaultAssumptions });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="text-right">
              <h1 className="text-lg font-bold">Historia de Costos</h1>
              <p className="text-xs text-muted-foreground">
                Actualizado {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-10">
        <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Flujo Odoo ↔ Oracle ↔ DMS
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Costos actuales vs. un Promed que fluye la facturación
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El objetivo es demostrar, con números, que reducir actores y reprocesos
              genera liquidez inmediata. Partimos del proceso manual (F-007 → Odoo →
              NAF) y lo contrastamos con un flujo donde Odoo + conectores automatizan
              la integración mientras el DMS opera como “heart monitor” para detectar
              cuellos de botella en vivo.
            </p>
          </div>
          <Card className="w-full md:w-80 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                ROI de referencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-emerald-900 dark:text-emerald-50">
              <p>Inversión inicial estimada (conectores + DMS): $50,000.</p>
              <p>Ahorro mensual neto esperado: {formatMoney(projectedSavings)}.</p>
              <p>Punto de equilibrio: 3 meses.</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {summaryStats.map((stat) => (
            <Card
              key={stat.label}
              className="bg-muted/40 border-dashed hover:border-solid transition-colors"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.helper}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-2xl font-bold">Ajusta los supuestos en vivo</h3>
                <p className="text-sm text-muted-foreground">
                  Cambia salarios, volumen, tasas de reproceso o costos externos en plena presentación.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetAssumptions}>
              Restablecer supuestos
            </Button>
          </div>
          <Card>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assumptionControls.map((control) => {
                const rawValue = assumptions[control.key];
                const inputValue =
                  control.format === "percent"
                    ? (rawValue * 100).toString()
                    : rawValue.toString();
                return (
                  <label key={control.key as string} className="space-y-1 text-sm">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {control.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step={control.step ?? 1}
                        value={inputValue}
                        onChange={(event) =>
                          handleAssumptionInput(control, event.target.value)
                        }
                      />
                      {control.suffix && (
                        <span className="text-xs text-muted-foreground">
                          {control.suffix}
                        </span>
                      )}
                    </div>
                    {control.helper && (
                      <p className="text-xs text-muted-foreground">{control.helper}</p>
                    )}
                  </label>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Users2 className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-2xl font-bold">Carga mensual del equipo</h3>
              <p className="text-sm text-muted-foreground">
                {headcountSummary.kam} KAM, {headcountSummary.totalAdmins} administradores,
                {headcountSummary.supervisors} supervisores y {headcountSummary.leaders} líder(es)
                tocan cada orden. Asignamos el % del tiempo que hoy se va en facturar.
              </p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">KAM totales</p>
                <p className="text-2xl font-semibold">{headcountSummary.kam}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Admins Panamá</p>
                <p className="text-2xl font-semibold">{headcountSummary.adminsPanama}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Admins resto</p>
                <p className="text-2xl font-semibold">{headcountSummary.adminsRest}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Supervisores</p>
                <p className="text-2xl font-semibold">{headcountSummary.supervisors}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Líderes</p>
                <p className="text-2xl font-semibold">{headcountSummary.leaders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Volumen derivado</p>
                <p className="text-2xl font-semibold">
                  {monthlyVolume.toLocaleString()} <span className="text-sm font-normal">órdenes/mes</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {headcountSummary.totalAdmins} admins × {assumptions.ordersPerAdmin} órdenes.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-xs text-muted-foreground">
            Al liberar tiempo de este equipo, el flujo completo se acelera sin necesidad de recortar personal; si quieres ilustrar
            un escenario con menos headcount, ajusta los controles y verás inmediatamente el ahorro incremental en los KPI financieros.
          </p>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rol</TableHead>
                    <TableHead>Headcount</TableHead>
                    <TableHead>Dedicación</TableHead>
                    <TableHead>Costo mensual asignado</TableHead>
                    <TableHead>Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleCostAllocation.map((role) => (
                    <TableRow key={role.role}>
                      <TableCell className="font-medium">{role.role}</TableCell>
                      <TableCell>{role.headcount}</TableCell>
                      <TableCell>{formatPercent(role.dedication)}</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-300">
                        {formatMoney(role.allocation)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {role.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="font-semibold">
                      Total mano de obra dedicada
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-700">
                      {formatMoney(allocatedPayroll)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-sky-600" />
                Costo por etapa manual ({monthlyVolume.toLocaleString()} órdenes/mes)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Responsables</TableHead>
                    <TableHead>Min/orden</TableHead>
                    <TableHead>Costo / orden</TableHead>
                    <TableHead>Costo mensual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manualStageCosts.map((stage) => (
                    <TableRow key={stage.concept}>
                      <TableCell className="font-medium">{stage.concept}</TableCell>
                      <TableCell>{stage.owners}</TableCell>
                      <TableCell>{stage.minutes} min</TableCell>
                      <TableCell>{formatMoney(stage.perOrderCost, 2)}</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-300">
                        {formatMoney(stage.monthlyCost)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="font-semibold">
                      Total directo por orden (≈180 min)
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-700">
                      {formatMoney(manualStageMonthlyTotal)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-rose-600" />
                  Reprocesos y fugas de tiempo
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
                    <p className="text-xs text-muted-foreground">Órdenes reprocesadas</p>
                    <p className="text-2xl font-bold text-rose-600">
                      {reprocessStats.events} ({formatPercent(reprocessStats.rate)})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{reprocessStats.extraMinutes} min / evento ·{" "}
                      {formatMoney(reprocessStats.costPerEvent, 2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
                    <p className="text-xs text-muted-foreground">Loops F-007</p>
                    <p className="text-2xl font-bold text-rose-600">
                      {f007LoopStats.events} ({formatPercent(f007LoopStats.rate)})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{f007LoopStats.extraMinutes} min / evento ·{" "}
                      {formatMoney(f007LoopStats.costPerEvent, 2)}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-4 text-sm space-y-1">
                  <p className="text-xs uppercase tracking-wide text-rose-600 font-semibold">
                    Impacto mensual
                  </p>
                  <p className="text-3xl font-bold text-rose-600">
                    {formatMoney(reprocessMonthlyCost + f007LoopMonthlyCost)}
                  </p>
                  <p className="text-muted-foreground leading-snug">
                    El tiempo adicional se reparte entre KAM, admins y especialista.
                    Cada iteración retrasa la facturación ≥48 horas.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">
                  Incluso sin reprocesos, la factura puede tardar hasta 3 días en emitirse
                  después de que el cliente aprueba la orden de compra por la cantidad de
                  handoffs y validaciones.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-indigo-600" />
                  Alcance del dolor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="text-3xl font-bold text-foreground">
                  {assumptions.odooUsers}
                </p>
                <p>Usuarios activos en Odoo afectados por reprocesos.</p>
                <p className="text-xs">
                  + {formatMoney(assumptions.opportunityCost)} en ingresos diferidos por órdenes
                  detenidas. Los administradores comparten su tiempo con otros módulos,
                  por lo que cada día de retraso afecta inventario y cobranzas.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-emerald-600" />
                  Velocidad de cobro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  De {assumptions.invoiceLeadTimeCurrent} días actuales a{" "}
                  {assumptions.invoiceLeadTimeFuture} días con DMS (+
                  {formatPercent(collectionVelocityLift)} de velocidad).
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {formatMoney(cashReleased)}
                </p>
                <p className="text-xs">
                  Liquidez liberada al emitir factura más rápido (basado en ticket
                  promedio de {formatMoney(assumptions.averageInvoiceValue)}). Reduce la
                  presión sobre líneas de crédito y acelera cobranza.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <LineChart className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-2xl font-bold">Flujo operativo con actores y costos</h3>
              <p className="text-sm text-muted-foreground">
                Los diagramas resaltan dónde se pierden minutos y dólares hoy.
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Flujo de facturación manual (As-Is)</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Etiquetas incluyen minutos y costo aproximado por actor.
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <MermaidDiagram id="cost-as-is" chart={asIsDiagram} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Orden de compra + facturación (Roles)</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Muestra handoffs entre KAM, especialistas, admins, gerencia y bodega.
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <MermaidDiagram id="cost-purchase-order" chart={purchaseOrderDiagram} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-2xl font-bold">Modelo integrado y palancas de ahorro</h3>
              <p className="text-sm text-muted-foreground">
                Menos actores, conectores Odoo ↔ Oracle haciendo el trabajo pesado y el
                DMS actuando como heart monitor continuo.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(actionBlocks).map((block) => (
              <Card key={block.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{block.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{block.subtitle}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {block.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                        <span className="leading-snug">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Componentes de costo en el flujo integrado</CardTitle>
              <p className="text-xs text-muted-foreground">
                Se reduce la mano de obra directa y se invierte en automatización vía
                Odoo + conectores, con el DMS monitoreando las variaciones del flujo.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Componente</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Monto mensual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {futureOperatingModel.map((item) => (
                    <TableRow key={item.component}>
                      <TableCell className="font-medium">{item.component}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.detail}
                      </TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-300">
                        {formatMoney(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold">
                      Total mensual modelo integrado
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-700">
                      {formatMoney(futureMonthlyTotal)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-sky-600" />
                Costos externos y servicios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {externalCostItems.map((item) => (
                <div key={item.concept} className="border-b border-dashed pb-3 last:border-none last:pb-0">
                  <p className="font-semibold">{item.concept}</p>
                  <p className="text-emerald-600">{item.amount}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Línea de tiempo de migración / Gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {migrationTimeline.map((item) => (
                <div key={item.date} className="flex gap-3">
                  <span className="text-xs font-semibold text-indigo-600 w-12">
                    {item.date}
                  </span>
                  <p className="text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-700" />
            <div>
              <h3 className="text-2xl font-bold">Inversión del proyecto + Gateway</h3>
              <p className="text-sm text-muted-foreground">
                Relaciona la propuesta económica (adelanto + cuotas) con los supuestos de
                Gateway ya modelados en este dashboard.
              </p>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectCostRows.map((row) => (
                    <TableRow key={row.concept}>
                      <TableCell className="font-medium">{row.concept}</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-300">
                        {row.amount}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.note}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-sky-600" />
                Supuestos a validar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {assumptionList.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-sky-600">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Próximos pasos sugeridos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {nextSteps.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-emerald-600">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="border rounded-lg p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Nota para validación</p>
          <p>
            Los montos son placeholder listos para reemplazarse con cifras oficiales de
            Promed. El formato permite presentar en vivo la historia de costos y anexar
            evidencia (Odoo, Oracle, Gateway, DMS) sin rehacer el dashboard.
          </p>
        </section>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/propuesta-2026">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la propuesta
            </Button>
          </Link>
          <Link href="/plan-de-trabajo">
            <Button size="sm">Ver plan anual</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

