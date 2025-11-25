# Análisis de Propuesta de Integración CRM y ERP (Odoo-NAF)

## Información Clave del Documento

### Objetivos Competitivos

1. **Mejorar la Eficiencia**
   - Automatizar tareas que optimicen la productividad

2. **Confianza en Datos**
   - Lograr exactitud, data actualizada en tiempo real
   - Garantizar un solo registro en ambas plataformas (CRM y ERP)

3. **Mejora de la Productividad**
   - Facilitar el acceso a la información
   - Toma de decisiones basadas en datos actualizados y consistentes

4. **Unificación de Registro**
   - Garantizar que cada entidad (cliente, producto, pedido, etc.) tenga un solo registro maestro compartido entre CRM y ERP

---

## Procesos Identificados

### 1. Registro de Orden de Compra (OC)

**Situación Actual:**
- Los datos de una OC se captan en NAF de manera manual, campo por campo
- Riesgo de error al momento de transcribir de PDF a campos NAF
- Riesgo de no registro o registro tardío de una orden de compra

**Propuesta:**
- Sistematizar todos los datos de una OC desde la pantalla de Odoo
- Crear una interfaz (Envoy) que envíe datos desde pantalla Odoo a NAF y respuesta de registro a Odoo
- Aumentar la confianza en el registro correcto y oportuno
- Actualizar automáticamente etapas de la oportunidad optimizando así el pipeline del CRM

**Responsables:** OVNI, Sale Operation Squad
**Involucrados:** Grupo comercial, Tecnología, CX, Proveedor Odoo
**Prioridad:** 1

---

### 2. Creación de Cliente

**Situación Actual:**
- Deben llenar formulario en Apex (16 campos obligatorios)
- Esperar filtro y aprobación de Prosp ace (mesa de ayuda)
- Esperar filtro y aprobación de Cobros, para asignar nuevo código NAF
- Se generan cuellos de botella de tiempos mínimos de 35 min y máximos de 2 días, para la asignación de un nuevo código

**Propuesta:**
- Canalizar el llenado de información del nuevo cliente desde una sola pantalla (Odoo) con validaciones comerciales, contables y fiscales
- Automatizar la asignación del código NAF cumpliendo con los requisitos, contables y fiscales
- Mejorar el tiempo de la operación de facturación dentro del proceso de ventas

**Responsables:** Finanzas / Cobros de todas las sedes de Promed
**Involucrados:** Grupo comercial, Tecnología, CX, Proveedor Odoo
**Prioridad:** 2

---

### 3. Creación de Productos

**Situación Actual:**
- Depende de la acción de Prosp ace (mesa de ayuda) para poder crear un producto en CRM y cotizar al cliente
- Luego deben crear el producto en NAF para pedir al proveedor y facturar
- Pueden cotizar al cliente y pedir a proveedores productos con estatus regulatorio vencido o inexistente
- El grupo de asuntos regulatorios desconoce de un producto nuevo que necesite gestión regulatoria hasta una etapa tardía del proceso

**Propuesta:**
- Permitir que el usuario cree nuevos productos, controlado por Prosp ace (mesa de ayuda)
- Crear un proceso colaborativo, que permita la creación ordenada de nuevos productos a los que sea necesario gestionar estatus regulatorio
- Controlar la cotización de productos con estatus regulatorio vencido

**Responsables:** Grupo comercial, Inventario, Asuntos regulatorios
**Involucrados:** Tecnología, CX, Proveedor Odoo
**Prioridad:** 3

---

### 4. Pedidos

**Situación Actual:**
- Debe buscar información del estatus de un pedido en las pantallas Apex (NAF) para mantener un pipeline actualizado
- El grupo de multas o Servicio al cliente ovni debe identificar de manera oportuna si se debe o no generar solicitud de prórroga

**Propuesta:**
- Publicar en las pantallas de Odoo, el estatus del pedido relacionado a OC
- Mantener un pronóstico de facturación más real
- Ampliar la trazabilidad de una licitación pública post orden de compra

**Responsables:** Sale Operation Squad
**Involucrados:** Grupo comercial, Tecnología, CX, Proveedor Odoo
**Prioridad:** 4

---

## Siguientes Pasos (Timeline)

| Proceso | Tiempo | Responsables | Involucrados |
|---------|--------|--------------|--------------|
| **Aprobación de prioridades/entregables** | de Junio | Gerencia | CX |
| **Escogencia nuevo proveedor** | Dependencia de evaluación de IT/se proporcionaron opciones de proveedores | Tecnología y CX | Marketing corporativo |
| **Levantamiento de Requerimiento** | 3 semanas por requerimiento | Analista de CRM y grupos responsables por cada procedimiento | Grupos responsables, Grupo comerciales |
| **Desarrollo** | (**) | Proveedor y Tecnología | CX, Marketing corporativo |
| **Pruebas técnicas** | 2 semanas por requerimiento | Grupos operativos y comercial | Analista de CRM, CX, Tecnología, Proveedor |
| **Puesta en marcha** | Publicaciones por fase y por prioridad | Analista de CRM, Proveedor y Tecnología | CX, Marketing Corporativo |

(**) Dependiente del proveedor escogido

---

## ¿Qué necesitamos?

1. **Persona responsable asignada por grupo y por proceso** para el levantamiento de requerimientos y pruebas

2. **Nuevo proveedor de soporte Odoo**
   - El proveedor actual Grupo OLA, ha experimentado muchos retrasos, falta de experiencia y desconfiguraciones de desarrollos antes implementados al momento de implementar adecuaciones a la medida para Promed

---

## Proceso de Creación de Cliente Actual (Diagrama)

**Escenario actual:**
1. Cliente desea realizar compra en Promed
2. Quien recibe la solicitud, crea solicitud de creación de cliente
3. Especialista de Producto, Sales Support, Inside Sales y Recepción, pueden crear solicitudes de creación de clientes
4. Mesa de Ayuda revisa solicitud, crea cliente en Odoo y notifica a Cobros
5. Cobros hace sus validaciones, crea cliente en NAF y comparte su código
6. SOS utiliza el código para generar tiquete y notifica a Bodega
7. Bodega atiende solicitud, factura y entrega en recepción
8. Recepcionista realiza cobro si el cliente no ha pagado y entrega

**Tiempo promedio de atención:** 1 hora desde que llega el cliente hasta que se entrega la mercancía

---

## Dónde Integrar Esta Información en el Sitio Web

### 1. **Página "Proceso Actual"**
- Añadir el diagrama de "Proceso de Creación de Cliente Actual"
- Complementar con los otros 3 procesos identificados (OC, Productos, Pedidos)
- Destacar los cuellos de botella y tiempos de espera

### 2. **Página "Propuesta 2026"**
- Integrar los **Objetivos Competitivos** como beneficios adicionales
- Añadir sección de "Procesos Priorizados" con las 4 prioridades
- Incluir la necesidad de nuevo proveedor Odoo (contexto importante)

### 3. **Página "Detalles Técnicos"**
- Detallar las integraciones específicas por proceso
- Explicar el concepto de "Envoy" (interfaz Odoo-NAF)
- Arquitectura de unificación de registros maestros

### 4. **Página "Plan de Trabajo 2026"**
- Integrar el timeline de "Siguientes Pasos"
- Añadir fases de levantamiento de requerimientos (3 semanas por proceso)
- Incluir fases de pruebas técnicas (2 semanas por proceso)

### 5. **Nueva Sección Potencial: "Hallazgos 2025"**
- Documentar el contexto del proveedor actual (Grupo OLA)
- Justificar la necesidad de cambio de proveedor
- Vincular con la propuesta de Alteridad como solución
