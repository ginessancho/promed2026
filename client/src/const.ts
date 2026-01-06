export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = "Proyecto de Integracion de Facturacion en Odoo";

export const APP_LOGO = "/logo-alteridad.png";
export const PROJECT_STATUS =
  "Portafolio de iniciativas de transformación 2026";

// ═══════════════════════════════════════════════════════════════════════════════
// PRECIOS NETSUITE CONFIRMADOS
// Fuente: Janette Barria, Oracle - 30 Dic 2025
// ═══════════════════════════════════════════════════════════════════════════════
export const NETSUITE_PRICING = {
  /** Precio por usuario por año (con 65% descuento) */
  precioUsuarioAnual: 504,
  /** Precio de lista sin descuento */
  precioLista: 1440,
  /** Porcentaje de descuento otorgado */
  descuento: 0.65,
  /** Duración del contrato con precio fijo */
  contratoAnios: 3,
  /** Incremento anual estimado después del contrato */
  escalacionAnual: 0.07,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DATOS PROMED CONFIRMADOS
// Fuente: Janette Barria, Oracle - 30 Dic 2025
// ═══════════════════════════════════════════════════════════════════════════════
export const PROMED_USERS = {
  /** Total usuarios confirmados (colaboradores, practicantes, servicios profesionales) */
  total: 682,
} as const;

