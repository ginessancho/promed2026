import ProcesoTemplate from './ProcesoTemplate';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMINISTRACIÓN OPERACIONAL - Multas + Pagos que Bloquean
// El costo oculto de la desorganización: penalidades y operaciones detenidas
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdministracionOperacional() {
  return (
    <ProcesoTemplate
      config={{
        id: 'administracion-operacional',
        title: 'Administración Operacional',
        subtitle: 'Multas + Pagos que Bloquean Operaciones',
        description: `El costo oculto de la desorganización administrativa: multas por incumplimiento de 
          tiempos (SLAs, entregas, regulatorio) y pagos a proveedores que detienen mercancía crítica. 
          Cuando no hay visibilidad de deadlines y cash flow, el dinero se pierde y las operaciones se frenan.`,
        backHref: '/procesos',
        backLabel: 'Procesos Críticos',
        color: 'rose',
      }}
      situacionActual={{
        descripcion: `Los tiempos críticos (SLAs con hospitales, fechas de pago a proveedores, deadlines 
          regulatorios) se gestionan en Excel, emails, o la memoria de alguien. Cuando se incumple un SLA, 
          el hospital aplica multa contractual. Cuando no se paga a tiempo al proveedor, retiene la mercancía 
          en origen o en aduana. No hay dashboard de "qué debo pagar urgente" vs "qué mercancía está en riesgo". 
          Las sorpresas son constantes y costosas.`,
        actores: [
          { rol: 'Administración / Finanzas', responsabilidad: 'Gestiona pagos a proveedores y cash flow' },
          { rol: 'Comercial / KAM', responsabilidad: 'Recibe reclamos y multas de hospitales' },
          { rol: 'Compras / Procurement', responsabilidad: 'Negocia con proveedores cuando hay bloqueo' },
          { rol: 'Importaciones', responsabilidad: 'Sufre cuando mercancía queda retenida' },
          { rol: 'Servicio Técnico', responsabilidad: 'Incumple SLAs cuando no tiene repuestos' },
          { rol: 'Legal', responsabilidad: 'Gestiona disputas por multas y penalidades' },
        ],
        sistemas: ['NAF 6.0 (Cuentas por Pagar)', 'Excel (tracking de deadlines)', 'Email (alertas manuales)', 'Contratos PDF'],
        volumenes: [
          { label: 'Multas anuales estimadas', value: 'TBD' },
          { label: 'Bloqueos de mercancía/año', value: 'TBD' },
          { label: 'Días promedio de retraso AP', value: 'TBD' },
        ],
      }}
      fricciones={[
        {
          id: 'f1',
          titulo: 'Multas por incumplimiento de SLAs',
          descripcion: 'Hospitales tienen contratos con tiempos de respuesta y resolución. Cuando no se cumplen, aplican penalidades. No hay tracking de SLAs ni alertas preventivas.',
          impacto: 'alto',
          horasSemanales: 4,
        },
        {
          id: 'f2',
          titulo: 'Proveedores retienen mercancía',
          descripcion: 'Facturas de proveedores vencidas = mercancía bloqueada en origen o aduana. Operaciones críticas se detienen. Se negocia caso por caso, con urgencia.',
          impacto: 'alto',
          horasSemanales: 6,
        },
        {
          id: 'f3',
          titulo: 'Sin visibilidad de deadlines críticos',
          descripcion: 'Fechas de vencimiento de pagos, SLAs, permisos regulatorios en Excel o cabeza de alguien. No hay un solo lugar para ver "qué vence esta semana".',
          impacto: 'alto',
          horasSemanales: 5,
        },
        {
          id: 'f4',
          titulo: 'Cash flow sin forecast',
          descripcion: 'No hay visión de "qué debo pagar" vs "qué ingresa" vs "qué mercancía está en riesgo". Decisiones de pago son reactivas, no estratégicas.',
          impacto: 'medio',
          horasSemanales: 3,
        },
        {
          id: 'f5',
          titulo: 'Penalidades por entregas tardías',
          descripcion: 'Contratos con hospitales incluyen penalidades por entrega fuera de fecha. Sin tracking de fechas comprometidas vs capacidad real de cumplir.',
          impacto: 'alto',
          horasSemanales: 3,
        },
        {
          id: 'f6',
          titulo: 'Disputas y negociaciones ad-hoc',
          descripcion: 'Cuando hay multa o bloqueo, se negocia caso por caso. No hay historial consolidado, no hay patrones identificados, no hay prevención.',
          impacto: 'medio',
          horasSemanales: 4,
        },
      ]}
      defaultCostAssumptions={{
        horaPromedio: 22,
      }}
      propuestaMejora={{
        descripcion: `Implementar en NetSuite: (1) Dashboard de Cuentas por Pagar con alertas de vencimiento y 
          link a mercancía en riesgo. (2) Tracking de SLAs por contrato con alertas preventivas. 
          (3) Calendario unificado de deadlines críticos. (4) Histórico de multas y bloqueos para análisis.`,
        beneficios: [
          'Dashboard de AP: qué vence, qué mercancía está en riesgo, prioridad de pago',
          'Alertas preventivas: X días antes de vencimiento de pago crítico',
          'Tracking de SLAs: tiempo de respuesta/resolución vs objetivo por contrato',
          'Calendario de deadlines: permisos, pagos, entregas, renovaciones',
          'Histórico de multas: monto, causa, cliente, para identificar patrones',
          'Link Pagos ↔ Importaciones: ver qué compra está bloqueada por qué factura',
          'Forecast de cash flow: ingresos esperados vs pagos comprometidos',
        ],
        timeline: 'Fase 2 de migración ERP (después de Facturación)',
        inversion: 'Incluido en proyecto NetSuite (AP enhancements + Dashboards)',
      }}
    />
  );
}



