"use client";

import { useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, DollarSign, Clock, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE REUTILIZABLE PARA ANÁLISIS DE PROCESOS
// Copiar este archivo y ajustar los datos para cada proceso
// ═══════════════════════════════════════════════════════════════════════════════

interface ProcesoTemplateProps {
  config: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    backHref: string;
    backLabel: string;
    color: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';
  };
  situacionActual: {
    descripcion: string;
    actores: Array<{ rol: string; responsabilidad: string; }>;
    sistemas: string[];
    volumenes: Array<{ label: string; value: string; }>;
  };
  fricciones: Array<{
    id: string;
    titulo: string;
    descripcion: string;
    impacto: 'alto' | 'medio' | 'bajo';
    horasSemanales?: number;
  }>;
  defaultCostAssumptions: {
    horaPromedio: number;
    [key: string]: number;
  };
  propuestaMejora: {
    descripcion: string;
    beneficios: string[];
    timeline: string;
    inversion: string;
  };
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function ProcesoTemplate({
  config,
  situacionActual,
  fricciones,
  defaultCostAssumptions,
  propuestaMejora,
}: ProcesoTemplateProps) {
  const [costAssumptions, setCostAssumptions] = useState(defaultCostAssumptions);
  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());

  // Calcular costo total de fricciones
  const costoFriccionesAnual = useMemo(() => {
    return fricciones.reduce((total, friccion) => {
      const horasAnuales = (friccion.horasSemanales || 0) * 52;
      return total + (horasAnuales * costAssumptions.horaPromedio);
    }, 0);
  }, [fricciones, costAssumptions.horaPromedio]);

  const colorClasses = {
    blue: { bg: 'from-blue-50/50', accent: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    emerald: { bg: 'from-emerald-50/50', accent: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    violet: { bg: 'from-violet-50/50', accent: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' },
    amber: { bg: 'from-amber-50/50', accent: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    rose: { bg: 'from-rose-50/50', accent: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
  }[config.color];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorClasses.bg} to-background`}>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href={config.backHref}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {config.backLabel}
              </Button>
            </Link>
            <div className="text-right">
              <h1 className="text-lg font-bold">{config.title}</h1>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Intro */}
        <section className="space-y-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Análisis de Proceso
          </p>
          <h2 className="text-2xl font-bold">{config.subtitle}</h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </section>

        {/* KPIs Resumen */}
        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-muted-foreground">FRICCIONES</span>
              </div>
              <p className="text-2xl font-bold">{fricciones.length}</p>
              <p className="text-xs text-muted-foreground">identificadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span className="text-xs text-muted-foreground">HORAS/SEMANA</span>
              </div>
              <p className="text-2xl font-bold">
                {fricciones.reduce((sum, f) => sum + (f.horasSemanales || 0), 0)}
              </p>
              <p className="text-xs text-muted-foreground">en fricciones</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-rose-600" />
                <span className="text-xs text-muted-foreground">COSTO ANUAL</span>
              </div>
              <p className="text-2xl font-bold">{formatMoney(costoFriccionesAnual)}</p>
              <p className="text-xs text-muted-foreground">estimado</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-violet-600" />
                <span className="text-xs text-muted-foreground">ACTORES</span>
              </div>
              <p className="text-2xl font-bold">{situacionActual.actores.length}</p>
              <p className="text-xs text-muted-foreground">involucrados</p>
            </CardContent>
          </Card>
        </section>

        {/* Situación Actual */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Situación Actual</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Descripción del Proceso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{situacionActual.descripcion}</p>
                <div>
                  <p className="text-xs font-medium text-foreground mb-2">Sistemas involucrados:</p>
                  <div className="flex flex-wrap gap-2">
                    {situacionActual.sistemas.map(sys => (
                      <span key={sys} className="px-2 py-1 rounded bg-muted text-xs">{sys}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actores y Responsabilidades</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rol</TableHead>
                      <TableHead>Responsabilidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {situacionActual.actores.map(actor => (
                      <TableRow key={actor.rol}>
                        <TableCell className="font-medium text-sm">{actor.rol}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{actor.responsabilidad}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Fricciones */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Fricciones Identificadas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {fricciones.map(friccion => (
              <Card key={friccion.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground">{friccion.titulo}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      friccion.impacto === 'alto' ? 'bg-red-100 text-red-700' :
                      friccion.impacto === 'medio' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      Impacto {friccion.impacto}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{friccion.descripcion}</p>
                  {friccion.horasSemanales && (
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {friccion.horasSemanales}h/semana
                      </span>
                      <span className="text-rose-600 font-medium">
                        {formatMoney(friccion.horasSemanales * 52 * costAssumptions.horaPromedio)}/año
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Ajustar Supuestos */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Ajustar Supuestos de Costo</h3>
          <Card>
            <CardContent className="pt-5">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-1">
                  <span className="text-xs text-muted-foreground">Costo hora promedio (USD)</span>
                  <Input
                    type="number"
                    value={costAssumptions.horaPromedio}
                    onChange={(e) => setCostAssumptions(prev => ({
                      ...prev,
                      horaPromedio: Number(e.target.value) || 0
                    }))}
                    className="text-sm"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Propuesta de Mejora */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Propuesta de Mejora</h3>
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
            <CardContent className="pt-5 space-y-4">
              <p className="text-sm text-muted-foreground">{propuestaMejora.descripcion}</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Beneficios esperados:</p>
                  <ul className="space-y-1">
                    {propuestaMejora.beneficios.map((b, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="text-lg font-bold text-foreground">{propuestaMejora.timeline}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <p className="text-xs text-muted-foreground">Inversión estimada</p>
                  <p className="text-lg font-bold text-foreground">{propuestaMejora.inversion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="flex justify-between pt-6 border-t">
          <Link href={config.backHref}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {config.backLabel}
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Portal Principal</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
