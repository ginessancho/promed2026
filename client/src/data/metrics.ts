// Métricas y datos para visualizaciones - Actualizado para Proyecto 2026

export const anomaliesData = [
  {
    name: 'Entrada Manual Duplicada',
    value: 100,
    count: 'Todas',
    total: 'Facturas',
    impact: 'Crítico',
    color: 'hsl(var(--chart-5))',
  },
  {
    name: 'Dispersión de Marcas',
    value: 14.4,
    count: 898,
    total: 6249,
    impact: 'Alto',
    color: 'hsl(var(--chart-3))',
  },
  {
    name: 'Inconsistencias Comodatos',
    value: 0.95,
    count: 70,
    total: 7400,
    impact: 'Alto',
    color: 'hsl(var(--chart-4))',
  },
  {
    name: 'Múltiples Números Físicos',
    value: 5.8,
    count: 430,
    total: 7400,
    impact: 'Medio',
    color: 'hsl(var(--chart-2))',
  },
];

export const projectPhases = [
  {
    phase: 'Fase 1',
    name: 'Fundación y Victoria Temprana',
    months: 'Ene-Mar 2026',
    duration: 3,
    deliverables: [
      'Auditoría y mapeo de datos detallado (Odoo ↔ NAF)',
      'Conector directo v1.0 (Python en Odoo)',
      'Piloto de integración para casos simples (~20% volumen)',
      'Dashboard de seguimiento en promed.alteridad.org',
    ],
  },
  {
    phase: 'Fase 2',
    name: 'Expansión y Eliminación de F-007',
    months: 'Abr-Jul 2026',
    duration: 4,
    deliverables: [
      'Conector directo v2.0 con lógica de negocio avanzada',
      'Integración de comodatos y alquileres',
      'Depuración y gestión de catálogo de servicios en Odoo',
      'Retiro oficial del formulario F-007',
    ],
  },
  {
    phase: 'Fase 3',
    name: 'Sincronización Bidireccional',
    months: 'Ago-Oct 2026',
    duration: 3,
    deliverables: [
      'Mecanismo de webhooks o polling (NAF → Odoo)',
      'Panel de control de integración en Odoo',
      'Optimización del rendimiento del conector',
      'Visibilidad en tiempo real del estado de facturación',
    ],
  },
  {
    phase: 'Fase 4',
    name: 'Capacitación y Transferencia',
    months: 'Nov-Dic 2026',
    duration: 2,
    deliverables: [
      'Manuales de usuario y técnicos completos',
      'Sesiones de capacitación con equipos clave',
      'Plan de soporte y mantenimiento a largo plazo',
      'Transferencia de conocimiento al equipo de TI',
    ],
  },
];

export const investmentBreakdown = [
  {
    category: 'Adelanto Inicial',
    amount: 5000,
    percentage: 12.2,
    description: 'Pago único al inicio del proyecto para validación y viabilidad',
  },
  {
    category: 'Servicio Mensual (12 meses)',
    amount: 36000,
    percentage: 87.8,
    description: '$3,000 USD mensuales por 12 meses',
  },
];

export const criticalFields = [
  {
    campo: 'no_factu',
    descripcion: 'Número de factura lógica',
    criticidad: 'Crítica',
    impacto: 'Identificador único de la transacción',
  },
  {
    campo: 'no_fisico',
    descripcion: 'Número de factura física',
    criticidad: 'Crítica',
    impacto: 'Trazabilidad legal y auditoría',
  },
  {
    campo: 'no_cliente',
    descripcion: 'Identificador del cliente',
    criticidad: 'Crítica',
    impacto: 'Relación con maestro de clientes',
  },
  {
    campo: 'fecha',
    descripcion: 'Fecha de emisión de la factura',
    criticidad: 'Crítica',
    impacto: 'Análisis temporal y cumplimiento fiscal',
  },
  {
    campo: 'no_arti',
    descripcion: 'Código del artículo/producto',
    criticidad: 'Crítica',
    impacto: 'Relación con maestro de productos',
  },
  {
    campo: 'marca',
    descripcion: 'Código de marca del producto',
    criticidad: 'Crítica',
    impacto: 'Campo central del proyecto - análisis por marca',
  },
  {
    campo: 'marca_descripcion',
    descripcion: 'Nombre de la marca',
    criticidad: 'Crítica',
    impacto: 'Legibilidad en reportes y análisis',
  },
  {
    campo: 'cantidad',
    descripcion: 'Cantidad vendida',
    criticidad: 'Crítica',
    impacto: 'Cálculo de ingresos y análisis de volumen',
  },
  {
    campo: 'precio',
    descripcion: 'Precio unitario',
    criticidad: 'Crítica',
    impacto: 'Base del cálculo de ingresos',
  },
  {
    campo: 'costo_linea',
    descripcion: 'Costo unitario del producto',
    criticidad: 'Crítica',
    impacto: 'Cálculo de ganancia y rentabilidad',
  },
  {
    campo: 'ind_comodato',
    descripcion: 'Indicador de comodato',
    criticidad: 'Crítica',
    impacto: 'Gestión de activos - inconsistencias detectadas',
  },
  {
    campo: 'no_comodato',
    descripcion: 'Número del activo en comodato',
    criticidad: 'Crítica',
    impacto: 'Trazabilidad de activos físicos',
  },
  {
    campo: 'marca_serv',
    descripcion: 'Marca del servicio',
    criticidad: 'Alta',
    impacto: 'Análisis de servicios por marca',
  },
  {
    campo: 'descrip_serv',
    descripcion: 'Descripción del servicio',
    criticidad: 'Alta',
    impacto: 'Claridad en la naturaleza del servicio',
  },
  {
    campo: 'centro_costo',
    descripcion: 'Centro de costo',
    criticidad: 'Alta',
    impacto: 'Análisis de rentabilidad por área',
  },
];

export const weeklyRoutine = [
  {
    day: 'Lunes',
    activity: 'Revisión de tareas de la semana y sincronización con el equipo técnico.',
  },
  {
    day: 'Martes',
    activity: 'Trabajo en entregables y seguimiento de riesgos.',
  },
  {
    day: 'Miércoles',
    activity: 'Reunión de seguimiento semanal (45 min) con todo el equipo técnico.',
  },
  {
    day: 'Jueves',
    activity: 'Actualización del plan de transición y reporte de estado.',
  },
  {
    day: 'Viernes',
    activity: 'Planificación de tareas para la siguiente semana y actualización de promed.alteridad.org.',
  },
];

export const timelineData = [
  {
    month: 'Ene 2026',
    phase: 'Fundación',
    progress: 33,
    activities: ['Auditoría de datos', 'Mapeo Odoo-NAF'],
  },
  {
    month: 'Feb 2026',
    phase: 'Fundación',
    progress: 66,
    activities: ['Desarrollo conector v1.0'],
  },
  {
    month: 'Mar 2026',
    phase: 'Fundación',
    progress: 100,
    activities: ['Piloto casos simples', 'Dashboard seguimiento'],
  },
  {
    month: 'Abr 2026',
    phase: 'Expansión',
    progress: 25,
    activities: ['Conector v2.0 - Comodatos'],
  },
  {
    month: 'May 2026',
    phase: 'Expansión',
    progress: 50,
    activities: ['Depuración servicios'],
  },
  {
    month: 'Jun 2026',
    phase: 'Expansión',
    progress: 75,
    activities: ['Pruebas expansión'],
  },
  {
    month: 'Jul 2026',
    phase: 'Expansión',
    progress: 100,
    activities: ['Retiro F-007'],
  },
  {
    month: 'Ago 2026',
    phase: 'Sincronización',
    progress: 33,
    activities: ['Webhooks NAF→Odoo'],
  },
  {
    month: 'Sep 2026',
    phase: 'Sincronización',
    progress: 66,
    activities: ['Panel de control'],
  },
  {
    month: 'Oct 2026',
    phase: 'Sincronización',
    progress: 100,
    activities: ['Optimización rendimiento'],
  },
  {
    month: 'Nov 2026',
    phase: 'Capacitación',
    progress: 50,
    activities: ['Documentación', 'Talleres'],
  },
  {
    month: 'Dic 2026',
    phase: 'Capacitación',
    progress: 100,
    activities: ['Transferencia conocimiento'],
  },
];
