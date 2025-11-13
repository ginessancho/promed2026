// Métricas y datos para visualizaciones

export const anomaliesData = [
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
    impact: 'Crítico',
    color: 'hsl(var(--chart-5))',
  },
  {
    name: 'Múltiples Números Físicos',
    value: 5.8,
    count: 430,
    total: 7400,
    impact: 'Medio',
    color: 'hsl(var(--chart-2))',
  },
  {
    name: 'Cálculo Ganancia Erróneo',
    value: 100,
    count: 'Todas',
    total: 'Impresas',
    impact: 'Alto',
    color: 'hsl(var(--chart-4))',
  },
];

export const projectPhases = [
  {
    phase: 'Fase 1',
    name: 'Análisis y Diseño',
    months: 'Ene-Feb 2026',
    duration: 2,
    deliverables: [
      'Análisis detallado de campos críticos',
      'Diseño de arquitectura de integración',
      'Definición de reglas de negocio',
      'Plan de migración de datos',
    ],
  },
  {
    phase: 'Fase 2',
    name: 'Desarrollo e Integración',
    months: 'Mar-May 2026',
    duration: 3,
    deliverables: [
      'Desarrollo de módulo de integración',
      'Implementación de reglas de validación',
      'Integración Odoo-NAF',
      'Pruebas unitarias y de integración',
    ],
  },
  {
    phase: 'Fase 3',
    name: 'Pruebas y Validación',
    months: 'Jun-Jul 2026',
    duration: 2,
    deliverables: [
      'Pruebas de aceptación de usuario',
      'Validación de datos migrados',
      'Ajustes y correcciones',
      'Documentación de usuario',
    ],
  },
  {
    phase: 'Fase 4',
    name: 'Despliegue y Capacitación',
    months: 'Ago-Sep 2026',
    duration: 2,
    deliverables: [
      'Migración de datos históricos',
      'Despliegue en producción',
      'Capacitación de usuarios',
      'Soporte post-implementación',
    ],
  },
  {
    phase: 'Fase 5',
    name: 'Monitoreo y Optimización',
    months: 'Oct-Dic 2026',
    duration: 3,
    deliverables: [
      'Monitoreo de KPIs',
      'Optimización de procesos',
      'Ajustes finos',
      'Documentación final',
    ],
  },
];

export const investmentBreakdown = [
  {
    category: 'Adelanto Inicial',
    amount: 5000,
    percentage: 17.2,
    description: 'Pago único al inicio del proyecto',
  },
  {
    category: 'Servicio Mensual (12 meses)',
    amount: 24000,
    percentage: 82.8,
    description: '$2,000 USD mensuales por 12 meses',
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
    campo: 'cliente_id',
    descripcion: 'Identificador del cliente',
    criticidad: 'Crítica',
    impacto: 'Análisis de ventas por cliente',
  },
  {
    campo: 'fecha_factura',
    descripcion: 'Fecha de emisión',
    criticidad: 'Crítica',
    impacto: 'Análisis temporal y cumplimiento fiscal',
  },
  {
    campo: 'no_arti',
    descripcion: 'Código del artículo/producto',
    criticidad: 'Crítica',
    impacto: 'Análisis de ventas por producto',
  },
  {
    campo: 'marca',
    descripcion: 'Marca del producto',
    criticidad: 'Crítica',
    impacto: 'Campo central del proyecto - análisis por marca',
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
    campo: 'coste',
    descripcion: 'Costo del producto',
    criticidad: 'Crítica',
    impacto: 'Cálculo de ganancia y rentabilidad',
  },
  {
    campo: 'ganancia',
    descripcion: 'Ganancia por línea',
    criticidad: 'Crítica',
    impacto: 'Análisis de rentabilidad - discrepancias actuales',
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
    activity: 'Planificación de tareas para la siguiente semana.',
  },
];

export const timelineData = [
  {
    month: 'Ene 2026',
    phase: 'Análisis',
    progress: 50,
    activities: ['Análisis de campos', 'Diseño de arquitectura'],
  },
  {
    month: 'Feb 2026',
    phase: 'Análisis',
    progress: 100,
    activities: ['Definición de reglas', 'Plan de migración'],
  },
  {
    month: 'Mar 2026',
    phase: 'Desarrollo',
    progress: 33,
    activities: ['Desarrollo módulo integración'],
  },
  {
    month: 'Abr 2026',
    phase: 'Desarrollo',
    progress: 66,
    activities: ['Implementación reglas', 'Integración Odoo-NAF'],
  },
  {
    month: 'May 2026',
    phase: 'Desarrollo',
    progress: 100,
    activities: ['Pruebas unitarias'],
  },
  {
    month: 'Jun 2026',
    phase: 'Pruebas',
    progress: 50,
    activities: ['Pruebas de aceptación'],
  },
  {
    month: 'Jul 2026',
    phase: 'Pruebas',
    progress: 100,
    activities: ['Validación de datos'],
  },
  {
    month: 'Ago 2026',
    phase: 'Despliegue',
    progress: 50,
    activities: ['Migración de datos'],
  },
  {
    month: 'Sep 2026',
    phase: 'Despliegue',
    progress: 100,
    activities: ['Capacitación'],
  },
  {
    month: 'Oct 2026',
    phase: 'Monitoreo',
    progress: 33,
    activities: ['Monitoreo KPIs'],
  },
  {
    month: 'Nov 2026',
    phase: 'Monitoreo',
    progress: 66,
    activities: ['Optimización'],
  },
  {
    month: 'Dic 2026',
    phase: 'Monitoreo',
    progress: 100,
    activities: ['Documentación final'],
  },
];
