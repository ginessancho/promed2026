"use client";

import {
  ArrowLeft,
  Wrench,
  Database,
  Code,
  ListOrdered,
  Target,
  BookOpen,
  Activity,
  ShieldCheck,
  Workflow,
  Microscope,
  ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MermaidDiagram from '@/components/MermaidDiagram';
import { architectureDiagram } from '@/data/diagrams';
import CriticalFieldsTable from '@/components/CriticalFieldsTable';
import { facturaFields, clienteFields, productoFields } from '@/data/criticalFields';

export default function DetallesTecnicos() {
  const migrationSteps = [
    {
      title: '1. Preparación de Odoo 18',
      summary:
        'Actualizamos la instancia a Odoo 18 (Oct/2024) y la dejamos lista para operar el formulario F-007 digital sin mover el GL.',
      deliverables: [
        'Instancia Odoo 18 con Sales/CRM endurecida y monitoreada',
        'Formulario F-007 digital (campos, adjuntos, permisos por rol)',
        'Catálogo de clientes/productos sincronizado en modo lectura',
      ],
      owner: 'Alteridad + Promed IT',
    },
    {
      title: '2. Sincronización continua de maestros',
      summary:
        'Creamos pipelines Odoo ↔ NAF con validaciones bidireccionales; el DMS sólo agrega insights en paralelo sin ser dependencia.',
      deliverables: [
        'Webhooks y jobs idempotentes para cambios en maestros',
        'API NAF (REST/PL-SQL) documentada y accesible directamente',
        'Panel de discrepancias (puede vivir en DMS u otra consola) con SLA < 24 h',
      ],
      owner: 'Gateway + Alteridad',
    },
    {
      title: '3. Entrega directa al GL de NAF',
      summary:
        'Cada registro F-007 en Odoo genera un payload normalizado que NAF consume de inmediato; el DMS escucha los mismos eventos para reglas opcionales.',
      deliverables: [
        'Conector REST/PL-SQL documentado que apunta al GL de NAF',
        'Workflow automatizado de correos y SLAs para aprobaciones',
        'Rule Engine del DMS (opcional) conectado por contrato público',
      ],
      owner: 'Gateway',
    },
    {
      title: '4. Circuito ACID y observabilidad',
      summary:
        'Aseguramos commits ACID en ambos sistemas, auditoría completa y herramientas de Rayos X para intervenir cualquier evento.',
      deliverables: [
        'Replica Oracle GL para staging + scripts Python de reconciliación',
        'Trazas distribuidas (correlation-id) visibles en DMS',
        'Alertas y runbooks para incidentes de integración',
      ],
      owner: 'Alteridad + Promed Finanzas',
    },
  ];

  const f007Scope = [
    {
      title: 'Digitalización 1:1 del F-007',
      details:
        'Odoo replica cada campo obligatorio del formulario (datos de cliente, producto, márgenes, aprobaciones) y valida formatos antes de enviar nada a NAF.',
    },
    {
      title: 'Workflow y notificaciones',
      details:
        'Los correos que hoy disparan los equipos se convierten en plantillas automáticas, con recordatorios y firmas auditables dentro de Odoo.',
    },
    {
      title: 'Entrega directa al GL de NAF',
      details:
        'El conector empaqueta los datos en JSON/PL-SQL y los publica en los endpoints internos de NAF; el GL permanece en Oracle.',
    },
    {
      title: 'Monitoreo paralelo (opcional)',
      details:
        'El DMS puede escuchar los mismos eventos para generar alertas, pero Promed puede operar la integración aun si el DMS estuviera apagado.',
    },
  ];

  const rayosXStages = [
    {
      title: 'F-007 digital completado en Odoo',
      evento: 'El ejecutivo llena todos los campos del formulario dentro de Odoo 18.',
      instrumentacion: 'Formulario custom + validations (campos críticos, adjuntos obligatorios).',
      controles: ['Catálogo de clientes/productos sincronizado', 'Campos críticos marcados como required'],
    },
    {
      title: 'Workflow y correos automáticos',
      evento: 'Odoo dispara aprobaciones, recordatorios y notifica a los roles involucrados.',
      instrumentacion: 'Motor de actividades, colas de correo y logs firmados.',
      controles: ['Reglas de SLA para cada estado', 'Bitácora de quién aprobó y cuándo'],
    },
    {
      title: 'Payload enviado al GL de NAF',
      evento: 'El módulo de integración empaqueta el F-007 y lo envía al endpoint interno de NAF.',
      instrumentacion: 'Webhook/REST firmado + fallback PL/SQL; correlation-id compartido.',
      controles: ['Idempotencia por UUID', 'Cifrado en tránsito y validación de esquema'],
    },
    {
      title: 'NAF registra la transacción',
      evento: 'NAF crea la factura/entrada contable y responde con el folio oficial.',
      instrumentacion: 'Transacción ACID en Oracle; respuesta almacenada en Odoo.',
      controles: ['Confirmación de commit antes de cerrar el workflow', 'Conciliación automática con mirror'],
    },
    {
      title: 'Monitoreo opcional en DMS',
      evento: 'El DMS procesa el mismo evento para reglas, alertas o dashboards.',
      instrumentacion: 'Subscripción a webhooks; reglas pgvector/AI.',
      controles: ['Alertas proactivas ante desviaciones', 'Panel Rayos X independiente del GL'],
    },
  ];

  const acidPillars = [
    {
      title: 'Entornos de prueba aislados',
      details:
        'Replica Oracle GL (snapshot Data Guard / RMAN) + Odoo 18 staging con datos anonimizados.',
      bullets: ['Scripts Python comparan asientos ↔️ mirror', 'Datos sensibles ofuscados (NIST SP 800-53 SA-11)'],
    },
    {
      title: 'Transacciones ACID e idempotencia',
      details:
        'Cada evento lleva correlation-id, versionado y control de reintentos para asegurar commits consistentes.',
      bullets: [
        'Uso de queue_job / cron Odoo con confirmaciones',
        'Mapper NAF ejecuta PL/SQL dentro de BEGIN…COMMIT controlado',
      ],
    },
    {
      title: 'Normativas y monitoreo',
      details: 'Adherimos a Oracle MAA, ISO/IEC 27001 A.12/A.14 y OWASP ASVS V14 para integraciones.',
      bullets: ['Alertas DMS (email/SMS) ante fallas', 'Runbooks y KPIs públicos para Promed'],
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button></Link>
            <div className="text-right"><h1 className="text-lg font-bold">Detalles Técnicos</h1></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Wrench className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Detalles Técnicos</h2>
              <p className="text-base text-muted-foreground">Arquitectura e integración</p>
            </div>
          </div>
        </div>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Arquitectura de Integración</h3>
          <Card>
            <CardContent className="p-4">
              <MermaidDiagram id="architecture" chart={architectureDiagram} />
            </CardContent>
          </Card>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <ClipboardCheck className="w-7 h-7 text-rose-600" />
            Alcance específico del proyecto F-007
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            La integración se limita a digitalizar el formulario F-007 dentro de Odoo y enviar esa
            información directamente al General Ledger de NAF. No migramos el motor contable ni
            duplicamos los libros: Odoo actúa como punto de captura, orquestación de correos y
            auditoría previa al asiento final.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {f007Scope.map((item) => (
              <Card key={item.title}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                  {item.details}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Database className="w-7 h-7 text-primary" />
            Documentación de Sistemas
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Hoy Promed opera con Odoo 18 principalmente como CRM/gestion comercial y mantiene la
            contabilidad general (GL) y la facturación legal en NAF sobre Oracle. El WMS y el
            formulario F-007 en APEX completan el flujo actual; el DMS de Alteridad se propone como
            plataforma paralela y opcional, sin dependencia contractual.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-4 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="w-5 h-5" />
                  Odoo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-1.5">
                <p className="text-sm"><strong>Versión:</strong> 18.0 (Oct 2024)</p>
                <p className="text-sm"><strong>Módulos:</strong> Accounting, Sales, Inventory</p>
                <p className="text-sm"><strong>Uso actual:</strong> CRM, preventa y visibilidad comercial (sin GL)</p>
                <p className="text-sm"><strong>APIs:</strong> XML-RPC, JSON-RPC</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Documentación oficial:{' '}
                  <a
                    className="underline"
                    href="https://www.odoo.com/es_ES/page/release-notes"
                    target="_blank"
                    rel="noreferrer"
                  >
                    odoo.com/release-notes
                  </a>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="w-5 h-5" />
                  Oracle NAF
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-1.5">
                <p className="text-sm"><strong>Base:</strong> Oracle Database</p>
                <p className="text-sm"><strong>Tablas:</strong> FACTURAS, CLIENTES, PRODUCTOS</p>
                <p className="text-sm"><strong>Uso actual:</strong> Facturación legal y General Ledger oficial</p>
                <p className="text-sm"><strong>APIs:</strong> PL/SQL, REST (a confirmar)</p>
                <p className="text-xs text-muted-foreground mt-2">Documentación interna de Promed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="w-5 h-5" />
                  Alteridad DMS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-1.5">
                <p className="text-sm"><strong>Stack:</strong> Next.js 14, Supabase (PostgreSQL 15), Vercel Edge</p>
                <p className="text-sm"><strong>Rol:</strong> Motor de reglas, validación y mapper Odoo ↔ NAF</p>
                <p className="text-sm"><strong>APIs:</strong> REST, webhooks y colas internas</p>
                <p className="text-xs text-muted-foreground mt-2">Portal técnico: dms.alteridad.org/docs</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Workflow className="w-7 h-7 text-cyan-600" />
            Ruta de Migración Continua
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Esta hoja de ruta describe cómo movemos la facturación a Odoo 18 sin perder control del
            General Ledger en NAF. Cada fase deja entregables verificables y permite medir el avance
            como si tuviéramos Rayos X sobre el flujo contable.
          </p>
          <div className="space-y-4">
            {migrationSteps.map((step) => (
              <Card key={step.title} className="border-l-4 border-l-cyan-500">
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">Responsable: {step.owner}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3 text-sm">
                  <p>{step.summary}</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {step.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <ListOrdered className="w-7 h-7 text-purple-600" />
            Procesos Priorizados para Integración
          </h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Se han identificado 4 procesos críticos que requieren integración Odoo-NAF para mejorar la eficiencia operativa,
            garantizar la confianza en los datos y unificar los registros maestros entre sistemas.
          </p>
          
          <div className="space-y-4">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-500" />
                      1. Registro de Orden de Compra (OC)
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Prioridad: Alta | Responsables: OVNI, Sale Operation Squad</p>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold flex-shrink-0">P1</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Captura manual campo por campo en NAF</li>
                      <li>Riesgo de error al transcribir de PDF</li>
                      <li>Registro tardío o faltante de OC</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-green-600 dark:text-green-400">✅ Propuesta</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Sistematizar datos desde Odoo</li>
                      <li>Interfaz automática Odoo → NAF</li>
                      <li>Actualización automática del CRM</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      2. Creación de Cliente
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Prioridad: Alta | Responsables: Finanzas / Cobros</p>
                  </div>
                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold flex-shrink-0">P2</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Formulario Apex con 16 campos obligatorios</li>
                      <li>Aprobación de Prosp ace (mesa de ayuda)</li>
                      <li>Aprobación de Cobros para código NAF</li>
                      <li>Cuellos de botella: 35 min - 2 días</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-green-600 dark:text-green-400">✅ Propuesta</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Llenado desde Odoo con validaciones</li>
                      <li>Asignación automática de código NAF</li>
                      <li>Mejora del tiempo de facturación</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-yellow-600" />
                      3. Creación de Productos
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Prioridad: Media | Responsables: Grupo comercial, Inventario</p>
                  </div>
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-semibold flex-shrink-0">P3</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Dependencia de Prosp ace para crear producto</li>
                      <li>Creación duplicada en NAF</li>
                      <li>Cotización de productos con estatus vencido</li>
                      <li>Asuntos regulatorios desconoce productos nuevos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-green-600 dark:text-green-400">✅ Propuesta</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Creación controlada por Prosp ace</li>
                      <li>Proceso colaborativo con gestión regulatoria</li>
                      <li>Control de estatus regulatorio</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Involucrados:</strong> Tecnología, CX, Asuntos regulatorios, Gateway Resources
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      4. Gestión de Pedidos
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Prioridad: Media | Responsables: Sale Operation Squad</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold flex-shrink-0">P4</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">⚠️ Situación Actual</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Búsqueda manual en pantallas Apex (NAF)</li>
                      <li>Pipeline desactualizado</li>
                      <li>Identificación tardía de prórrogas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-sm text-green-600 dark:text-green-400">✅ Propuesta</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                      <li>Publicar estatus del pedido en Odoo</li>
                      <li>Pronóstico de facturación más real</li>
                      <li>Mayor trazabilidad post-OC</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Involucrados:</strong> Grupo comercial, Tecnología, CX, Gateway Resources
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Microscope className="w-7 h-7 text-amber-600" />
            Rayos X de la Integración
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Cada evento viaja con un <code>correlation-id</code> que podemos rastrear en Odoo, DMS y
            NAF. Así sabemos exactamente qué ocurrió, qué regla se ejecutó y cuál es el asiento
            resultante en el GL.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rayosXStages.map((stage) => (
              <Card key={stage.title}>
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">{stage.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2 text-sm">
                  <p>
                    <strong>Evento:</strong> {stage.evento}
                  </p>
                  <p>
                    <strong>Instrumentación:</strong> {stage.instrumentacion}
                  </p>
                  <div>
                    <strong>Controles:</strong>
                    <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                      {stage.controles.map((control) => (
                        <li key={control}>{control}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Opciones de Integración</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { opcion: 'Webhooks', pros: 'Tiempo real, bajo acoplamiento', contras: 'Requiere endpoint público', viabilidad: 'Alta' },
              { opcion: 'APIs REST', pros: 'Estándar, fácil de mantener', contras: 'Polling o eventos', viabilidad: 'Alta' },
              { opcion: 'Batch Processing', pros: 'Simple, robusto', contras: 'No es tiempo real', viabilidad: 'Media' },
            ].map((o, i) => (
              <Card key={i}>
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">{o.opcion}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1.5">
                  <p className="text-sm"><strong>Pros:</strong> {o.pros}</p>
                  <p className="text-sm"><strong>Contras:</strong> {o.contras}</p>
                  <p className="text-sm"><strong>Viabilidad:</strong> <span className={o.viabilidad === 'Alta' ? 'text-green-600' : 'text-orange-600'}>{o.viabilidad}</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <ListOrdered className="w-7 h-7 text-green-600" />
            Mapeo de Campos Críticos
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            A continuación se detallan los campos críticos que serán sincronizados entre Odoo y NAF para las entidades principales.
          </p>
          <CriticalFieldsTable title="Facturas" fields={facturaFields} />
          <CriticalFieldsTable title="Clientes" fields={clienteFields} />
          <CriticalFieldsTable title="Productos" fields={productoFields} />
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            Garantías ACID y Entornos de Prueba
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            El objetivo es que cada asiento generado en Odoo tenga su equivalente inmutable en NAF,
            probado antes en un espejo y monitoreado después en producción.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {acidPillars.map((pillar) => (
              <Card key={pillar.title} className="h-full">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2 text-sm">
                  <p>{pillar.details}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {pillar.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Fundamento Técnico y Documentación
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Nuestra estrategia se basa en las mejores prácticas y herramientas estándar proporcionadas por Odoo, garantizando una solución robusta, sostenible y alineada con la tecnología oficial.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:border-blue-500/50 transition-colors">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">API Externa (XML-RPC)</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">Utilizamos la API externa estándar de Odoo para una comunicación segura y fiable entre sistemas.</p>
                <a href="https://www.odoo.com/documentation/18.0/developer/reference/external_api.html" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Ver Documentación</Button>
                </a>
              </CardContent>
            </Card>
            <Card className="hover:border-blue-500/50 transition-colors">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Mapeo de Modelos (ORM)</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">Accedemos a los datos a través del ORM de Odoo, respetando la estructura y lógica de negocio de la plataforma.</p>
                <a href="https://www.odoo.com/documentation/18.0/developer/reference/orm.html" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Ver Documentación</Button>
                </a>
              </CardContent>
            </Card>
            <Card className="hover:border-blue-500/50 transition-colors">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Desarrollo de Módulos</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">El "Conector Directo" se empaqueta como un módulo personalizado, siguiendo las guías oficiales de desarrollo.</p>
                <a href="https://www.odoo.com/documentation/18.0/developer/howtos/rdtraining.html" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Ver Documentación</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Vea la Solución en Acción</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Acceda a nuestra página de demostración para ver un ejemplo práctico.</p>
                </div>
                <Link href="/facturacion/demonstracion">
                  <Button size="sm">Ir a la Demo</Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </section>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/facturacion/propuesta-2026"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Anterior</Button></Link>
          <Link href="/facturacion/mantenimiento-dms"><Button size="sm">Siguiente<ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></Button></Link>
        </div>
      </main>
    </div>
  );
}
