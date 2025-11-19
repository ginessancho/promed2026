import { Link } from "wouter";
import {
  ArrowLeft,
  DollarSign,
  TrendingDown,
  ClipboardList,
  ShieldCheck,
  Target,
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

const summaryStats = [
  {
    label: "Ahorro mensual proyectado",
    value: "~$18,000",
    helper: "Personal, licencias, servicios, SLA y oportunidad",
  },
  {
    label: "Breakeven estimado",
    value: "≈ 3 meses",
    helper: "Inversión inicial referencial de $50k",
  },
  {
    label: "Reducción de tiempo de ciclo",
    value: "−5 días",
    helper: "De 7 a 2 días hábiles promedio",
  },
];

const financialRows = [
  {
    concept: "Personal operativo",
    current: "6 coordinadores · 120 h/sem · $5,400",
    future: "3 coordinadores · 36 h/sem · $1,620",
    savings: "$3,780 / semana",
    notes: "Automatización de captura y validaciones en origen",
  },
  {
    concept: "Supervisión / validación",
    current: "2 gerentes · 16 h/sem · $1,040",
    future: "1 gerente · 4 h/sem · $260",
    savings: "$780 / semana",
    notes: "Paneles ejecutivos + alertas SLA",
  },
  {
    concept: "Herramientas y middleware",
    current: "4 sistemas · $4,800 / mes",
    future: "Plataforma única · $2,000 / mes",
    savings: "$2,800 / mes",
    notes: "Consolidación de licencias y hosting",
  },
  {
    concept: "Servicios externos",
    current: "Consultoría y soporte · $2,500 / mes",
    future: "Soporte premium incluido · $600 / mes",
    savings: "$1,900 / mes",
    notes: "Tableau de gobierno compartido",
  },
  {
    concept: "Onboarding anual",
    current: "24 h x 12 usuarios · $11,520 / año",
    future: "6 h x 12 usuarios · $2,880 / año",
    savings: "$8,640 / año",
    notes: "Playbooks y simuladores en el DMS",
  },
  {
    concept: "Retrabajo por rechazos",
    current: "10 % casos · 8 h/sem · $360",
    future: "2 % casos · 1.5 h/sem · $68",
    savings: "$292 / semana",
    notes: "Reglas DMS + retroalimentación bidireccional",
  },
  {
    concept: "Penalizaciones SLA",
    current: "$1,200 / mes",
    future: "$0",
    savings: "$1,200 / mes",
    notes: "Alertas proactivas y monitoreo 24/7",
  },
  {
    concept: "Costos de oportunidad",
    current: "−$8,000 / mes (proyectos detenidos)",
    future: "+$8,000 / mes (proyectos retomados)",
    savings: "$16,000 / mes impacto total",
    notes: "Capacidad liberada para iniciativas comerciales",
  },
];

const operationalRows = [
  {
    concept: "Tiempo de ciclo promedio",
    current: "7 días",
    future: "2 días",
    impact: "−5 días",
    notes: "Flujo Odoo ↔ NAF automatizado",
  },
  {
    concept: "Incidentes mensuales",
    current: "14 incidentes",
    future: "3 incidentes",
    impact: "−79 %",
    notes: "Validaciones previas + trazabilidad",
  },
  {
    concept: "Retrabajo operativo",
    current: "8 h/sem",
    future: "1.5 h/sem",
    impact: "−81 %",
    notes: "Motor de reglas DMS",
  },
];

const actionBlocks = {
  current: {
    title: "Sistema actual",
    subtitle: "Fragmentado y costoso",
    bullets: [
      "6 coordinadores + 2 gerentes para reconciliar información.",
      "4 herramientas sin integración plena y doble captura.",
      "10 % de las facturas requieren rehacerse completamente.",
      "Penalizaciones por SLA y retrasos promedio de 7 días.",
    ],
  },
  future: {
    title: "Nueva solución",
    subtitle: "Flujo integrado con DMS",
    bullets: [
      "3 coordinadores + tableros para seguimiento predictivo.",
      "Plataforma única con conectores Odoo ↔ NAF.",
      "2 % de retrabajo gracias a reglas dinámicas.",
      "Ciclo de 2 días y cero penalizaciones por SLA.",
    ],
  },
};

const assumptionList = [
  "Tarifas horarias referenciales: coordinadores $45/h, gerentes $65/h.",
  "Los montos de licencias consideran precios lista sin descuentos.",
  "Volumen de usuarios nuevos estimado en 12 por año.",
  "Costos de oportunidad calculados sobre iniciativas comerciales pausadas.",
  "Todas las cifras son placeholders listos para ser validados por Promed.",
];

const nextSteps = [
  "Validar tarifas reales de personal y número exacto de FTE involucrados.",
  "Confirmar contratos vigentes de licenciamiento y soporte externo.",
  "Alinear calendario de adopción (onboarding) con equipos Promed.",
  "Revisar penalizaciones históricas y metas de SLA 2026.",
  "Ajustar ROI con CAPEX/OPEX definitivo y aprobar piloto de 4 semanas.",
];

export default function CostosAnalisis() {
  const formattedDate = new Intl.DateTimeFormat("es-PA", {
    dateStyle: "long",
  }).format(new Date());

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
              <h1 className="text-lg font-bold">Análisis de Costos</h1>
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
              One-pager financiero
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Costos actuales vs. Nueva solución integrada
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Este documento resume los principales drivers de costo y el
              impacto proyectado al consolidar Odoo, NAF y el DMS. Todos los
              valores son hipotéticos y están listos para ser reemplazados con
              cifras finales de Promed.
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
              <p>Inversión inicial estimada: $50,000.</p>
              <p>Ahorro mensual neto esperado: ~$18,000.</p>
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

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-600" />
                Costo base del sistema actual
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Mano de obra semanal combinada de $6,800 y costos mensuales de
                $8,500 entre licencias y proveedores externos.
              </p>
              <p>
                Penalizaciones SLA y retrasos agregan $1,200 mensuales y
                proyectos diferidos reducen ingresos potenciales en $8,000.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Propuesta integrada
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Reducción de FTE al combinar automatización, reglas y visibilidad
                operativa en tiempo real.
              </p>
              <p>
                Consolidación tecnológica, soporte incluido y modelos de
                onboarding express aseguran ahorro recurrente.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">Comparativa financiera</h3>
            <p className="text-sm text-muted-foreground">
              Todos los montos están expresados en USD y sirven como base para
              validar los rubros reales de Promed.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Sistema actual</TableHead>
                    <TableHead>Nueva solución</TableHead>
                    <TableHead>Ahorro estimado</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialRows.map((row) => (
                    <TableRow key={row.concept}>
                      <TableCell className="font-medium">
                        {row.concept}
                      </TableCell>
                      <TableCell>{row.current}</TableCell>
                      <TableCell>{row.future}</TableCell>
                      <TableCell className="text-green-600 dark:text-green-300">
                        {row.savings}
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <span className="text-xs text-muted-foreground">
                          {row.notes}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">Indicadores operativos</h3>
            <p className="text-sm text-muted-foreground">
              La reducción de costos se sostiene con mejoras tangibles en el
              desempeño diario.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicador</TableHead>
                    <TableHead>Sistema actual</TableHead>
                    <TableHead>Nueva solución</TableHead>
                    <TableHead>Impacto</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalRows.map((row) => (
                    <TableRow key={row.concept}>
                      <TableCell className="font-medium">
                        {row.concept}
                      </TableCell>
                      <TableCell>{row.current}</TableCell>
                      <TableCell>{row.future}</TableCell>
                      <TableCell className="text-blue-600 dark:text-blue-300">
                        {row.impact}
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <span className="text-xs text-muted-foreground">
                          {row.notes}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-2xl font-bold">Vea la Solución en Acción</h3>
              <p className="text-sm text-muted-foreground">
                Comparación visual de los dos modelos operativos.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(actionBlocks).map((block) => (
              <Card key={block.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{block.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {block.subtitle}
                  </p>
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
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
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
          <p className="font-medium text-foreground mb-1">
            Nota para validación
          </p>
          <p>
            Cada monto o métrica puede reemplazarse fácilmente con los datos
            confirmados de Promed. El formato está listo para exportar a la
            propuesta final o presentarse en vivo desde este dashboard.
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

