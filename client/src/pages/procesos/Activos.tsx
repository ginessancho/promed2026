import ProcesoTemplate from './ProcesoTemplate';

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVOS FIJOS - Análisis de Proceso
// Template con datos específicos de activos fijos
// ═══════════════════════════════════════════════════════════════════════════════

export default function Activos() {
  return (
    <ProcesoTemplate
      config={{
        id: 'activos-fijos',
        title: 'Activos Fijos',
        subtitle: 'Gestión del ciclo de vida de activos',
        description: `Control completo del ciclo de vida de activos fijos: adquisición, registro, 
          depreciación, mantenimiento, transferencias entre ubicaciones y disposición final.`,
        backHref: '/procesos',
        backLabel: 'Procesos Críticos',
        color: 'emerald',
      }}
      situacionActual={{
        descripcion: `El módulo de activos fijos en NAF gestiona el registro contable y depreciación, 
          pero la información operacional (ubicación física, estado, mantenimientos) se mantiene en 
          sistemas paralelos. Esto dificulta la conciliación entre el valor en libros y la realidad física.`,
        actores: [
          { rol: 'Contabilidad', responsabilidad: 'Registra altas, bajas y depreciación mensual' },
          { rol: 'IT / Facilities', responsabilidad: 'Control físico de equipos y ubicaciones' },
          { rol: 'Compras', responsabilidad: 'Proceso de adquisición de activos nuevos' },
          { rol: 'Auditoría', responsabilidad: 'Verificación periódica de existencias' },
        ],
        sistemas: ['NAF 6.0 (Activo Fijo)', 'Excel', 'Inventario físico manual'],
        volumenes: [
          { label: 'Activos registrados', value: 'TBD' },
          { label: 'Categorías', value: 'TBD' },
          { label: 'Valor en libros', value: 'TBD' },
        ],
      }}
      fricciones={[
        {
          id: 'f1',
          titulo: 'Desconexión libro vs físico',
          descripcion: 'El valor contable no siempre coincide con la existencia física de activos. Hay equipos dados de baja que aún aparecen en libros y viceversa.',
          impacto: 'alto',
          horasSemanales: 5,
        },
        {
          id: 'f2',
          titulo: 'Proceso de depreciación manual',
          descripcion: 'La depreciación mensual requiere intervención manual y validación, con riesgo de errores en el cálculo.',
          impacto: 'medio',
          horasSemanales: 4,
        },
        {
          id: 'f3',
          titulo: 'Falta de tracking de ubicación',
          descripcion: 'No hay registro actualizado de la ubicación física de cada activo, dificultando auditorías y transferencias.',
          impacto: 'medio',
          horasSemanales: 2,
        },
        {
          id: 'f4',
          titulo: 'Proceso de baja no estandarizado',
          descripcion: 'La disposición de activos obsoletos o dañados no tiene un flujo claro, causando activos "fantasma" en el sistema.',
          impacto: 'bajo',
          horasSemanales: 1,
        },
      ]}
      defaultCostAssumptions={{
        horaPromedio: 22,
      }}
      propuestaMejora={{
        descripcion: `Migración del módulo de activos fijos a NetSuite con integración de tracking de 
          ubicación, automatización de depreciación y flujos de aprobación para altas y bajas.`,
        beneficios: [
          'Depreciación automática según políticas configuradas',
          'Tracking de ubicación física integrado',
          'Flujos de aprobación para movimientos de activos',
          'Reportes de conciliación libro vs físico',
          'Integración con comodatos y servicio técnico',
        ],
        timeline: 'Fase 2 de migración ERP',
        inversion: 'Incluido en proyecto NetSuite',
      }}
    />
  );
}

