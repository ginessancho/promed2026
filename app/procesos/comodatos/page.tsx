"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Package,
  Building2,
  Search,
  Eye,
  EyeOff,
  DollarSign,
  BarChart3,
  Loader2,
  RefreshCw,
  Database,
  MapPin,
  Unlink,
  TrendingDown,
  Ghost,
  ShieldAlert,
  Warehouse,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

// ═══════════════════════════════════════════════════════════════════════════════
// COMODATOS DASHBOARD - Live data from NAF6 (Redshift)
// Shows activos, comodato contracts, and the gap between them
// ═══════════════════════════════════════════════════════════════════════════════

const CIA_NAMES: Record<string, string> = {
  "01": "Panamá",
  "09": "Honduras (09)",
  "10": "Honduras (10)",
  "12": "Costa Rica",
  "15": "Guatemala",
  "18": "El Salvador",
  "22": "Nicaragua",
  "24": "Rep. Dominicana",
  "26": "Colombia",
  "27": "Colombia (27)",
  "28": "Ecuador",
  "30": "Panamá (30)",
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(
      new Date(dateStr)
    );
  } catch {
    return dateStr;
  }
};

export default function ComodatosDashboard() {
  const [selectedCia, setSelectedCia] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [huerfanosPage, setHuerfanosPage] = useState(0);
  const [activosPage, setActivosPage] = useState(0);
  const [baseInstaladaPage, setBaseInstaladaPage] = useState(0);
  const [baseSinActivoPage, setBaseSinActivoPage] = useState(0);
  const PAGE_SIZE = 25;

  const formattedDate = new Intl.DateTimeFormat("es-PA", {
    dateStyle: "long",
  }).format(new Date());

  const ciaFilter = selectedCia === "all" ? undefined : selectedCia;

  // Debounce search to avoid firing a query on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setHuerfanosPage(0);
      setActivosPage(0);
      setBaseInstaladaPage(0);
      setBaseSinActivoPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const searchFilter = debouncedSearch.trim() || undefined;

  // tRPC queries
  const summary = trpc.comodatos.summary.useQuery(undefined, {
    staleTime: 60_000,
  });
  const porCompania = trpc.comodatos.porCompania.useQuery(undefined, {
    staleTime: 60_000,
  });
  const porEstado = trpc.comodatos.porEstado.useQuery(undefined, {
    staleTime: 60_000,
  });
  const huerfanos = trpc.comodatos.huerfanos.useQuery(
    { cia: ciaFilter, search: searchFilter, limit: PAGE_SIZE, offset: huerfanosPage * PAGE_SIZE },
    { staleTime: 60_000 }
  );
  const activos = trpc.comodatos.activos.useQuery(
    { cia: ciaFilter, search: searchFilter, limit: PAGE_SIZE, offset: activosPage * PAGE_SIZE },
    { staleTime: 60_000 }
  );
  const baseInstalada = trpc.comodatos.baseInstalada.useQuery(
    { cia: ciaFilter, limit: PAGE_SIZE, offset: baseInstaladaPage * PAGE_SIZE },
    { staleTime: 60_000 }
  );
  const baseSinActivo = trpc.comodatos.baseInstaladaSinActivo.useQuery(
    { cia: ciaFilter, limit: PAGE_SIZE, offset: baseSinActivoPage * PAGE_SIZE },
    { staleTime: 60_000 }
  );
  const depreciacion = trpc.comodatos.depreciacion.useQuery(undefined, { staleTime: 60_000 });
  const cohortes = trpc.comodatos.cohortes.useQuery(undefined, { staleTime: 60_000 });
  const trazabilidad = trpc.comodatos.trazabilidad.useQuery(undefined, { staleTime: 60_000 });
  const statusDetallado = trpc.comodatos.statusDetallado.useQuery(undefined, { staleTime: 60_000 });

  const s = summary.data;

  // ─── Loading progress tracking ─────────────────────────────────────────
  const loadingSteps = useMemo(() => [
    { key: "summary", label: "Contando activos en comodato...", query: summary },
    { key: "porCompania", label: "Agrupando por compañía...", query: porCompania },
    { key: "porEstado", label: "Clasificando estados de contrato...", query: porEstado },
    { key: "huerfanos", label: "Identificando activos sin contrato...", query: huerfanos },
    { key: "activos", label: "Cargando detalle de activos...", query: activos },
    { key: "baseInstalada", label: "Cargando base instalada...", query: baseInstalada },
    { key: "baseSinActivo", label: "Cruzando base instalada vs activos...", query: baseSinActivo },
    { key: "depreciacion", label: "Analizando depreciación...", query: depreciacion },
    { key: "cohortes", label: "Calculando cohortes de edad...", query: cohortes },
    { key: "trazabilidad", label: "Cruzando 3 fuentes de datos...", query: trazabilidad },
    { key: "statusDetallado", label: "Desglosando estados por ubicación...", query: statusDetallado },
  ], [summary.status, porCompania.status, porEstado.status, huerfanos.status, activos.status, baseInstalada.status, baseSinActivo.status, depreciacion.status, cohortes.status, trazabilidad.status, statusDetallado.status]);

  const completedCount = loadingSteps.filter(s => !s.query.isLoading).length;
  const totalSteps = loadingSteps.length;
  const progressPct = Math.round((completedCount / totalSteps) * 100);
  const currentStep = loadingSteps.find(s => s.query.isLoading);
  const isFullyLoaded = completedCount === totalSteps;
  const anyLoading = completedCount < totalSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/10">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/procesos">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Procesos Críticos
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              {s?._fromCache ? (
                <Badge variant="outline" className="gap-1 text-amber-600 border-amber-200">
                  <Database className="w-3 h-3" />
                  Caché {s._cacheDate ? new Intl.DateTimeFormat("es-PA", { dateStyle: "short", timeStyle: "short" }).format(new Date(s._cacheDate)) : ""}
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200">
                  <Database className="w-3 h-3" />
                  NAF6 + Inventario (Live)
                </Badge>
              )}
              <div className="text-right">
                <h1 className="text-lg font-bold">Comodatos & Activos</h1>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Loading overlay */}
        {anyLoading && !s && (
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-card">
            <CardContent className="py-12 px-8">
              <div className="max-w-lg mx-auto space-y-6">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-blue-600 animate-pulse" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Consultando datos en vivo
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Conectando con la base de datos de activos fijos y contratos
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{currentStep?.label ?? "Finalizando..."}</span>
                    <span>{completedCount} de {totalSteps}</span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>

                <div className="space-y-1.5">
                  {loadingSteps.map((step) => (
                    <div
                      key={step.key}
                      className="flex items-center gap-2 text-sm"
                    >
                      {step.query.isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                      ) : step.query.isError ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <span className={step.query.isLoading ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground/70 text-center pt-2">
                  La primera carga puede tomar unos segundos — los datos vienen directo de Redshift.
                  <br />
                  Después de cargar, se mantienen en caché por 1 minuto.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Intro */}
        <section className="space-y-3 max-w-4xl">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Visibilidad Ejecutiva
            </p>
            {anyLoading && s && (
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            )}
          </div>
          <h2 className="text-2xl font-bold">
            Activos en Comodato: Brecha Sistémica en el Registro de Contratos
          </h2>
          <p className="text-sm text-muted-foreground">
            Cruce en vivo de <strong>NAF6.ARAFMA</strong> (activos fijos),{" "}
            <strong>NAF6.ARAFCOM</strong> (contratos de comodato) y{" "}
            <strong>INVENTARIO.BASE_INSTALADA_PROMED</strong> (base instalada).
            El análisis revela que{" "}
            <span className="text-rose-600 font-semibold">
              el proceso de registro de contratos está fallando sistemáticamente
            </span>
            , no solo para activos antiguos — los activos de 2021-2024 tienen tasas
            de orfandad del 70-72%. Solo el 32% de los activos son rastreables en
            los tres sistemas.
          </p>
        </section>

        {/* KPI Cards */}
        {s && (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-card">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Activos Comodato
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {formatNumber(s.totalActivos)}
                </p>
                <p className="text-xs text-muted-foreground">
                  en ARAFMA con indicador comodato
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-card">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Con Contrato
                  </span>
                </div>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatNumber(s.activosConComodato)}
                </p>
                <p className="text-xs text-muted-foreground">
                  visibles en ARAFCOM
                </p>
              </CardContent>
            </Card>

            <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-card">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="w-4 h-4 text-rose-600" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Sin Contrato
                  </span>
                </div>
                <p className="text-3xl font-bold text-rose-600">
                  {formatNumber(s.activosSinComodato)}
                </p>
                <p className="text-xs text-muted-foreground">
                  sin contrato en ARAFCOM
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Valor Neto
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {formatMoney(s.valorTotalDepreciado)}
                </p>
                <p className="text-xs text-muted-foreground">
                  original: {formatMoney(s.valorTotalOriginal)}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Visibility Gap Banner */}
        {s && s.activosSinComodato > 0 && (
          <Card className="border-rose-300 bg-rose-50/50 dark:bg-rose-950/10">
            <CardContent className="pt-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-rose-800 dark:text-rose-300">
                    Proceso Roto:{" "}
                    {formatNumber(s.activosSinComodato)} activos sin contrato registrado
                  </h3>
                  <p className="text-sm text-rose-700/80 dark:text-rose-400/80 mt-1">
                    Estos activos están marcados como comodato en contabilidad
                    (ARAFMA) pero <strong>nunca se les creó contrato</strong>.{" "}
                    El problema no es de activos viejos — los activos
                    ingresados desde 2021 tienen tasas de orfandad del 70-72%,
                    peor que los de hace 20 años (67%).{" "}
                    {(
                      (s.activosSinComodato / s.totalActivos) *
                      100
                    ).toFixed(1)}
                    % de los activos comodato carecen de contrato. Ver la pestaña
                    &quot;Análisis Profundo&quot; para el detalle completo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Select value={selectedCia} onValueChange={(v) => { setSelectedCia(v); setHuerfanosPage(0); setActivosPage(0); setBaseInstaladaPage(0); setBaseSinActivoPage(0); }}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Todas las compañías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las compañías</SelectItem>
              {porCompania.data?.map((c) => (
                <SelectItem key={c.no_cia} value={c.no_cia}>
                  {CIA_NAMES[c.no_cia] || c.no_cia} ({formatNumber(Number(c.total_activos))})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en todos los activos (nombre, marca, modelo, cliente...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            )}
          </div>
          {searchFilter && (
            <p className="text-xs text-muted-foreground">
              {huerfanos.data?.total ?? "..."} huérfanos · {activos.data?.total ?? "..."} activos encontrados
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              summary.refetch();
              porCompania.refetch();
              porEstado.refetch();
              huerfanos.refetch();
              activos.refetch();
              baseInstalada.refetch();
              baseSinActivo.refetch();
              depreciacion.refetch();
              cohortes.refetch();
              trazabilidad.refetch();
              statusDetallado.refetch();
            }}
            className="gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Actualizar
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-1">
              <BarChart3 className="w-4 h-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="huerfanos" className="gap-1">
              <EyeOff className="w-4 h-4" />
              Huérfanos
              {huerfanos.data && (
                <Badge variant="destructive" className="ml-1 text-[10px] px-1.5 py-0">
                  {formatNumber(huerfanos.data.total)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activos" className="gap-1">
              <Package className="w-4 h-4" />
              Todos los Activos
            </TabsTrigger>
            <TabsTrigger value="baseInstalada" className="gap-1">
              <MapPin className="w-4 h-4" />
              Base Instalada
              {baseInstalada.data && (
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                  {formatNumber(baseInstalada.data.total)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sinActivo" className="gap-1">
              <Unlink className="w-4 h-4" />
              Sin Activo
              {baseSinActivo.data && (
                <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 text-amber-600 border-amber-200">
                  {formatNumber(baseSinActivo.data.total)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analisis" className="gap-1">
              <ShieldAlert className="w-4 h-4" />
              Análisis Profundo
            </TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ─────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-6">
            {/* By Company */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Distribución por Compañía
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {porCompania.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Compañía</TableHead>
                        <TableHead className="text-right">
                          Total Activos
                        </TableHead>
                        <TableHead className="text-right">
                          Con Contrato
                        </TableHead>
                        <TableHead className="text-right">
                          Sin Contrato
                        </TableHead>
                        <TableHead className="text-right">
                          % Invisible
                        </TableHead>
                        <TableHead className="text-right">
                          Valor Original
                        </TableHead>
                        <TableHead className="text-right">
                          Valor Neto
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {porCompania.data?.map((row) => {
                        const total = Number(row.total_activos);
                        const sinContrato = Number(row.sin_comodato);
                        const pctInvisible =
                          total > 0
                            ? ((sinContrato / total) * 100).toFixed(1)
                            : "0";
                        return (
                          <TableRow key={row.no_cia}>
                            <TableCell className="font-medium">
                              {CIA_NAMES[row.no_cia] || row.no_cia}
                              <span className="text-xs text-muted-foreground ml-1">
                                ({row.no_cia})
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(total)}
                            </TableCell>
                            <TableCell className="text-right text-emerald-600">
                              {formatNumber(Number(row.con_comodato))}
                            </TableCell>
                            <TableCell className="text-right text-rose-600 font-medium">
                              {formatNumber(sinContrato)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  parseFloat(pctInvisible) > 50
                                    ? "bg-rose-100 text-rose-700"
                                    : parseFloat(pctInvisible) > 30
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {pctInvisible}%
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {formatMoney(Number(row.valor_original))}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {formatMoney(Number(row.valor_neto))}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* By Status — Summary cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Estado de Contratos (ARAFCOM)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {porEstado.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-3">
                    {porEstado.data?.map((row) => {
                      const isInstalled = row.status === "Instalado";
                      const isOrphan = row.status === "Sin contrato";
                      const isNoInstalado = row.status === "No instalado";
                      return (
                        <div
                          key={row.status}
                          className={`p-4 rounded-lg border ${
                            isOrphan
                              ? "border-rose-200 bg-rose-50/50"
                              : isInstalled
                              ? "border-emerald-200 bg-emerald-50/50"
                              : isNoInstalado
                              ? "border-amber-200 bg-amber-50/50"
                              : "border-muted"
                          }`}
                        >
                          <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            {isInstalled && <MapPin className="w-3.5 h-3.5 text-emerald-600" />}
                            {isNoInstalado && <Warehouse className="w-3.5 h-3.5 text-amber-600" />}
                            {isOrphan && <EyeOff className="w-3.5 h-3.5 text-rose-600" />}
                            {row.status}
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {formatNumber(Number(row.count))}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatMoney(Number(row.valor_original))} valor original
                          </p>
                          {isNoInstalado && (
                            <p className="text-[10px] text-amber-700 mt-1">
                              Tienen contrato pero no están desplegados
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Status Breakdown */}
            {statusDetallado.data && statusDetallado.data.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Warehouse className="w-4 h-4" />
                    Desglose Detallado: ¿Dónde están los equipos?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estado</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Con Cliente</TableHead>
                        <TableHead className="text-right">Sin Cliente</TableHead>
                        <TableHead className="text-right">Equipo PROMED</TableHead>
                        <TableHead className="text-right">Valor Original</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statusDetallado.data.map((row, idx) => {
                        const isOrphan = row.status === "Sin contrato";
                        const isInstalled = row.status === "Instalado";
                        return (
                          <TableRow key={`${row.status}-${row.ubicacion}-${idx}`} className={isOrphan ? "bg-rose-50/30" : ""}>
                            <TableCell>
                              <span className={`text-sm font-medium ${
                                isOrphan ? "text-rose-700" : isInstalled ? "text-emerald-700" : "text-amber-700"
                              }`}>
                                {row.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {row.ubicacion}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatNumber(row.total)}
                            </TableCell>
                            <TableCell className="text-right">
                              {row.con_cliente > 0 ? (
                                <span className="flex items-center justify-end gap-1 text-emerald-600">
                                  <Users className="w-3 h-3" />
                                  {formatNumber(row.con_cliente)}
                                </span>
                              ) : "—"}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {row.sin_cliente > 0 ? formatNumber(row.sin_cliente) : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              {row.equipo_promed_s > 0 && (
                                <span className="text-xs">
                                  {formatNumber(row.equipo_promed_s)} S
                                  {row.equipo_promed_n > 0 && <span className="text-muted-foreground"> / {formatNumber(row.equipo_promed_n)} N</span>}
                                </span>
                              )}
                              {row.equipo_promed_s === 0 && row.equipo_promed_n === 0 && "—"}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {formatMoney(row.valor_original)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="px-4 py-3 border-t bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                      <strong>&quot;No instalado&quot;</strong> = tiene contrato en ARAFCOM pero el equipo no está desplegado en sitio.
                      {" "}La mayoría están en bodega PROMED con un cliente ya asignado.
                      {" "}<strong>&quot;Equipo PROMED&quot;</strong>: S = propiedad de PROMED, N = equipo de tercero.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Source Explanation */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="pt-5">
                <h3 className="font-semibold text-foreground mb-3">
                  Fuentes de Datos
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">NAF6.ARAFMA</p>
                    <p className="text-xs text-muted-foreground">
                      Registro de activos fijos con depreciación, marca, modelo, serie.
                      Campo <code className="text-[10px] bg-muted px-1 rounded">indcomodato</code> indica si es comodato.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">NAF6.ARAFCOM</p>
                    <p className="text-xs text-muted-foreground">
                      Contratos de comodato con número, cliente, status (Instalado/No instalado),
                      fechas y monto mensual. Se une por{" "}
                      <code className="text-[10px] bg-muted px-1 rounded">equipo_activo</code>.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      INVENTARIO.BASE_INSTALADA
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vista de base instalada con{" "}
                      {s && formatNumber(s.baseInstaladaComodatos)} registros
                      tipo COMODATO. Incluye cliente, ubicación, KAM y
                      tipo de contrato.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Huérfanos Tab ────────────────────────────────── */}
          <TabsContent value="huerfanos" className="space-y-4">
            <Card className="border-rose-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2 text-rose-700">
                    <EyeOff className="w-4 h-4" />
                    Activos Huérfanos — Comodato sin Contrato
                  </CardTitle>
                  {huerfanos.data && (
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(huerfanos.data.total)} registros
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {huerfanos.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cía</TableHead>
                            <TableHead>No. Activo</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Marca / Modelo</TableHead>
                            <TableHead className="text-right">
                              Valor Original
                            </TableHead>
                            <TableHead className="text-right">
                              Valor Neto
                            </TableHead>
                            <TableHead>Fecha Ingreso</TableHead>
                            <TableHead>Centro Costo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {huerfanos.data?.rows.map((row, idx) => (
                              <TableRow key={`${row.no_cia}-${row.no_acti}-${idx}`}>
                                <TableCell className="text-xs">
                                  {CIA_NAMES[row.no_cia] || row.no_cia}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {row.no_acti}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate text-sm">
                                  {row.descri}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {[row.marca, row.modelo]
                                    .filter(Boolean)
                                    .join(" / ") || "—"}
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                  {formatMoney(Number(row.val_original))}
                                </TableCell>
                                <TableCell className="text-right text-sm font-medium">
                                  {formatMoney(Number(row.val_neto))}
                                </TableCell>
                                <TableCell className="text-xs">
                                  {formatDate(row.f_ingre)}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {row.centro_costo || "—"}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Pagination */}
                    {huerfanos.data && huerfanos.data.total > PAGE_SIZE && (
                      <div className="flex items-center justify-between px-4 py-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Mostrando{" "}
                          {huerfanosPage * PAGE_SIZE + 1}–
                          {Math.min(
                            (huerfanosPage + 1) * PAGE_SIZE,
                            huerfanos.data.total
                          )}{" "}
                          de {formatNumber(huerfanos.data.total)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={huerfanosPage === 0}
                            onClick={() =>
                              setHuerfanosPage((p) => Math.max(0, p - 1))
                            }
                          >
                            Anterior
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              (huerfanosPage + 1) * PAGE_SIZE >=
                              huerfanos.data.total
                            }
                            onClick={() => setHuerfanosPage((p) => p + 1)}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── All Activos Tab ───────────────────────────────── */}
          <TabsContent value="activos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Todos los Activos en Comodato
                  </CardTitle>
                  {activos.data && (
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(activos.data.total)} registros
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {activos.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cía</TableHead>
                            <TableHead>No. Activo</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Comodato</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Valor Original
                            </TableHead>
                            <TableHead className="text-right">
                              Valor Neto
                            </TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead>Fin</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activos.data?.rows.map((row, idx) => (
                              <TableRow
                                key={`${row.no_cia}-${row.no_acti}-${idx}`}
                                className={
                                  !row.no_comodato
                                    ? "bg-rose-50/50 dark:bg-rose-950/10"
                                    : ""
                                }
                              >
                                <TableCell className="text-xs">
                                  {CIA_NAMES[row.no_cia] || row.no_cia}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {row.no_acti}
                                </TableCell>
                                <TableCell className="max-w-[180px] truncate text-sm">
                                  {row.descri}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {row.no_comodato || (
                                    <span className="text-rose-500 font-medium">
                                      SIN CONTRATO
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="max-w-[160px] truncate text-xs">
                                  {row.cliente || "—"}
                                </TableCell>
                                <TableCell>
                                  {row.com_status ? (
                                    <Badge
                                      variant={
                                        row.com_status === "Instalado"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={`text-[10px] ${
                                        row.com_status === "Instalado"
                                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                          : ""
                                      }`}
                                    >
                                      {row.com_status}
                                    </Badge>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      —
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                  {formatMoney(Number(row.val_original))}
                                </TableCell>
                                <TableCell className="text-right text-sm font-medium">
                                  {formatMoney(Number(row.val_neto))}
                                </TableCell>
                                <TableCell className="text-xs">
                                  {formatDate(row.fecha_inic)}
                                </TableCell>
                                <TableCell className="text-xs">
                                  {formatDate(row.fecha_fin)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Pagination */}
                    {activos.data && activos.data.total > PAGE_SIZE && (
                      <div className="flex items-center justify-between px-4 py-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Mostrando{" "}
                          {activosPage * PAGE_SIZE + 1}–
                          {Math.min(
                            (activosPage + 1) * PAGE_SIZE,
                            activos.data.total
                          )}{" "}
                          de {formatNumber(activos.data.total)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={activosPage === 0}
                            onClick={() =>
                              setActivosPage((p) => Math.max(0, p - 1))
                            }
                          >
                            Anterior
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              (activosPage + 1) * PAGE_SIZE >=
                              activos.data.total
                            }
                            onClick={() => setActivosPage((p) => p + 1)}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Base Instalada Tab ─────────────────────────────── */}
          <TabsContent value="baseInstalada" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Base Instalada — Comodatos en Campo
                  </CardTitle>
                  {baseInstalada.data && (
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(baseInstalada.data.total)} registros
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registros de <strong>INVENTARIO.BASE_INSTALADA_PROMED</strong> con tipo_contrato = COMODATO.
                  Esta es la vista del equipo de servicio técnico — dónde están físicamente los equipos.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {baseInstalada.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cía</TableHead>
                            <TableHead>País</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Instalación</TableHead>
                            <TableHead>Marca / Modelo</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>No. Activo</TableHead>
                            <TableHead>KAM</TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead>Fin</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {baseInstalada.data?.rows.map((row, idx) => (
                            <TableRow key={`${row.sys_id}-${idx}`}>
                              <TableCell className="text-xs">
                                {CIA_NAMES[row.no_cia] || row.no_cia}
                              </TableCell>
                              <TableCell className="text-xs">{row.pais}</TableCell>
                              <TableCell className="max-w-[180px] truncate text-sm">
                                {row.nombre_cliente}
                              </TableCell>
                              <TableCell className="max-w-[160px] truncate text-xs text-muted-foreground">
                                {row.instalacion}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {[row.desc_marca, row.descmodelo].filter(Boolean).join(" / ") || "—"}
                              </TableCell>
                              <TableCell className="max-w-[140px] truncate text-xs">
                                {row.descequi || "—"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={row.est_instal === "Instalado" ? "default" : "secondary"}
                                  className={`text-[10px] ${
                                    row.est_instal === "Instalado"
                                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                      : ""
                                  }`}
                                >
                                  {row.est_instal}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {row.no_activo || (
                                  <span className="text-amber-500 font-medium">—</span>
                                )}
                              </TableCell>
                              <TableCell className="max-w-[120px] truncate text-xs text-muted-foreground">
                                {row.kam || "—"}
                              </TableCell>
                              <TableCell className="text-xs">{formatDate(row.fini_contr)}</TableCell>
                              <TableCell className="text-xs">{formatDate(row.ffin_contr)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {baseInstalada.data && baseInstalada.data.total > PAGE_SIZE && (
                      <div className="flex items-center justify-between px-4 py-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Mostrando{" "}
                          {baseInstaladaPage * PAGE_SIZE + 1}–
                          {Math.min((baseInstaladaPage + 1) * PAGE_SIZE, baseInstalada.data.total)}{" "}
                          de {formatNumber(baseInstalada.data.total)}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled={baseInstaladaPage === 0}
                            onClick={() => setBaseInstaladaPage((p) => Math.max(0, p - 1))}>
                            Anterior
                          </Button>
                          <Button variant="outline" size="sm"
                            disabled={(baseInstaladaPage + 1) * PAGE_SIZE >= baseInstalada.data.total}
                            onClick={() => setBaseInstaladaPage((p) => p + 1)}>
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Base Instalada Sin Activo Tab ──────────────────── */}
          <TabsContent value="sinActivo" className="space-y-4">
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                    <Unlink className="w-4 h-4" />
                    Base Instalada Sin Activo — Desconexión Campo ↔ Contabilidad
                  </CardTitle>
                  {baseSinActivo.data && (
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(baseSinActivo.data.total)} registros
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registros en la base instalada con tipo COMODATO donde <strong>no_activo es NULL o vacío</strong>.
                  El equipo de campo sabe que hay un equipo en comodato, pero no puede vincularlo
                  a ningún activo fijo en contabilidad.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {baseSinActivo.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cía</TableHead>
                            <TableHead>País</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Instalación</TableHead>
                            <TableHead>Marca / Modelo</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>KAM</TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead>Fin</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {baseSinActivo.data?.rows.map((row, idx) => (
                            <TableRow key={`${row.sys_id}-${idx}`} className="bg-amber-50/30 dark:bg-amber-950/10">
                              <TableCell className="text-xs">
                                {CIA_NAMES[row.no_cia] || row.no_cia}
                              </TableCell>
                              <TableCell className="text-xs">{row.pais}</TableCell>
                              <TableCell className="max-w-[180px] truncate text-sm">
                                {row.nombre_cliente}
                              </TableCell>
                              <TableCell className="max-w-[160px] truncate text-xs text-muted-foreground">
                                {row.instalacion}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {[row.desc_marca, row.descmodelo].filter(Boolean).join(" / ") || "—"}
                              </TableCell>
                              <TableCell className="max-w-[140px] truncate text-xs">
                                {row.descequi || "—"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={row.est_instal === "Instalado" ? "default" : "secondary"}
                                  className={`text-[10px] ${
                                    row.est_instal === "Instalado"
                                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                      : ""
                                  }`}
                                >
                                  {row.est_instal}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[120px] truncate text-xs text-muted-foreground">
                                {row.kam || "—"}
                              </TableCell>
                              <TableCell className="text-xs">{formatDate(row.fini_contr)}</TableCell>
                              <TableCell className="text-xs">{formatDate(row.ffin_contr)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {baseSinActivo.data && baseSinActivo.data.total > PAGE_SIZE && (
                      <div className="flex items-center justify-between px-4 py-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Mostrando{" "}
                          {baseSinActivoPage * PAGE_SIZE + 1}–
                          {Math.min((baseSinActivoPage + 1) * PAGE_SIZE, baseSinActivo.data.total)}{" "}
                          de {formatNumber(baseSinActivo.data.total)}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled={baseSinActivoPage === 0}
                            onClick={() => setBaseSinActivoPage((p) => Math.max(0, p - 1))}>
                            Anterior
                          </Button>
                          <Button variant="outline" size="sm"
                            disabled={(baseSinActivoPage + 1) * PAGE_SIZE >= baseSinActivo.data.total}
                            onClick={() => setBaseSinActivoPage((p) => p + 1)}>
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Análisis Profundo Tab ──────────────────────────── */}
          <TabsContent value="analisis" className="space-y-6">
            {/* Key Insight Banner */}
            <Card className="border-violet-300 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-card">
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <ShieldAlert className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-violet-800 dark:text-violet-300">
                      Hallazgo Principal: El problema NO es la depreciación
                    </h3>
                    <p className="text-sm text-violet-700/80 dark:text-violet-400/80">
                      La hipótesis inicial era que los activos depreciados se vuelven invisibles.
                      Los datos muestran lo contrario: <strong>los activos totalmente depreciados tienen una tasa de orfandad del 51%, menor que el promedio global (61%)</strong>.
                      El verdadero problema es que <strong>el proceso de creación de contratos en NAF6 está fallando sistemáticamente</strong> — 
                      los activos ingresados desde 2021 tienen tasas de orfandad del 70-72%, peor que los activos pre-2015 (67%).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trazabilidad — Three-Way Venn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ghost className="w-4 h-4" />
                  Trazabilidad: ¿En cuántos sistemas aparece cada activo?
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Cruce de ARAFMA × ARAFCOM × BASE_INSTALADA. Solo el segmento &quot;Rastreo Completo&quot; es 
                  visible en contabilidad, contratos Y campo simultáneamente.
                </p>
              </CardHeader>
              <CardContent>
                {trazabilidad.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {trazabilidad.data?.map((seg) => {
                      const total = trazabilidad.data!.reduce((s, r) => s + r.count, 0);
                      const pct = total > 0 ? ((seg.count / total) * 100).toFixed(1) : "0";
                      const isFullyTracked = seg.segment === "Rastreo Completo";
                      const isGhost = seg.segment === "Activo Fantasma";
                      return (
                        <div
                          key={seg.segment}
                          className={`p-4 rounded-lg border ${
                            isFullyTracked
                              ? "border-emerald-200 bg-emerald-50/50"
                              : isGhost
                              ? "border-rose-200 bg-rose-50/50"
                              : "border-muted"
                          }`}
                        >
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {seg.segment}
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {formatNumber(seg.count)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pct}% · {formatMoney(seg.valor_neto)} neto
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Depreciation Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Distribución de Depreciación vs. Orfandad
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  ¿Los activos más depreciados son los que pierden contrato? No — la tasa de orfandad es 
                  consistente (~50-60%) independientemente de la depreciación. Los totalmente depreciados tienen 51% vs 61% global.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {depreciacion.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Banda de Depreciación</TableHead>
                        <TableHead className="text-right">Activos</TableHead>
                        <TableHead className="text-right">Valor Original</TableHead>
                        <TableHead className="text-right">Valor Neto</TableHead>
                        <TableHead className="text-right">Huérfanos</TableHead>
                        <TableHead className="text-right">Tasa Orfandad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depreciacion.data?.map((row) => {
                        const orphanPct = row.count > 0 ? ((row.orphans / row.count) * 100).toFixed(1) : "0";
                        return (
                          <TableRow key={row.band}>
                            <TableCell className="font-medium text-sm">{row.band}</TableCell>
                            <TableCell className="text-right">{formatNumber(row.count)}</TableCell>
                            <TableCell className="text-right text-sm">{formatMoney(row.valor_original)}</TableCell>
                            <TableCell className="text-right text-sm">{formatMoney(row.valor_neto)}</TableCell>
                            <TableCell className="text-right text-rose-600 font-medium">
                              {formatNumber(row.orphans)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                parseFloat(orphanPct) > 50
                                  ? "bg-rose-100 text-rose-700"
                                  : parseFloat(orphanPct) > 30
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}>
                                {orphanPct}%
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Age Cohort Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Cohortes por Año de Ingreso
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  El problema empeora desde 2021: activos recientes (2021-2024) tienen tasas de orfandad del 70-72%.
                  Esto confirma una falla en el proceso de registro, no un efecto de envejecimiento.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {cohortes.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Año</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Huérfanos</TableHead>
                          <TableHead className="text-right">Tasa Orfandad</TableHead>
                          <TableHead className="text-right">Dep. Promedio</TableHead>
                          <TableHead className="w-[200px]">Tasa Visual</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cohortes.data?.filter(r => r.year >= 2010).map((row) => {
                          const orphanPct = row.total > 0 ? (row.orphans / row.total) * 100 : 0;
                          const depPct = row.avg_depreciation_pct != null ? row.avg_depreciation_pct * 100 : null;
                          return (
                            <TableRow key={row.year}>
                              <TableCell className="font-mono font-medium">{row.year}</TableCell>
                              <TableCell className="text-right">{formatNumber(row.total)}</TableCell>
                              <TableCell className="text-right text-rose-600 font-medium">
                                {formatNumber(row.orphans)}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  orphanPct > 50
                                    ? "bg-rose-100 text-rose-700"
                                    : orphanPct > 30
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}>
                                  {orphanPct.toFixed(1)}%
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-xs text-muted-foreground">
                                {depPct != null ? `${depPct.toFixed(0)}%` : "—"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        orphanPct > 50 ? "bg-rose-500" : orphanPct > 30 ? "bg-amber-500" : "bg-emerald-500"
                                      }`}
                                      style={{ width: `${Math.min(orphanPct, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-muted-foreground w-10 text-right">
                                    {orphanPct.toFixed(0)}%
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conclusions */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="pt-5 space-y-3">
                <h3 className="font-semibold text-foreground">
                  Conclusiones del Análisis
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-rose-700">Hipótesis Refutada</p>
                    <p className="text-xs text-muted-foreground">
                      &quot;Los activos depreciados se vuelven invisibles&quot; — FALSO. Solo 61 de 9,354 están totalmente depreciados.
                      Los totalmente depreciados tienen MEJOR trazabilidad (51% orfandad vs 61% promedio global).
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-violet-700">Hallazgo Real</p>
                    <p className="text-xs text-muted-foreground">
                      El flujo de creación de contratos en NAF6.ARAFCOM está roto. Los activos de 2021-2024 tienen 70-72% de orfandad.
                      Solo el 32% de todos los activos comodato aparecen en los 3 sistemas simultáneamente.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-700">Riesgo de Negocio</p>
                    <p className="text-xs text-muted-foreground">
                      Los activos con &quot;Solo Contrato&quot; (sin base instalada) representan valor significativo — 
                      posible equipo devuelto o perdido que sigue generando (o no) facturación.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-emerald-700">Recomendación</p>
                    <p className="text-xs text-muted-foreground">
                      Priorizar la corrección del workflow de alta de contratos antes de migrar a un nuevo ERP.
                      Migrar datos sucios a Oracle NetSuite perpetuaría el problema.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-between pt-6 border-t">
          <Link href="/procesos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Procesos Críticos
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
