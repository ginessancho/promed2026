import { ArrowLeft, ArrowRight, Database, DollarSign, AlertTriangle, CheckCircle2, Building2, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

const keyStats = [
  { label: 'Usuarios según RFP', value: '899', detail: '⚠️ Requiere validación - ver Mapeo de Módulos', warning: true },
  { label: 'Países operando', value: '7', detail: 'Panamá, CR, SV, HN, GT, NI, RD' },
  { label: 'Artículos en master', value: '313,787', detail: 'Clientes 8,095 • Proveedores 3,945' },
  { label: 'Transacciones 2024', value: '212K', detail: 'Facturas 35K • Inventario 92K • OC 51K • Tickets 34K' },
];

const timeline = [
  { phase: 'Análisis y Diseño', duration: '2-3 meses', status: 'pending' },
  { phase: 'Configuración y Desarrollo', duration: '3-4 meses', status: 'pending' },
  { phase: 'Migración de Datos', duration: '1-2 meses', status: 'pending' },
  { phase: 'UAT y Go-Live', duration: '2 meses', status: 'pending' },
  { phase: 'Estabilización', duration: '2-3 meses', status: 'pending' },
];

const keyRisks = [
  { title: 'Migración de datos', impact: 'Alto', description: '313,787 items + 8,095 clientes + 5 años historia' },
  { title: 'Adopción del cambio', impact: 'Alto', description: '899 usuarios en 5 módulos con procesos establecidos' },
  { title: 'Compliance multi-país', impact: 'Medio', description: '7 jurisdicciones con reglas fiscales distintas' },
  { title: 'Integraciones críticas', impact: 'Alto', description: '11 sistemas: Shopify, Kbox, WMS, EPM, Odoo + Quick Suite' },
];

export default function ERPIndex() {
  const formattedDate = new Intl.DateTimeFormat('es-PA', {
    dateStyle: 'long',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50/30 to-amber-50/20 dark:via-orange-950/10 dark:to-amber-950/10">
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
              <p className="text-sm font-semibold text-foreground">Migración ERP</p>
              <p className="text-xs text-muted-foreground">Actualizado {formattedDate}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-10">
        {/* Hero */}
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Evaluación Estratégica
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium">
              <Database className="w-4 h-4" />
              NAF 6.0
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <Globe className="w-4 h-4" />
              Oracle NetSuite
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Transición de ERP: De NAF 6.0 a Oracle NetSuite
          </h1>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            Evaluación integral para reemplazar el ERP legacy on-premise (NAF 6.0) con una solución 
            moderna en la nube que unifique operaciones multi-país, mejore la eficiencia y proporcione 
            visibilidad en tiempo real del negocio.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyStats.map((stat) => (
            <Card key={stat.label} className={`bg-card/50 ${stat.warning ? 'border-amber-300 dark:border-amber-700' : ''}`}>
              <CardContent className="pt-5">
                <p className={`text-3xl font-bold ${stat.warning ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                <p className={`text-xs ${stat.warning ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>{stat.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contexto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5 text-primary" />
                Contexto del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                PROMED S.A. opera en <strong>7 países de Centroamérica y el Caribe</strong>, 
                distribuyendo dispositivos médicos y servicios especializados. El sistema actual 
                (NAF 6.0) está fragmentado con múltiples herramientas satelitales.
              </p>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Integraciones críticas (11):</p>
                <div className="flex flex-wrap gap-1.5">
                  {['NAF 6.0', 'Shopify', 'Kbox', 'Odoo', 'Boston', 'WMS Eflow', 'Simpli-Route', 'Bitua', 'WMS Manhattan', 'Smartlog Galys', 'Google', 'Oracle EPM'].map((sys) => (
                    <span key={sys} className="px-2 py-0.5 rounded bg-muted text-xs">
                      {sys}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Data Lake: <strong>Quick Suite</strong></p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <p className="text-amber-800 dark:text-amber-200 text-xs">
                  <strong>Problema central:</strong> Falta de automatización, procesos manuales, 
                  datos siloed y dificultad para obtener visión unificada de operaciones regionales.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline Estimado de Implementación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timeline.map((item, idx) => (
                  <div key={item.phase} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.phase}</p>
                      <p className="text-xs text-muted-foreground">{item.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 pt-3 border-t">
                Total estimado: <strong>10-14 meses</strong> para implementación completa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Riesgos */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-foreground">Riesgos Clave Identificados</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {keyRisks.map((risk) => (
              <Card key={risk.title} className="bg-card/50">
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground text-sm">{risk.title}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      risk.impact === 'Alto' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      {risk.impact}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{risk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured: Modelo ROI */}
        <Link href="/erp/modelo-roi">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-200 dark:bg-emerald-800">
                    <DollarSign className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">📊 Modelo ROI Completo</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Dashboard ejecutivo</strong> con TCO actual vs NetSuite, beneficios, 
                      y todas las variables editables para calcular el retorno de inversión.
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      ✓ Actualizado con pricing Oracle confirmado: <strong>$504/usuario/año</strong> (682 usuarios)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                  Ver modelo
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Featured: Resumen de Decisiones */}
        <Link href="/erp/resumen-decisiones">
          <Card className="bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-950 dark:to-sky-900 border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-200 dark:bg-blue-800">
                    <AlertTriangle className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">📋 Resumen de Decisiones</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>8 preguntas clave</strong> que definen costo, alcance y licenciamiento.
                      3 decididas, 2 pendientes, <span className="text-red-600 font-medium">3 bloqueadas</span>.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                  Ver matriz
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* CTA */}
        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/erp/mapeo-modulos">
            <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900 border-amber-200 dark:border-amber-800 hover:border-amber-400 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-800">
                    <Users className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                  </div>
                  <h3 className="font-semibold text-foreground">Mapeo de Módulos</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  ⚠️ <strong>Crítico:</strong> Definir usuarios reales por módulo NAF → NetSuite.
                  El RFP dice 899, pero ¿cuántos necesitan licencia?
                </p>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-sm font-medium">
                  Mapear módulos
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full bg-muted/30 border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-muted">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Decisiones Confirmadas</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                <li>✅ Facturación → NetSuite</li>
                <li>✅ CRM Odoo → NetSuite CRM</li>
                <li>✅ Data lake AWS se mantiene</li>
                <li>✅ NAF se elimina completamente</li>
              </ul>
              <p className="text-xs text-muted-foreground italic">
                Ver matriz completa para decisiones pendientes
              </p>
            </CardContent>
          </Card>

          <Link href="/erp/costo-beneficio">
            <Card className="h-full bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Calculadora Legacy</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Versión anterior de la calculadora de costos.
                  <strong> Usar Modelo ROI</strong> para análisis completo.
                </p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  Ver versión anterior
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground pt-6 border-t">
          <p>
            Este análisis se basa en el RFP de PROMED y la evaluación de transición ERP. 
            Las cifras son estimaciones sujetas a validación con vendors.
          </p>
        </div>
      </main>
    </div>
  );
}

