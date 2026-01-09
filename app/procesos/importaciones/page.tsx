"use client";

import { ArrowLeft, AlertTriangle, DollarSign, Clock, Users, Ship, HelpCircle, ArrowRight, CheckCircle2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORTACIONES + COSTEO - Import-to-Stock
// ACTUALIZADO: Con insights del análisis de licenciamiento y roles
// ═══════════════════════════════════════════════════════════════════════════════

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

// Datos del análisis
const NETSUITE_FULL_USER = 129; // USD/mes
const IMPORT_USERS_TOTAL = 80;

// Perfiles de usuarios Import - PENDIENTE CONFIRMAR (mismo patrón que ST)
const perfilesImport = [
  { 
    perfil: 'Import Lead / Coordinador', 
    cantidad: null, 
    operaciones: ['Crea expedientes de importación', 'Gestiona con aduana', 'Asigna costos landed'],
    licenciaSugerida: 'Full User ($129/mes)',
    status: 'pendiente',
    esCreador: true,
  },
  { 
    perfil: 'Analista de Costeo', 
    cantidad: null, 
    operaciones: ['Calcula y revisa landed cost', 'Prorratea costos', 'Valida márgenes'],
    licenciaSugerida: 'Full User ($129/mes)',
    status: 'pendiente',
    esCreador: true,
  },
  { 
    perfil: 'Comercio Exterior', 
    cantidad: null, 
    operaciones: ['Gestiona documentos de aduana', 'Coordina liberación', 'Tracking de embarques'],
    licenciaSugerida: 'Full User ($129/mes)',
    status: 'pendiente',
    esCreador: true,
  },
  { 
    perfil: 'Solo Consulta (Ventas, Operaciones)', 
    cantidad: null, 
    operaciones: ['Ver estado de pedido/embarque', 'Consultar ETA', 'Ver disponibilidad en tránsito'],
    licenciaSugerida: 'Self-Service ($49/mes) o Portal ($0)',
    status: 'pendiente',
    esCreador: false,
  },
];

// Métricas del proceso
const metricas = {
  ocProveedoresAnio: 41573,
  usuariosActuales: 80,
  paisesOrigen: 'TBD',
};

export default function Importaciones() {
  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());
  
  // Cálculo del impacto de licencias
  const costoSiTodosFull = IMPORT_USERS_TOTAL * NETSUITE_FULL_USER * 12;
  const costoEscenarioOptimizado = (20 * NETSUITE_FULL_USER + 30 * 49) * 12; // 20 full + 30 self-service + 30 portal
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20">
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
              <h1 className="text-lg font-bold">Importaciones + Costeo</h1>
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
          <h2 className="text-2xl font-bold">Import-to-Stock con Landed Cost</h2>
          <p className="text-sm text-muted-foreground">
            Control del proceso de importación desde la orden de compra hasta el ingreso a inventario.
            <strong className="text-amber-600"> El landed cost correcto es crítico para márgenes y pricing reales.</strong>
          </p>
        </section>

        {/* Alerta de clasificación de usuarios */}
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5" />
              Pendiente: Clasificación de los 80 usuarios de Importaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Problema:</strong> Negocio dice "todos consultan y registran" — esto es demasiado genérico 
              para definir licencias. Necesitamos forzar una clasificación por tipo de operación.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  Preguntas a responder
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• ¿Cuántos <strong>crean</strong> expedientes de importación?</li>
                  <li>• ¿Cuántos hacen <strong>costeo</strong> (calculan landed cost)?</li>
                  <li>• ¿Cuántos solo <strong>consultan</strong> estado de pedido/embarque?</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Resultado esperado
                </p>
                <p className="text-xs text-muted-foreground">
                  Tabla de roles con cantidades: <strong>Import Lead, Analista de Costeo, Solo Consulta</strong> 
                  para que el partner proponga mezcla de licencias Full User / Self-Service / Portal.
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
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-muted-foreground">USUARIOS</span>
              </div>
              <p className="text-2xl font-bold">~{IMPORT_USERS_TOTAL}</p>
              <p className="text-xs text-muted-foreground">según RFP</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-muted-foreground">OC/AÑO</span>
              </div>
              <p className="text-2xl font-bold">{metricas.ocProveedoresAnio.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">órdenes a proveedores</p>
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
                <span className="text-xs text-muted-foreground">ESCENARIO OPTIMIZADO</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatMoney(costoEscenarioOptimizado)}</p>
              <p className="text-xs text-muted-foreground">/año (25% full users)</p>
            </CardContent>
          </Card>
        </section>

        {/* Perfiles de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Perfiles de Usuario Importaciones (Pendiente Confirmar)
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
                  <TableHead>¿Crea transacciones?</TableHead>
                  <TableHead>Licencia sugerida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perfilesImport.map((perfil) => (
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
                    <TableCell>
                      {perfil.esCreador ? (
                        <span className="text-xs text-red-600 font-medium">Sí → Full User</span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">No → Self-Service/Portal</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{perfil.licenciaSugerida}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* NetSuite Landed Cost */}
        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              NetSuite Sí Tiene Módulo de Landed Cost Nativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A diferencia de Servicio Técnico, <strong>el landed cost SÍ es funcionalidad estándar de NetSuite</strong>. 
              No requiere desarrollo custom ni herramientas adicionales.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-emerald-700 mb-2">Funcionalidad incluida:</p>
                <ul className="space-y-1">
                  {[
          'Landed cost calculado automáticamente al cerrar embarque',
                    'Prorrateo por valor, peso o cantidad',
                    'Recepción parcial y backorders',
                    'Visibilidad "in-transit" con aging',
                    'Documentos vinculados al embarque',
                  ].map((item, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <p className="text-xs font-semibold text-foreground mb-2">Beneficio principal:</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Márgenes reales para pricing y análisis de rentabilidad
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Hoy el landed cost en Excel genera costo de venta distorsionado y márgenes ficticios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fricciones actuales */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Fricciones del Proceso Actual</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { titulo: 'Landed cost en Excel', desc: 'Flete, seguro, aranceles distribuidos "aproximadamente"', impacto: 'alto', horas: 8 },
              { titulo: 'Recepción física vs sistema', desc: 'Parciales, backorders, sustituciones mal reflejados', impacto: 'alto', horas: 6 },
              { titulo: 'Ítems "en tránsito" sin dueño', desc: 'Mercancía atrapada sin responsable claro', impacto: 'medio', horas: 3 },
              { titulo: 'Docs aduaneros desconectados', desc: 'Sin link entre declaración y lote/serial', impacto: 'medio', horas: 4 },
              { titulo: 'Posting retrasado', desc: 'Mercancía disponible pero no en ERP', impacto: 'alto', horas: 5 },
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
                    <Clock className="w-3 h-3" /> {friccion.horas}h/semana ≈ {formatMoney(friccion.horas * 52 * 25)}/año
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Actores del proceso */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actores y Responsabilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol</TableHead>
                  <TableHead>Responsabilidad</TableHead>
                  <TableHead>Sistema actual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { rol: 'Compras / Procurement', resp: 'Genera PO a proveedores internacionales', sistema: 'NAF' },
                  { rol: 'Comercio Exterior', resp: 'Gestiona aduanas, documentación, liberación', sistema: 'Excel, Email' },
                  { rol: 'Contabilidad / Costos', resp: 'Calcula y asigna landed cost', sistema: 'Excel' },
                  { rol: 'Almacén', resp: 'Recibe físicamente y reporta diferencias', sistema: 'NAF, WMS' },
                  { rol: 'Ventas', resp: 'Consulta disponibilidad para promesas', sistema: 'NAF (consulta)' },
                ].map((actor) => (
                  <TableRow key={actor.rol}>
                    <TableCell className="font-medium">{actor.rol}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{actor.resp}</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded bg-muted text-xs">{actor.sistema}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900 border-amber-200">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-foreground mb-3">Próximos pasos para Importaciones:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">1.</span>
                <span><strong>Clasificar usuarios:</strong> Forzar a negocio a dividir los 80 usuarios en creadores vs consultores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">2.</span>
                <span><strong>Mapear proceso actual:</strong> Documentar cómo se calcula landed cost hoy paso a paso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">3.</span>
                <span><strong>Validar con partner:</strong> Confirmar que NetSuite cubre el modelo de prorrateo necesario</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">4.</span>
                <span><strong>Definir integración WMS:</strong> ¿Cómo se sincroniza recepción física con NetSuite?</span>
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

