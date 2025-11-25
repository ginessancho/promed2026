# Proceso de Orden de Compra - Descripción en Párrafos

## Descripción General del Proceso

El proceso de orden de compra en Promed involucra la coordinación de cinco roles clave: el KAM o Inside Sale, el Especialista de Producto, el Administrador de Servicio al Cliente designado, el Gerente de Ventas, y el área de Bodega. Este flujo de trabajo atraviesa múltiples sistemas incluyendo Odoo, el sistema NAF, el formulario F-007 en APEX, y el sistema WMS de bodega.

## Fase Inicial: Generación de la Oportunidad

El proceso inicia cuando el KAM o Inside Sale genera la oportunidad de venta. Una vez identificada esta oportunidad, el Especialista de Producto confecciona la propuesta correspondiente. Cuando el cliente aprueba la propuesta, el KAM procede a generar la orden de compra en el sistema.

## Registro y Verificación en Sistema NAF

Una vez generada la orden de compra por el KAM, el Administrador de Servicio al Cliente designado registra la orden de compra en el Sistema NAF. Posteriormente, el Especialista de Producto recibe la notificación del registro de la orden de compra y verifica si la mercancía se encuentra disponible en inventario. En este punto del proceso se presenta una decisión crítica: si la mercancía no está disponible, el Especialista gestiona un pre-pedido y activa el cumple flujo de pedidos para asegurar el abastecimiento.

## Completado del Formulario F-007

Cuando la mercancía está disponible, el Especialista de Producto completa el formulario F-007 en el sistema APEX. Este paso es fundamental ya que conecta la información de la orden de compra con los datos necesarios para la facturación. Simultáneamente, el Administrador de Servicio al Cliente confecciona el tiquete de la orden de compra del cliente en el sistema NAF.

## Validación de Márgenes de Ganancia

Una vez completado el tiquete en NAF, el sistema evalúa si el margen de ganancia es menor al 10%. Esta validación automática es crucial para la rentabilidad del negocio. Si el margen es menor al 10%, el sistema NAF envía un mensaje de alerta y se solicita autorización del Gerente de Ventas, quien revisa el tiquete generado. El Gerente entonces evalúa si aprueba el margen menor al 10%. Si no se aprueba, se comunica la decisión y el motivo a los involucrados, finalizando el proceso. Si se aprueba, el Gerente ingresa al Sistema NAF y aprueba el tiquete, permitiendo que el proceso continúe.

## Procesamiento y Generación de Tareas

Cuando el margen de ganancia es aceptable (mayor o igual al 10%) o ha sido aprobado excepcionalmente, el Administrador de Servicio al Cliente ingresa al Sistema NAF y coloca la opción de "aprobación". En este momento, el Sistema NAF genera automáticamente una tarea en el WMS (Warehouse Management System) de bodega.

## Fase Final: Despacho

Finalmente, el personal de Bodega realiza el proceso de selección, empaque y despacho de la mercancía al cliente, completando así el ciclo de la orden de compra.

## Puntos Críticos del Proceso

Este proceso revela varios puntos de integración críticos entre sistemas:

1. **Odoo a NAF**: La orden de compra generada inicialmente debe registrarse manualmente en NAF
2. **F-007 en APEX**: Actúa como puente de información entre la orden de compra y el sistema de facturación
3. **Validación de márgenes**: Requiere intervención manual del Gerente cuando los márgenes son bajos
4. **Integración NAF-WMS**: Es el único punto de integración automatizada en el proceso actual

La falta de integración directa entre Odoo y NAF obliga a múltiples pasos manuales de registro y verificación, lo que aumenta el tiempo de procesamiento y el riesgo de errores en la captura de datos.
