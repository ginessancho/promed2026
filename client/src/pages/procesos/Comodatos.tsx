import ProcesoTemplate from './ProcesoTemplate';

// ═══════════════════════════════════════════════════════════════════════════════
// COMODATOS + CONSIGNACIÓN - Equipos y Consumibles en Cliente
// Comodatos: equipos en préstamo con fee | Consignación: inventario pay-per-use
// ═══════════════════════════════════════════════════════════════════════════════

export default function Comodatos() {
  return (
    <ProcesoTemplate
      config={{
        id: 'comodatos-consignacion',
        title: 'Comodatos + Consignación',
        subtitle: 'Equipos y Consumibles en Cliente',
        description: `Dos modelos de negocio con el mismo problema de trazabilidad. Comodatos: equipos médicos 
          prestados a hospitales con fee mensual. Consignación: inventario de consumibles en sitio del cliente 
          que solo se factura cuando se usa. Ambos generan revenue leakage masivo cuando no hay control.`,
        backHref: '/procesos',
        backLabel: 'Procesos Críticos',
        color: 'blue',
      }}
      situacionActual={{
        descripcion: `No existe "single source of truth" ni para comodatos ni para consignación. Para comodatos: 
          lista en NAF, otra en Excel Comercial, otra en Servicio Técnico, otra en Legal — ninguna coincide. 
          Para consignación: inventario físicamente en hospitales sin registro de cuánto se usa o se pierde. 
          El cliente consume, no reporta, y PROMED nunca factura. Durante auditorías aparecen "activos fantasma" 
          y stock desaparecido sin explicación.`,
        actores: [
          { rol: 'KAM / Comercial', responsabilidad: 'Negocia comodatos y acuerdos de consignación' },
          { rol: 'Legal / Contratos', responsabilidad: 'Formaliza contratos y define términos de uso' },
          { rol: 'Administrador de Activos', responsabilidad: 'Registra salida de equipos (comodato)' },
          { rol: 'Almacén / Inventario', responsabilidad: 'Despacha consignación, registra salida' },
          { rol: 'Facturación', responsabilidad: 'Cobra fee mensual (comodato) o uso (consignación)' },
          { rol: 'Hospital / Cliente', responsabilidad: 'Reporta uso de consignación (en teoría)' },
        ],
        sistemas: ['NAF 6.0 (Activo Fijo, Inventario)', 'Odoo (órdenes)', 'Excel (múltiples)', 'Google Sheets', 'Contratos PDF'],
        volumenes: [
          { label: 'Comodatos activos', value: 'TBD' },
          { label: 'Consignaciones activas', value: 'TBD' },
          { label: 'Inconsistencias detectadas', value: '70+' },
        ],
      }}
      fricciones={[
        {
          id: 'f1',
          titulo: 'No hay single source of truth (comodatos)',
          descripcion: 'Listas en NAF, Excel de Comercial, Excel de Servicio, Excel de Legal. Ninguna coincide. Imposible saber con certeza qué equipos están dónde.',
          impacto: 'alto',
          horasSemanales: 8,
        },
        {
          id: 'f2',
          titulo: 'Revenue leakage en comodatos',
          descripcion: 'Equipos instalados y en uso por hospitales, pero el fee mensual, consumibles o uso mínimo NO se factura o se factura meses tarde.',
          impacto: 'alto',
          horasSemanales: 6,
        },
        {
          id: 'f3',
          titulo: 'Consignación sin control de uso',
          descripcion: 'Inventario físicamente en hospital. Cliente usa consumibles y nunca reporta. PROMED nunca se entera, nunca factura. Dinero perdido silenciosamente.',
          impacto: 'alto',
          horasSemanales: 5,
        },
        {
          id: 'f4',
          titulo: 'Stock "perdido" en consignación',
          descripcion: 'No hay conciliación entre lo enviado vs lo usado vs lo que queda. Inventario desaparece sin explicación. Imposible reclamar al cliente sin datos.',
          impacto: 'alto',
          horasSemanales: 4,
        },
        {
          id: 'f5',
          titulo: 'Activos fantasma en comodatos',
          descripcion: 'Dispositivos "en campo" sin ubicación clara, responsable o contrato. El registro de activos fijos ≠ realidad física en hospitales.',
          impacto: 'alto',
          horasSemanales: 4,
        },
        {
          id: 'f6',
          titulo: 'Sin triggers ni alertas',
          descripcion: 'Fechas de cierre, renovación, reposición de consignación en Excel o en la cabeza de alguien. Sin alerta automática de ningún tipo.',
          impacto: 'medio',
          horasSemanales: 3,
        },
        {
          id: 'f7',
          titulo: 'Inconsistencia indicador vs número de activo',
          descripcion: '53 facturas con indicador de comodato pero SIN número de activo. 17 facturas con activo pero SIN indicador. Auditoría imposible.',
          impacto: 'alto',
          horasSemanales: 4,
        },
      ]}
      defaultCostAssumptions={{
        horaPromedio: 22,
      }}
      propuestaMejora={{
        descripcion: `Implementar en NetSuite dos flujos paralelos pero integrados: 
          (1) Comodatos: Activo ↔ Contrato ↔ Ubicación ↔ Billing Schedule. 
          (2) Consignación: Inventario en tránsito ↔ Ubicación cliente ↔ Reportes de uso ↔ Facturación automática. 
          Alertas para vencimientos, conciliaciones pendientes, y stock sin movimiento.`,
        beneficios: [
          'Single source of truth para comodatos Y consignación',
          'Alertas automáticas de vencimiento de contrato y reposición de stock',
          'Billing automático: fee mensual (comodato) + uso reportado (consignación)',
          'Dashboard unificado: ubicación, estado, valor, próxima acción',
          'Conciliación periódica: inventario enviado vs usado vs existente',
          'Proceso de recuperación de equipos y stock al terminar contrato',
          'Integración con Servicio Técnico: historial por serial/lote',
        ],
        timeline: 'Fase 1-2 de migración ERP (junto con Facturación)',
        inversion: 'Incluido en proyecto NetSuite (Fixed Assets + Inventory + Custom Records)',
      }}
    />
  );
}
