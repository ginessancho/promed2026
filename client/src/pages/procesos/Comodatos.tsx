import ProcesoTemplate from './ProcesoTemplate';

// ═══════════════════════════════════════════════════════════════════════════════
// COMODATOS - Análisis de Proceso
// Template con datos específicos de comodatos
// ═══════════════════════════════════════════════════════════════════════════════

export default function Comodatos() {
  return (
    <ProcesoTemplate
      config={{
        id: 'comodatos',
        title: 'Gestión de Comodatos',
        subtitle: 'Control y trazabilidad de activos en comodato',
        description: `Los comodatos representan activos de alto valor (equipos médicos) entregados a clientes 
          bajo contrato de préstamo. La correcta trazabilidad es crítica para control de inventario, 
          auditoría y recuperación de equipos.`,
        backHref: '/procesos',
        backLabel: 'Procesos Críticos',
        color: 'blue',
      }}
      situacionActual={{
        descripcion: `Actualmente, el control de comodatos se gestiona de forma fragmentada entre NAF 
          (registro contable), Odoo (órdenes) y hojas de cálculo (seguimiento). El análisis de datos 
          reveló 70 facturas con inconsistencias: 53 con indicador de comodato pero sin número de activo, 
          y 17 con número de activo pero sin indicador marcado.`,
        actores: [
          { rol: 'KAM', responsabilidad: 'Negocia condiciones de comodato con cliente' },
          { rol: 'Administrador', responsabilidad: 'Registra salida de activo en NAF' },
          { rol: 'Servicio Técnico', responsabilidad: 'Instala y mantiene equipo en comodato' },
          { rol: 'Contabilidad', responsabilidad: 'Controla depreciación y valor en libros' },
        ],
        sistemas: ['NAF 6.0', 'Odoo', 'Excel', 'Google Sheets'],
        volumenes: [
          { label: 'Comodatos activos', value: 'TBD' },
          { label: 'Valor en activos', value: 'TBD' },
          { label: 'Inconsistencias', value: '70' },
        ],
      }}
      fricciones={[
        {
          id: 'f1',
          titulo: 'Inconsistencia indicador vs número de activo',
          descripcion: 'El 53 facturas tienen marcado el indicador de comodato pero no tienen número de activo asociado, impidiendo la trazabilidad.',
          impacto: 'alto',
          horasSemanales: 4,
        },
        {
          id: 'f2',
          titulo: 'Falta de visibilidad consolidada',
          descripcion: 'No existe un reporte único que muestre todos los activos en comodato, su ubicación, cliente y estado.',
          impacto: 'alto',
          horasSemanales: 3,
        },
        {
          id: 'f3',
          titulo: 'Proceso manual de recuperación',
          descripcion: 'Cuando un contrato termina, no hay alerta automática ni proceso estandarizado para recuperar el equipo.',
          impacto: 'medio',
          horasSemanales: 2,
        },
        {
          id: 'f4',
          titulo: 'Desconexión entre sistemas',
          descripcion: 'La información de comodatos está dispersa entre NAF (contable), Odoo (comercial) y hojas de cálculo (seguimiento).',
          impacto: 'medio',
          horasSemanales: 3,
        },
      ]}
      defaultCostAssumptions={{
        horaPromedio: 20,
      }}
      propuestaMejora={{
        descripcion: `Implementar un módulo centralizado de gestión de comodatos que integre NAF y Odoo, 
          con alertas automáticas de vencimiento de contratos y dashboard de visibilidad en tiempo real.`,
        beneficios: [
          'Trazabilidad completa de activos desde salida hasta recuperación',
          'Reducción de pérdida de equipos por falta de seguimiento',
          'Alertas automáticas de vencimiento de contratos',
          'Dashboard consolidado para auditoría y control',
          'Integración con proceso de facturación existente',
        ],
        timeline: '6-8 semanas',
        inversion: 'Por definir',
      }}
    />
  );
}

