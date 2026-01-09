"use client";

import { ArrowLeft, Box, Package, Gavel, Wrench, Ship, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESOS CRÍTICOS - Portal de Análisis
// ═══════════════════════════════════════════════════════════════════════════════

interface ProcesoConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  href: string;
  priority: number;
  status: 'analysis' | 'planned' | 'pending';
  keyQuestions: string[];
}

const procesos: ProcesoConfig[] = [
  {
    id: 'comodatos',
    title: 'Comodatos',
    subtitle: 'Equipos en préstamo a clientes',
    icon: Box,
    description: 'Equipos médicos entregados en comodato a hospitales y clínicas. Trazabilidad de contratos, facturación de fees mensuales y consumibles asociados.',
    href: '/procesos/comodatos',
    priority: 1,
    status: 'analysis',
    keyQuestions: [
      '¿Cuántos contratos de comodato activos existen hoy?',
      '¿Cuál es el fee mensual promedio por equipo?',
      '¿Qué porcentaje de comodatos tienen facturación al día?',
    ],
  },
  {
    id: 'activos',
    title: 'Activos Fijos',
    subtitle: 'Control y depreciación',
    icon: Package,
    description: 'Gestión de activos fijos de la empresa: equipos propios, vehículos, mobiliario. Control de ubicación, depreciación y mantenimiento.',
    href: '/procesos/activos',
    priority: 2,
    status: 'planned',
    keyQuestions: [
      '¿Cuántos activos fijos tiene la empresa?',
      '¿Qué porcentaje están correctamente documentados?',
      '¿Cuál es el valor total de activos?',
    ],
  },
  {
    id: 'administracion',
    title: 'Administración Operacional',
    subtitle: 'Procesos administrativos',
    icon: Gavel,
    description: 'Procesos administrativos centrales: planillas, compras, pagos a proveedores. Automatización y reducción de tareas manuales.',
    href: '/procesos/administracion',
    priority: 3,
    status: 'pending',
    keyQuestions: [
      '¿Cuántas horas semanales se dedican a tareas manuales?',
      '¿Qué procesos son candidatos a automatización?',
      '¿Cuál es el costo operativo actual?',
    ],
  },
  {
    id: 'servicio-tecnico',
    title: 'Servicio Técnico',
    subtitle: 'Mantenimiento y reparaciones',
    icon: Wrench,
    description: 'Tickets de servicio técnico, mantenimiento preventivo y correctivo de equipos médicos. SLAs y tiempos de respuesta.',
    href: '/procesos/servicio-tecnico',
    priority: 4,
    status: 'pending',
    keyQuestions: [
      '¿Cuántos tickets de servicio se generan mensualmente?',
      '¿Cuál es el tiempo promedio de resolución?',
      '¿Qué porcentaje de SLAs se cumplen?',
    ],
  },
  {
    id: 'importaciones',
    title: 'Importaciones',
    subtitle: 'Logística internacional',
    icon: Ship,
    description: 'Proceso de importación de equipos y consumibles. Coordinación con agentes aduanales, tiempos de tránsito y costos asociados.',
    href: '/procesos/importaciones',
    priority: 5,
    status: 'pending',
    keyQuestions: [
      '¿Cuál es el tiempo promedio de importación?',
      '¿Cuántas importaciones se realizan mensualmente?',
      '¿Qué porcentaje tiene demoras aduanales?',
    ],
  },
];

const getStatusBadge = (status: ProcesoConfig['status']) => {
  const styles = {
    analysis: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    planned: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  const labels = {
    analysis: 'En análisis',
    planned: 'Planificado',
    pending: 'Pendiente',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default function ProcesosIndex() {
  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-violet-50/30 to-purple-50/20 dark:via-violet-950/10 dark:to-purple-950/10">
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
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Análisis de Procesos
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            Procesos Críticos del Negocio
          </h1>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            Identificación y análisis de procesos operativos clave que impactan la eficiencia 
            y costos de PROMED. Cada proceso será analizado para identificar fricciones, 
            cuantificar pérdidas y proponer mejoras.
          </p>
        </section>

        {/* Resumen */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-5">
              <p className="text-3xl font-bold text-foreground">{procesos.length}</p>
              <p className="text-sm text-muted-foreground">Procesos identificados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-3xl font-bold text-emerald-600">1</p>
              <p className="text-sm text-muted-foreground">En análisis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-3xl font-bold text-muted-foreground">Por definir</p>
              <p className="text-sm text-muted-foreground">Impacto total estimado</p>
            </CardContent>
          </Card>
        </section>

        {/* Lista de Procesos */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Portafolio de Procesos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {procesos.map((proceso) => {
              const Icon = proceso.icon;
              return (
                <Link key={proceso.id} href={proceso.href}>
                  <Card className="h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                          <Icon className="w-5 h-5 text-violet-600" />
                        </div>
                        {getStatusBadge(proceso.status)}
                      </div>
                      <div className="space-y-1 pt-2">
                        <CardTitle className="text-lg">{proceso.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{proceso.subtitle}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {proceso.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground">Preguntas clave:</p>
                        <ul className="space-y-1">
                          {proceso.keyQuestions.slice(0, 2).map((q, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">• {q}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-end pt-2">
                        <Button variant="ghost" size="sm" className="gap-1 text-violet-600">
                          Ver análisis
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Metodología */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-foreground mb-3">Metodología de Análisis</h3>
            <div className="grid gap-4 md:grid-cols-4">
              {['Mapeo de proceso', 'Identificación de fricciones', 'Cuantificación de costos', 'Propuesta de mejora'].map((step, idx) => (
                <div key={step} className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground pt-6 border-t">
          <p>
            Los análisis siguen la misma metodología aplicada al proyecto de facturación.
            El orden de priorización se ajustará según impacto financiero identificado.
          </p>
        </div>
      </main>
    </div>
  );
}
