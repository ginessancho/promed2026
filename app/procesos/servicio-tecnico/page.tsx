"use client";

import { ArrowLeft, AlertTriangle, CheckCircle2, DollarSign, Clock, Users, Wrench, HelpCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICIO TÉCNICO - Service-to-Cash + Compliance
// ACTUALIZADO: Con insights del análisis de licenciamiento y estrategia FSM
// ═══════════════════════════════════════════════════════════════════════════════

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

// Datos del análisis
const NETSUITE_FULL_USER = 129; // USD/mes
const ST_USERS_TOTAL = 150;

// Opciones de solución FSM
const solucionesfsm = [
  {
    id: 'fsm-externo',
    nombre: 'FSM Externo (ServiceMax, Salesforce FSL, etc.)',
    descripcion: 'Herramienta especializada de Field Service Management que se integra con NetSuite.',
    pros: ['Funcionalidad completa de FSM', 'App móvil robusta', 'Scheduling optimizado'],
    contras: ['Costo adicional de licencias', 'Integración compleja', 'Dos sistemas a mantener'],
    costoEstimado: '$30K-80K/año adicional',
    recomendado: false,
  },
  {
    id: 'suiteapp',
    nombre: 'SuiteApp de tercero (dentro de NetSuite)',
    descripcion: 'Aplicación de marketplace de NetSuite para Field Service.',
    pros: ['Integrado con NetSuite', 'Single source of truth', 'Sin integración compleja'],
    contras: ['Funcionalidad puede ser limitada', 'Dependencia de vendor pequeño'],
    costoEstimado: '$15K-40K/año adicional',
    recomendado: true,
  },
  {
    id: 'portal-custom',
    nombre: 'Portal propio sobre APIs de NetSuite',
    descripcion: 'Aplicación web/móvil custom que consume APIs de NetSuite para OT.',
    pros: ['100% personalizado', 'Sin licencias adicionales NetSuite', 'Control total'],
    contras: ['Desarrollo costoso', 'Mantenimiento interno', 'Time-to-market largo'],
    costoEstimado: '$50K-150K desarrollo + mantenimiento',
    recomendado: false,
  },
  {
    id: 'custom-records',
    nombre: 'Custom Records + Workflows en NetSuite',
    descripcion: 'Construir la funcionalidad de OT directamente en NetSuite con personalización.',
    pros: ['Todo en NetSuite', 'Sin integraciones', 'Flexible'],
    contras: ['Requiere configuración experta', 'No tiene app móvil nativa'],
    costoEstimado: 'Incluido en implementación',
    recomendado: true,
  },
];

// Perfiles de usuarios ST - PENDIENTE CONFIRMAR
const perfilesST = [
  { 
    perfil: 'Técnicos de campo', 
    cantidad: null, 
    operaciones: ['Ver OT asignadas', 'Registrar diagnóstico', 'Cerrar servicio', 'Registrar repuestos usados'],
    licenciaSugerida: 'Portal/App móvil ($0)',
    status: 'pendiente',
  },
  { 
    perfil: 'Coordinadores/Dispatch', 
    cantidad: null, 
    operaciones: ['Crear OT', 'Asignar técnicos', 'Reasignar', 'Gestionar escalaciones'],
    licenciaSugerida: 'Full User ($129/mes)',
    status: 'pendiente',
  },
  { 
    perfil: 'Backoffice ST', 
    cantidad: null, 
    operaciones: ['Facturar servicios', 'Gestionar contratos', 'Reportes SLA'],
    licenciaSugerida: 'Full User ($129/mes)',
    status: 'pendiente',
  },
  { 
    perfil: 'Supervisores/Gerentes', 
    cantidad: null, 
    operaciones: ['Dashboards', 'Aprobaciones', 'Reportes'],
    licenciaSugerida: 'Full User o Self-Service',
    status: 'pendiente',
  },
];

export default function ServicioTecnico() {
  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());
  
  // Cálculo del impacto de licencias si todos fueran full-user
  const costoSiTodosFull = ST_USERS_TOTAL * NETSUITE_FULL_USER * 12;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 to-background dark:from-violet-950/20">
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
            <div className="text-right">
              <h1 className="text-lg font-bold">Servicio Técnico</h1>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Intro */}
        <section className="space-y-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Análisis de Proceso + Estrategia de Licenciamiento
          </p>
          <h2 className="text-2xl font-bold">Service-to-Cash + Cumplimiento Regulatorio</h2>
          <p className="text-sm text-muted-foreground">
            Gestión de órdenes de servicio, técnicos en campo, repuestos y garantías de dispositivos médicos.
            <strong className="text-violet-600"> NetSuite no tiene módulo nativo de Field Service</strong> — 
            esto requiere definir una estrategia antes de avanzar.
          </p>
        </section>

        {/* Alerta crítica */}
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-5 h-5" />
              Decisión Bloqueada: Estrategia de Servicio Técnico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Problema:</strong> Los 150 usuarios de ST representan {formatMoney(costoSiTodosFull)}/año 
              si todos son Full Users. Pero la mayoría son técnicos de campo que podrían usar portal/app ($0).
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  Preguntas pendientes
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• ¿Cuántos son técnicos de campo vs administrativos/gestores?</li>
                  <li>• ¿Qué operación mínima requiere cada rol?</li>
                  <li>• ¿Pueden los técnicos usar solo app móvil?</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Acción requerida
                </p>
                <p className="text-xs text-muted-foreground">
                  Conteo de usuarios por perfil (campo vs oficina) y definir qué sistema usará cada uno 
                  antes de que el partner pueda cotizar licencias correctamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-violet-600" />
                <span className="text-xs text-muted-foreground">USUARIOS</span>
              </div>
              <p className="text-2xl font-bold">~150</p>
              <p className="text-xs text-muted-foreground">según RFP</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-muted-foreground">SI TODOS FULL USER</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{formatMoney(costoSiTodosFull)}</p>
              <p className="text-xs text-muted-foreground">/año</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-muted-foreground">SI CAMPO USA PORTAL</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatMoney(30 * NETSUITE_FULL_USER * 12)}</p>
              <p className="text-xs text-muted-foreground">/año (~20% full users)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-rose-600" />
                <span className="text-xs text-muted-foreground">AHORRO POTENCIAL</span>
              </div>
              <p className="text-2xl font-bold text-rose-600">{formatMoney(costoSiTodosFull - 30 * NETSUITE_FULL_USER * 12)}</p>
              <p className="text-xs text-muted-foreground">/año</p>
            </CardContent>
          </Card>
        </section>

        {/* Perfiles de usuarios ST */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              Perfiles de Usuario ST (Pendiente Confirmar)
            </CardTitle>
            <CardDescription>
              Necesitamos desglose por tipo de usuario para definir licencias correctamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Operaciones típicas</TableHead>
                  <TableHead>Licencia sugerida</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perfilesST.map((perfil) => (
                  <TableRow key={perfil.perfil}>
                    <TableCell className="font-medium">{perfil.perfil}</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs">
                        {perfil.cantidad ?? 'TBD'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {perfil.operaciones.join(', ')}
                    </TableCell>
                    <TableCell className="text-xs">{perfil.licenciaSugerida}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                        <HelpCircle className="w-3 h-3" />
                        Pendiente
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Opciones de solución FSM */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-violet-600" />
            Opciones de Solución para Field Service
          </h3>
          <p className="text-sm text-muted-foreground">
            NetSuite no tiene módulo nativo de FSM. Estas son las alternativas:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {solucionesfsm.map((sol) => (
              <Card key={sol.id} className={sol.recomendado ? 'border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{sol.nombre}</CardTitle>
                    {sol.recomendado && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <CardDescription>{sol.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-emerald-700 mb-1">Pros</p>
                      <ul className="space-y-0.5">
                        {sol.pros.map((pro, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-red-700 mb-1">Contras</p>
                      <ul className="space-y-0.5">
                        {sol.contras.map((con, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                            <XCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <strong>Costo estimado:</strong> {sol.costoEstimado}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Dependencias */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Dependencias del Módulo ST</CardTitle>
            <CardDescription>
              Servicio Técnico toca varios otros módulos de NetSuite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                { modulo: 'Facturación', razon: 'Para facturar servicios y partes', status: '✅ Va a NetSuite' },
                { modulo: 'Inventario', razon: 'Descargo de repuestos', status: '✅ Va a NetSuite' },
                { modulo: 'Activo Fijo', razon: 'Historial por serial', status: '✅ Va a NetSuite' },
                { modulo: 'Viáticos', razon: 'Gastos de técnicos', status: '⚠️ Definir' },
              ].map((dep) => (
                <div key={dep.modulo} className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                  <p className="font-medium text-sm">{dep.modulo}</p>
                  <p className="text-xs text-muted-foreground">{dep.razon}</p>
                  <p className="text-xs mt-1">{dep.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fricciones actuales */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Fricciones del Proceso Actual</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { titulo: 'OT fuera del sistema', desc: 'PDF, Word, WhatsApp — sin trazabilidad', impacto: 'alto', horas: 10 },
              { titulo: 'Partes no facturadas', desc: 'Repuestos salen de inventario pero no se cobran', impacto: 'alto', horas: 6 },
              { titulo: 'Sin tracking de SLA', desc: 'Tiempos de respuesta no medidos', impacto: 'medio', horas: 3 },
              { titulo: 'Historial fragmentado', desc: 'No hay vista consolidada por serial', impacto: 'alto', horas: 4 },
              { titulo: 'PM en Excel', desc: 'Mantenimientos preventivos sin alertas', impacto: 'medio', horas: 2 },
            ].map((friccion) => (
              <Card key={friccion.titulo}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{friccion.titulo}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      friccion.impacto === 'alto' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {friccion.impacto}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{friccion.desc}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {friccion.horas}h/semana
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        <Card className="bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-950 dark:to-violet-900 border-violet-200">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-foreground mb-3">Próximos pasos para ST:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-bold text-violet-600">1.</span>
                <span><strong>Conteo de perfiles:</strong> Clasificar los 150 usuarios en campo vs oficina con cantidades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-violet-600">2.</span>
                <span><strong>Definir estrategia FSM:</strong> SuiteApp vs Custom Records vs FSM externo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-violet-600">3.</span>
                <span><strong>Evaluar apps móviles:</strong> ¿Qué necesitan los técnicos en campo exactamente?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-violet-600">4.</span>
                <span><strong>Cotizar con partner:</strong> Una vez claro el alcance, pedir estimado</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between pt-6 border-t">
          <Link href="/procesos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Procesos Críticos
            </Button>
          </Link>
          <Link href="/erp/resumen-decisiones">
            <Button size="sm" className="gap-2">
              Ver matriz de decisiones
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

