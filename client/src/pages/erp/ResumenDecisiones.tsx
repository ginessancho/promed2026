import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, XCircle, HelpCircle, DollarSign, Users, Database, Wrench, Ship, Package, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'wouter';

// ═══════════════════════════════════════════════════════════════════════════════
// RESUMEN DE DECISIONES ERP - Matriz de preguntas clave
// Formato: pregunta → por qué importa → info que falta → decisión esperada
// ═══════════════════════════════════════════════════════════════════════════════

type DecisionStatus = 'decidido' | 'pendiente' | 'bloqueado';

interface Decision {
  id: string;
  categoria: string;
  icon: React.ElementType;
  pregunta: string;
  porQueImporta: string;
  impactoUSD?: string;
  infoQueFalta: string[];
  decisionEsperada: string;
  status: DecisionStatus;
  respuestaActual?: string;
  accionRequerida?: string;
}

const decisiones: Decision[] = [
  {
    id: 'usuarios-transacciones',
    categoria: 'Licenciamiento',
    icon: Users,
    pregunta: '¿Cuántos de los 600 "usuarios de Transacciones" realmente crean vs. solo consultan?',
    porQueImporta: 'La diferencia entre 600 full-users vs 100 full-users es de ~768K USD/año en licencias NetSuite.',
    impactoUSD: '~$768K/año',
    infoQueFalta: [
      '¿Quién crea pedidos a proveedor?',
      '¿Quién crea OC de clientes?',
      '¿Quién solo consulta inventarios/facturas/estados?',
      'Clasificación por perfil: ventas, admin, servicio, compras',
    ],
    decisionEsperada: 'Tabla de usuarios por tipo de operación (crear transacciones vs consultar) por área.',
    status: 'bloqueado',
    respuestaActual: 'Negocio dice "casi todos registran algo" — esto mata el ahorro si se toma literal.',
    accionRequerida: 'Forzar al negocio a clasificar usuarios por rol/tipo de operación con números concretos.',
  },
  {
    id: 'facturacion-netsuite',
    categoria: 'Alcance',
    icon: DollarSign,
    pregunta: '¿Facturación va a NetSuite o se queda en NAF/APEX?',
    porQueImporta: 'Sin Order-to-Cash en NetSuite el proyecto es "light". Con facturación completa, es transformacional.',
    impactoUSD: '~40% complejidad',
    infoQueFalta: [
      '¿NetSuite manejará facturación electrónica gobierno?',
      '¿Qué pasa con flujo F-007 de APEX?',
      '¿Se replica en NetSuite como formulario nativo o se mantiene APEX como front?',
    ],
    decisionEsperada: 'Facturación completa migra a NetSuite, incluyendo e-invoicing.',
    status: 'decidido',
    respuestaActual: '✅ Recomendación de negocio: migrar facturación a NetSuite.',
    accionRequerida: 'Definir estrategia para F-007 y pasarela de facturación electrónica.',
  },
  {
    id: 'servicio-tecnico',
    categoria: 'Módulos',
    icon: Wrench,
    pregunta: '¿Cómo se maneja Servicio Técnico? NetSuite no tiene módulo nativo.',
    porQueImporta: '150 usuarios × $129/mes = $19K/mes si todos son full-users. Pero técnicos de campo pueden usar portal ($0).',
    impactoUSD: '~$230K/año',
    infoQueFalta: [
      '¿Cuántos son técnicos de campo vs administrativos/gestores?',
      '¿Qué operación mínima requiere cada rol? (ver OT, cerrar OT, registrar repuestos)',
      'Estrategia: ¿FSM externo, SuiteApp, portal propio, custom records + workflows?',
    ],
    decisionEsperada: 'Diseño de solución ST con conteo de perfiles antes de definir licencias.',
    status: 'bloqueado',
    respuestaActual: 'ST depende de Facturación, Activo Fijo, Inventario, Viáticos. NetSuite no tiene módulo nativo → hay que desarrollar o comprar.',
    accionRequerida: 'Definir arquitectura de ST (FSM externo vs SuiteApp vs portal vs custom) y contar usuarios por tipo.',
  },
  {
    id: 'costos-actuales',
    categoria: 'ROI',
    icon: Database,
    pregunta: '¿Cuánto cuesta mantener NAF + APEX + AWS al año?',
    porQueImporta: 'Sin baseline de costos actuales, no hay ROI creíble.',
    impactoUSD: 'Base para ROI',
    infoQueFalta: [
      '¿Cuántos devs y a qué costo/hora?',
      '¿Qué % del tiempo va a NAF/APEX vs otras cosas?',
      'Costo QuickSuite (~$8K/año estimado)',
      'Costo WMS, Odoo si se eliminan/reducen',
    ],
    decisionEsperada: 'Cifra total: licencias + AWS + mano de obra interna + QuickSuite.',
    status: 'pendiente',
    respuestaActual: `Costos conocidos (~$47K/año sin mano de obra):
• Licencias Oracle: ~$20,251
• Mantenimiento C&W: $9,500
• AWS NAF/Ramanujan: ~$10,200
• APEX AWS: ~$7,464
⚠️ Falta: costo de devs (160h/mes/dev conocido, pero cuántos devs y costo/hora?)`,
    accionRequerida: 'Cerrar cifra de mano de obra interna (n devs, costo anual aproximado).',
  },
  {
    id: 'odoo-crm',
    categoria: 'Integraciones',
    icon: Package,
    pregunta: '¿Odoo CRM se mantiene o se reemplaza por NetSuite CRM?',
    porQueImporta: 'Dos CRMs = desorden y más integraciones. Uno solo = datos unificados.',
    impactoUSD: 'Integración extra si Odoo persiste',
    infoQueFalta: [
      '¿Hay algún proceso en Odoo que NetSuite CRM no cubra?',
      '¿Cómo se migran datos de Odoo a NetSuite?',
    ],
    decisionEsperada: 'NetSuite CRM reemplaza Odoo. Migración de datos incluida.',
    status: 'decidido',
    respuestaActual: '✅ Preferencia: CRM nativo de NetSuite.',
    accionRequerida: 'Documentar si hay proceso en Odoo que NetSuite no cubre.',
  },
  {
    id: 'wms-bodegueros',
    categoria: 'Módulos',
    icon: Package,
    pregunta: '¿Los bodegueros necesitan acceso a ERP o solo WMS?',
    porQueImporta: 'Portal/WMS = $0. Full user = costo de licencia innecesario.',
    impactoUSD: 'Variable según # usuarios',
    infoQueFalta: [
      'Número de usuarios en bodegas con WMS',
      'Número de usuarios en bodegas sin WMS',
      '¿Qué hacen en NAF que no hace el WMS? (ajustes, consultas, reportes)',
    ],
    decisionEsperada: 'Evaluar WMS nativo de NetSuite. Definir qué queda en WMS vs NetSuite.',
    status: 'pendiente',
    respuestaActual: 'Muchos usan WMS pero también NAF. Hay bodegas sin WMS.',
    accionRequerida: 'Contar usuarios por tipo de bodega y aclarar qué operaciones van a cada sistema.',
  },
  {
    id: 'importaciones-roles',
    categoria: 'Licenciamiento',
    icon: Ship,
    pregunta: '¿De los 80 usuarios de Importaciones, cuántos crean expedientes vs. solo consultan?',
    porQueImporta: 'Mismo patrón que Transacciones: separar creadores de consultores reduce licencias.',
    impactoUSD: 'Proporcional a usuarios',
    infoQueFalta: [
      '¿Cuántos crean expedientes de importación?',
      '¿Cuántos hacen costeo?',
      '¿Cuántos solo ven estado de pedido/embarque?',
    ],
    decisionEsperada: 'Tabla de roles: Import Lead, Analista, Solo Consulta con cantidades.',
    status: 'bloqueado',
    respuestaActual: 'Negocio dice "todos consultan y registran" — demasiado genérico.',
    accionRequerida: 'Forzar rediseño de roles para que partner proponga mezcla de licencias/portales.',
  },
  {
    id: 'quicksuite-datalake',
    categoria: 'Arquitectura',
    icon: BarChart3,
    pregunta: '¿NetSuite reemplaza el data lake o es solo una fuente más?',
    porQueImporta: 'NetSuite NO es un data lake. Definir arquitectura evita expectativas falsas.',
    impactoUSD: 'Arquitectura',
    infoQueFalta: [],
    decisionEsperada: 'NetSuite = fuente hacia el lake en AWS, no el repositorio central.',
    status: 'decidido',
    respuestaActual: '✅ Arquitectura confirmada: QuickSuite es visualización, lago real en AWS. NetSuite alimentará al lake.',
    accionRequerida: 'Ninguna — bien entendido.',
  },
];

const getStatusBadge = (status: DecisionStatus) => {
  switch (status) {
    case 'decidido':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          <CheckCircle2 className="w-3 h-3" />
          Decidido
        </span>
      );
    case 'pendiente':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
          <HelpCircle className="w-3 h-3" />
          Pendiente
        </span>
      );
    case 'bloqueado':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
          <XCircle className="w-3 h-3" />
          Bloqueado
        </span>
      );
  }
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

// Cálculo de costos conocidos
const costosConocidos = {
  licenciasOracle: 20251,
  mantenimientoCW: 9500,
  awsNafRamanujan: 10200,
  apexAws: 7464,
  quickSuite: 8000, // Estimado
};

const totalConocido = Object.values(costosConocidos).reduce((a, b) => a + b, 0);

export default function ResumenDecisiones() {
  const formattedDate = new Intl.DateTimeFormat('es-PA', { dateStyle: 'long' }).format(new Date());
  
  const decididos = decisiones.filter(d => d.status === 'decidido').length;
  const pendientes = decisiones.filter(d => d.status === 'pendiente').length;
  const bloqueados = decisiones.filter(d => d.status === 'bloqueado').length;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-slate-50/30 to-gray-50/20 dark:via-slate-950/10 dark:to-gray-950/10">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/erp">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Módulo ERP
                </Button>
              </Link>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">Resumen de Decisiones</p>
                <p className="text-xs text-muted-foreground">Actualizado {formattedDate}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 space-y-10">
          {/* Hero */}
          <section className="space-y-4 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Matriz de Decisiones
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Preguntas Clave para el Proyecto NetSuite
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Estas son las preguntas que definen el <strong>costo real</strong>, el <strong>alcance</strong> y 
              el <strong>modelo de licenciamiento</strong>. Sin respuestas claras, cualquier presupuesto es especulativo.
            </p>
          </section>

          {/* Status Summary */}
          <section className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-5">
                <p className="text-3xl font-bold text-foreground">{decisiones.length}</p>
                <p className="text-sm text-muted-foreground">Decisiones totales</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-5">
                <p className="text-3xl font-bold text-emerald-600">{decididos}</p>
                <p className="text-sm text-muted-foreground">Decididas</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="pt-5">
                <p className="text-3xl font-bold text-amber-600">{pendientes}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="pt-5">
                <p className="text-3xl font-bold text-red-600">{bloqueados}</p>
                <p className="text-sm text-muted-foreground">Bloqueadas</p>
              </CardContent>
            </Card>
          </section>

          {/* Costos Conocidos Quick Summary */}
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Costos Actuales Conocidos (sin mano de obra)
              </CardTitle>
              <CardDescription>
                Lo que sabemos del costo de NAF + APEX + infra. Falta agregar costo de IT interno.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20">
                  <p className="text-xs text-muted-foreground">Licencias Oracle</p>
                  <p className="text-lg font-bold">{formatMoney(costosConocidos.licenciasOracle)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20">
                  <p className="text-xs text-muted-foreground">Mant. C&W</p>
                  <p className="text-lg font-bold">{formatMoney(costosConocidos.mantenimientoCW)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20">
                  <p className="text-xs text-muted-foreground">AWS NAF</p>
                  <p className="text-lg font-bold">{formatMoney(costosConocidos.awsNafRamanujan)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20">
                  <p className="text-xs text-muted-foreground">APEX AWS</p>
                  <p className="text-lg font-bold">{formatMoney(costosConocidos.apexAws)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatMoney(totalConocido)}</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-4">
                ⚠️ Falta: Costo de mano de obra (N devs × costo/hora × 160h/mes × 12)
              </p>
            </CardContent>
          </Card>

          {/* Decision Matrix */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Matriz de Decisiones
            </h2>

            {decisiones.map((decision) => {
              const Icon = decision.icon;
              return (
                <Card key={decision.id} className={`${
                  decision.status === 'bloqueado' ? 'border-red-200 dark:border-red-800' :
                  decision.status === 'pendiente' ? 'border-amber-200 dark:border-amber-800' :
                  'border-emerald-200 dark:border-emerald-800'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          decision.status === 'decidido' ? 'bg-emerald-100 dark:bg-emerald-900' :
                          decision.status === 'pendiente' ? 'bg-amber-100 dark:bg-amber-900' :
                          'bg-red-100 dark:bg-red-900'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            decision.status === 'decidido' ? 'text-emerald-600' :
                            decision.status === 'pendiente' ? 'text-amber-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {decision.categoria}
                            </span>
                            {getStatusBadge(decision.status)}
                          </div>
                          <CardTitle className="text-base">{decision.pregunta}</CardTitle>
                        </div>
                      </div>
                      {decision.impactoUSD && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Impacto</p>
                          <p className="text-sm font-bold text-rose-600">{decision.impactoUSD}</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Por qué importa */}
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">¿Por qué importa?</p>
                      <p className="text-sm text-muted-foreground">{decision.porQueImporta}</p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {/* Info que falta */}
                      {decision.infoQueFalta.length > 0 && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            Información que falta
                          </p>
                          <ul className="space-y-1">
                            {decision.infoQueFalta.map((info, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                                {info}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Decisión esperada */}
                      <div className={`p-3 rounded-lg ${
                        decision.status === 'decidido' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-slate-50 dark:bg-slate-950/30'
                      }`}>
                        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Decisión esperada
                        </p>
                        <p className="text-xs text-muted-foreground">{decision.decisionEsperada}</p>
                      </div>
                    </div>

                    {/* Respuesta actual */}
                    {decision.respuestaActual && (
                      <div className={`p-3 rounded-lg border ${
                        decision.status === 'decidido' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200' 
                          : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200'
                      }`}>
                        <p className="text-xs font-semibold text-foreground mb-1">Respuesta actual:</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{decision.respuestaActual}</p>
                      </div>
                    )}

                    {/* Acción requerida */}
                    {decision.accionRequerida && decision.status !== 'decidido' && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          Acción requerida
                        </p>
                        <p className="text-sm text-foreground">{decision.accionRequerida}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Strategic Summary */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Resumen Estratégico</CardTitle>
              <CardDescription>
                Lo que debe quedar formalizado antes de ir a comité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Decisiones ya tomadas
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><strong>NetSuite = core ERP</strong> (incluye facturación, CxC, importaciones, inventario)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><strong>NAF = 0, APEX mínimo o eliminado</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><strong>Data lake en AWS se mantiene</strong> — NetSuite será otra fuente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><strong>CRM nativo de NetSuite</strong> reemplaza Odoo CRM</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Bloqueadores críticos
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <span><strong>Clasificar usuarios por rol</strong> (Transacciones, Importaciones, ST) con números concretos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <span><strong>Cerrar costo de TI interno</strong> (n devs, costo anual aproximado)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <span><strong>Definir estrategia para Servicio Técnico</strong> (módulo/portal/SuiteApp) y su impacto en licencias</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Link href="/erp">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver a ERP
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link href="/erp/costo-beneficio">
                <Button variant="outline" size="sm" className="gap-2">
                  Calculadora de Costos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/erp/mapeo-modulos">
                <Button size="sm" className="gap-2">
                  Mapeo de Módulos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pt-6 border-t">
            <p>
              Este resumen consolida las preguntas clave y respuestas del análisis de requerimientos.
              Última actualización: {formattedDate}
            </p>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

