export const facturaFields = [
  { odoo: 'name', naf: 'no_factu', description: 'Número de la factura o documento.' },
  { odoo: 'partner_id.name', naf: 'nbr_cliente', description: 'Nombre del Cliente.' },
  { odoo: 'partner_id.vat', naf: 'no_cliente', description: 'Número de Identificación Tributaria (NIT) del cliente.' },
  { odoo: 'invoice_date', naf: 'fecha', description: 'Fecha de emisión de la factura.' },
  { odoo: 'invoice_line_ids.product_id.name', naf: 'descripcion_alterna', description: 'Nombre del producto o artículo.' },
  { odoo: 'invoice_line_ids.product_id.barcode', naf: 'no_arti', description: 'Código de barras o identificador del artículo.' },
  { odoo: 'invoice_line_ids.quantity', naf: 'cantidad', description: 'Cantidad de unidades del artículo.' },
  { odoo: 'invoice_line_ids.price_unit', naf: 'precio', description: 'Precio por unidad del artículo.' },
  { odoo: 'invoice_line_ids.price_subtotal', naf: 'total_linea_siv', description: 'Monto total de la línea, sin incluir impuestos.' },
  { odoo: 'amount_tax', naf: 'impuesto', description: 'Monto total de impuestos de la factura.' },
  { odoo: 'amount_total', naf: 'total_linea_civ', description: 'Monto total de la factura, incluyendo impuestos.' },
  { odoo: 'invoice_user_id.name', naf: 'nbr_vendedor', description: 'Nombre del vendedor o comercial asignado.' },
];

export const clienteFields = [
  { odoo: 'name', naf: 'nbr_cliente', description: 'Nombre completo o razón social del cliente.' },
  { odoo: 'vat', naf: 'no_cliente', description: 'Número de Identificación Tributaria (NIT) o RUC.' },
  { odoo: 'street', naf: 'direccion', description: 'Dirección física del cliente.' },
  { odoo: 'phone', naf: 'telefono1', description: 'Número de teléfono principal.' },
  { odoo: 'email', naf: 'e_mail', description: 'Correo electrónico de contacto.' },
  { odoo: 'user_id.name', naf: 'cod_gestor', description: 'KAM o gestor de cuenta asignado.' },
];

export const productoFields = [
  { odoo: 'name', naf: 'descripcion_alterna', description: 'Nombre comercial del producto.' },
  { odoo: 'default_code', naf: 'no_arti', description: 'Código interno o SKU del producto.' },
  { odoo: 'categ_id.name', naf: 'clategoria', description: 'Categoría a la que pertenece el producto.' },
  { odoo: 'product_brand_id.name', naf: 'marca_descripcion', description: 'Marca del producto.' },
  { odoo: 'list_price', naf: 'precio', description: 'Precio de venta al público estándar.' },
  { odoo: 'standard_price', naf: 'costo_linea', description: 'Costo de adquisición del producto.' },
];
