# Estructura de Navegación por Pilares - Proyecto: Integración de Facturación en Odoo

## 🎯 Concepto Visual

```
┌─────────────────────────────────────────────────────────────────┐
│        PROYECTO INTEGRACIÓN DE FACTURACIÓN EN ODOO - PROMED      │
│              [Logo Alteridad]    [Logo Promed]                   │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                    DIAGNÓSTICO (Pasado y Presente)                 │
├─────────────────┬─────────────────┬───────────────────────────────┤
│                 │                 │                               │
│  HALLAZGOS      │  VOLUMEN DEL    │     PROCESO                   │
│     2025        │   PROBLEMA      │     ACTUAL                    │
│                 │                 │                               │
│  📋 Análisis    │  📊 14.4%       │  ⚙️ Flujo Actual             │
│  Preliminar     │  Dispersión     │  Roles y                      │
│                 │  de Marcas      │  Responsables                 │
│  [Ver Detalles] │ [Ver Análisis]  │ [Ver Proceso]                 │
│                 │                 │                               │
└─────────────────┴─────────────────┴───────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                        SOLUCIÓN (Futuro)                           │
├─────────────────┬─────────────────┬───────────────────────────────┤
│                 │                 │                               │
│  PROPUESTA      │   DETALLES      │  MANTENIMIENTO                │
│     2026        │   TÉCNICOS      │      DMS                      │
│                 │                 │                               │
│  💼 Inversión   │  🔧 Integración │  🖥️ dms.alteridad.org        │
│  $29K / 12m     │  Odoo-NAF       │  Business Rules               │
│                 │                 │                               │
│  [Ver Propuesta]│ [Ver Detalles]  │ [Ver Plataforma]              │
│                 │                 │                               │
└─────────────────┴─────────────────┴───────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                    EJECUCIÓN (Plan de Trabajo)                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  📅 PLAN DE TRABAJO 2026                                          │
│  Gantt • Calendario • Reuniones • Riesgos • RACI                  │
│                                                                    │
│                    [Ver Plan Completo]                             │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

---

## 📐 Estructura de Rutas

```
/                           → Homepage (panel de 6 + barra)
/hallazgos-2025            → Página completa con análisis preliminar
/volumen-problema          → Página con gráficos y análisis de datos
/proceso-actual            → Página con flujo actual detallado
/propuesta-2026            → Página con propuesta de inversión
/detalles-tecnicos         → Página con arquitectura e integración
/mantenimiento-dms         → Página con screenshots y capacidades DMS
/plan-trabajo-2026         → Página con Gantt, calendario, RACI, riesgos
```

---

## 🎨 Diseño de Cada Panel (Homepage)

### Panel Card Design

```css
- Tamaño: ~300-400px ancho × 350px alto
- Hover: Elevación sutil + borde de color
- Click: Navegación a página completa
- Contenido:
  * Icono grande (emoji o SVG)
  * Título del pilar
  * Descripción corta (2-3 líneas)
  * Métrica clave o highlight
  * Botón "Ver Detalles"
```

### Colores por Pilar

- **Hallazgos 2025**: Azul Alteridad (primario)
- **Volumen del Problema**: Rojo Alteridad (accent)
- **Proceso Actual**: Gris oscuro (muted)
- **Propuesta 2026**: Verde (success)
- **Detalles Técnicos**: Azul oscuro (chart-4)
- **Mantenimiento DMS**: Púrpura (chart-5)
- **Plan de Trabajo**: Naranja (warning)

---

## 📄 Contenido Detallado por Página

### 1. HALLAZGOS 2025

**Objetivo**: Contar la historia del trabajo preliminar y cómo llegamos a la conclusión de automatizar.

**Estructura**:
1. **Introducción** (1-2 párrafos)
   - Contexto: Promed en espera de migración a Odoo reciente
   - Decisión de hacer análisis preliminar
   
2. **Metodología de Análisis**
   - Entrevistas con colaboradores (roles específicos)
   - Entrevistas con ejecutivos
   - Expansión del equipo Alteridad
   - Consulta con expertos externos
   
3. **Hallazgos Clave**
   - Análisis de pantallas actuales (F-007, Odoo)
   - Análisis de procesos manuales
   - Identificación de campos críticos
   - Validación de sospechas iniciales
   
4. **Conclusión**
   - Necesidad urgente de automatización
   - No esperar a migración de Odoo
   - Oportunidad de crear base sólida
   
5. **Timeline Retrospectiva**
   - Línea de tiempo del trabajo 2025
   - Hitos alcanzados
   - Decisiones tomadas

**Componentes**:
- Timeline retrospectiva
- Cards de hallazgos
- Quotes de entrevistas (anonimizadas)
- Diagrama de metodología

---

### 2. VOLUMEN DEL PROBLEMA

**Objetivo**: Cuantificar el problema con datos reales y visualizaciones impactantes.

**Estructura**:
1. **Introducción al Análisis de Datos**
   - Dataset: 739,251 registros de facturación
   - Período analizado
   - Herramientas utilizadas (DMS)
   
2. **Screenshot del DMS**
   - Captura de pantalla del análisis en dms.alteridad.org
   - Anotaciones explicativas
   
3. **Anomalías Detectadas** (con gráficos)
   - **Dispersión de Marcas**: 14.4% (898 de 6,249 artículos)
     * Caso extremo: "VENTAS-I" con 79 marcas
     * Impacto: Análisis por marca no fiable
   
   - **Inconsistencias de Comodatos**: 70 facturas
     * 53 con indicador pero sin número de activo
     * 17 con número de activo pero sin indicador
     * Impacto: Pérdida de trazabilidad de activos
   
   - **Múltiples Números Físicos**: 430 facturas lógicas
     * Impacto: Confusión en auditoría
   
   - **Errores de Ganancia**: 100% líneas impresas
     * Impacto: Reportes financieros imprecisos
   
4. **Impacto Cuantificado**
   - Horas perdidas por mes en reprocesos
   - Costo estimado de errores
   - Riesgo de auditoría
   
5. **Tabla Resumen**
   - Todas las anomalías en formato tabla
   - Prioridad por impacto

**Componentes**:
- Screenshot grande del DMS con zoom
- Gráficos interactivos (ya existentes)
- Tabla de anomalías
- Cards de impacto

---

### 3. PROCESO ACTUAL (Estado actual)

**Objetivo**: Documentar a detalle el proceso actual, identificando fricciones y blockers.

**Estructura**:
1. **Flujo de Proceso Actual**
   - Diagrama de flujo detallado
   - Paso a paso con tiempos estimados
   
2. **Roles y Responsables**
   - **KAM (Key Account Manager)**
     * Responsabilidades
     * Interacción con Odoo
   
   - **Especialista de Producto**
     * Responsabilidades
     * Entrada de datos en F-007
   
   - **Equipo de Facturación**
     * Responsabilidades
     * Validación y envío a NAF
   
   - **Equipo de Marketing/Comercial**
     * Análisis en KBOX
     * Toma de decisiones
   
3. **Pantallas Actuales**
   - **Screenshot: Formulario F-007**
     * Campos principales
     * Proceso de llenado manual
   
   - **Screenshot: Odoo - Factura**
     * Campos capturados
     * Punto de corte (donde termina Odoo)
   
   - **Screenshot: NAF - Registro de Factura**
     * Campos en NAF
     * Proceso de sincronización manual
   
4. **Fricciones Identificadas**
   - **Fricción 1**: Entrada manual duplicada
     * Descripción
     * Ejemplo real
     * Tiempo consumido
   
   - **Fricción 2**: Falta de validación en origen
     * Descripción
     * Ejemplo de error
     * Impacto
   
   - **Fricción 3**: Dependencia de conocimiento tácito
     * Descripción
     * Riesgo de rotación de personal
   
5. **Blockers Críticos**
   - **Blocker 1**: No hay integración Odoo-NAF
     * Impacto: Proceso manual completo
   
   - **Blocker 2**: Reglas de negocio no centralizadas
     * Impacto: Inconsistencias
   
   - **Blocker 3**: Sin validación automática
     * Impacto: Errores descubiertos tarde

**Componentes**:
- Diagrama de flujo actual (Mermaid)
- Cards de roles con fotos/iconos
- Galería de screenshots con anotaciones
- Cards de fricciones (con iconos de alerta)
- Cards de blockers (con iconos de stop)

---

### 4. PROPUESTA 2026

**Objetivo**: Presentar la solución, inversión y modelo de servicio.

**Estructura**:
1. **Resumen Ejecutivo**
   - Solución en 3 puntos clave
   - Beneficios principales
   - Inversión total
   
2. **Solución Propuesta (Propuesto)**
   - Diagrama de flujo propuesto
   - Comparación Actual vs Propuesto
   - Mejoras clave
   
3. **Inversión y Estructura de Pago**
   - Adelanto: $5,000 USD
   - Mensualidad: $2,000 USD × 12 meses
   - Total: $29,000 USD
   - Desglose visual
   
4. **Modelo de Servicio Mensual**
   - Reuniones semanales (45 min)
   - Reuniones mensuales ejecutivas (1 hora)
   - Disponibilidad continua
   
5. **Roles y Responsabilidades**
   - Alteridad (Gestor de Transición)
   - Gateway Resources (Partner Técnico)
   - Promed (Sponsor y Usuarios)
   - IT Promed (Soporte Técnico)
   
6. **Beneficios Esperados**
   - Eliminación de reprocesos manuales
   - Reducción de errores en X%
   - Ahorro de Y horas/mes
   - ROI estimado
   
7. **Próximos Pasos**
   - Aprobación de propuesta
   - Firma de contrato
   - Kick-off en diciembre 2025
   - Inicio en enero 2026

**Componentes**:
- Diagrama propuesto (Mermaid)
- Gráfico de inversión (ya existe)
- Cards de roles
- Timeline de próximos pasos
- Calculadora de ROI (opcional)

---

### 5. DETALLES TÉCNICOS

**Objetivo**: Proporcionar información técnica detallada para equipos de IT y Gateway.

**Estructura**:
1. **Arquitectura de Integración**
   - Diagrama de arquitectura técnica (ya existe)
   - Capas de la solución
   - Tecnologías utilizadas
   
2. **Coordinación entre Equipos**
   - **IT Promed**
     * Acceso a sistemas
     * Documentación requerida
     * Puntos de contacto
   
   - **Gateway Resources**
     * Desarrollo de módulo de integración
     * Implementación de reglas
     * Testing
   
   - **Alteridad**
     * Coordinación general
     * Gestión de reglas de negocio
     * Validación
   
3. **Campos Críticos - Tabla Completa**
   - Tabla detallada (ya existe)
   - Reglas de validación por campo
   - Mapeo Odoo ↔ NAF
   
4. **Documentación de Sistemas**
   - **Odoo**
     * Versión actual
     * APIs disponibles
     * Módulos relevantes (Accounting, Sales)
     * Enlaces a documentación oficial
   
   - **NAF/Oracle**
     * Versión
     * Tablas relevantes
     * APIs o interfaces disponibles
     * Documentación de integración
   
5. **Opciones de Integración**
   - **Opción 1: Webhooks**
     * Descripción
     * Pros y contras
     * Viabilidad
   
   - **Opción 2: APIs REST**
     * Descripción
     * Pros y contras
     * Viabilidad
   
   - **Opción 3: Batch Processing**
     * Descripción
     * Pros y contras
     * Viabilidad
   
   - **Recomendación**: (A definir con equipos técnicos)
   
6. **Reuniones de Alineación Técnica**
   - Kick-off técnico
   - Revisión de arquitectura
   - Validación de APIs
   - Testing conjunto
   
7. **Entregables Técnicos por Fase**
   - Fase 1: Documentación de diseño
   - Fase 2: Módulo de integración
   - Fase 3: Reglas de validación
   - Fase 4: Documentación técnica final
   
8. **Stack Tecnológico**
   - Backend: Python/Node.js (a definir)
   - Base de datos: PostgreSQL
   - APIs: REST/GraphQL
   - Middleware: DMS Alteridad
   - Monitoreo: (a definir)

**Componentes**:
- Diagrama de arquitectura (ya existe)
- Tabla de campos críticos (ya existe)
- Cards de opciones de integración
- Timeline de reuniones técnicas
- Tabla de entregables

---

### 6. MANTENIMIENTO DMS

**Objetivo**: Mostrar la plataforma DMS de Alteridad como parte del value proposition.

**Estructura**:
1. **Introducción a dms.alteridad.org**
   - Qué es el DMS
   - Por qué es parte de la solución
   - Beneficios para Promed
   
2. **Capacidades Clave con Screenshots**
   
   **A. Business Rules Engine**
   - Screenshot del editor de reglas
   - Descripción:
     * Centralización de reglas de negocio
     * Versionamiento de reglas
     * Testing de reglas
   - Ejemplo: Regla de marca única por artículo
   - Beneficio: Cambios sin código, auditoría completa
   
   **B. Sistema de Alertas**
   - Screenshot del dashboard de alertas
   - Descripción:
     * Detección proactiva de anomalías
     * Notificaciones en tiempo real
     * Configuración flexible
   - Ejemplo: Alerta de comodato sin número de activo
   - Beneficio: Prevención de errores antes de NAF
   
   **C. Process Mining**
   - Screenshot de análisis de proceso
   - Descripción:
     * Visualización de flujos reales
     * Identificación de cuellos de botella
      * Comparación Actual vs Propuesto
   - Ejemplo: Análisis del flujo de facturación
   - Beneficio: Mejora continua basada en datos
   
   **D. Tarjetas de Análisis Conectados**
   - Screenshot de dashboard con tarjetas
   - Descripción:
     * KPIs en tiempo real
     * Conexión con múltiples fuentes
     * Visualizaciones interactivas
   - Ejemplo: Dashboard de calidad de datos
   - Beneficio: Visibilidad continua del estado
   
   **E. Dashboard de Calidad de Datos**
   - Screenshot del dashboard principal
   - Descripción:
     * Monitoreo de anomalías
     * Tendencias de calidad
     * Alertas configurables
   - Ejemplo: Evolución de la dispersión de marcas
   - Beneficio: Seguimiento del progreso
   
3. **Arquitectura Técnica del DMS**
   - **Frontend**: Next.js 14 + React 19
   - **Backend**: Next.js Server Components
   - **Base de Datos**: PostgreSQL (Supabase)
   - **Storage**: Amazon S3 (vía Supabase)
   - **Hosting**: Vercel Edge Network
   - **CDN**: Cloudflare
   - **AI**: OpenAI + pgvector
   - **Seguridad**: Row-Level Security (RLS)
   
4. **Integración DMS con Odoo y NAF**
   - APIs del DMS
   - Webhooks para eventos
   - Sincronización de datos
   - Flujo de validación
   
5. **Monitoreo Continuo**
   - Reglas de negocio activas
   - Alertas configuradas
   - Reportes automáticos
   - Dashboards personalizados
   
6. **Evolución del Proceso Ideal**
   - Ajuste de reglas según aprendizaje
   - Nuevas validaciones
   - Optimización continua
   
7. **Seguimiento del Volumen del Problema**
   - Métricas de mejora
   - Antes vs Después
   - Tendencias de calidad
   - Impacto medido
   
8. **Acceso y Permisos**
   - Equipo Promed tendrá acceso
   - Roles y permisos configurables
   - Training incluido
   - Soporte continuo

**Componentes**:
- Galería de screenshots (5-6 imágenes)
- Cards de capacidades
- Diagrama de arquitectura DMS
- Diagrama de integración DMS-Odoo-NAF
- Timeline de evolución

---

### 7. PLAN DE TRABAJO 2026

**Objetivo**: Proporcionar el plan ejecutable del proyecto con Gantt, calendario, RACI y riesgos.

**Estructura**:
1. **Gantt Interactivo de 12 Meses**
   - Visualización de todas las tareas
   - Dependencias marcadas
   - Hitos destacados
   - Filtros por fase/equipo/responsable
   - Progreso estimado
   
2. **Tareas Detalladas por Fase**
   
   **Fase 1: Análisis y Diseño (Ene-Feb)**
   - Semana 1-2: Kick-off y Alineación
   - Semana 3-4: Análisis de Campos Críticos
   - Semana 5-6: Diseño de Arquitectura
   - Semana 7-8: Definición de Reglas de Negocio
   
   **Fase 2: Desarrollo e Integración (Mar-May)**
   - Semana 9-12: Desarrollo de Módulo de Integración
   - Semana 13-16: Implementación de Reglas
   - Semana 17-20: Integración Odoo-NAF
   
   **Fase 3: Pruebas y Validación (Jun-Jul)**
   - Semana 21-24: Pruebas Unitarias
   - Semana 25-28: Pruebas de Integración
   - Semana 29-32: Pruebas de Aceptación
   
   **Fase 4: Despliegue y Capacitación (Ago-Sep)**
   - Semana 33-36: Migración de Datos
   - Semana 37-40: Despliegue en Producción
   - Semana 41-44: Capacitación
   
   **Fase 5: Monitoreo y Optimización (Oct-Dic)**
   - Semana 45-48: Monitoreo Intensivo
   - Semana 49-52: Optimización y Ajustes
   
3. **Calendario de Reuniones 2026**
   - Vista de calendario mensual
   - Código de colores por tipo de reunión
   
   **Reuniones Ad-hoc**
   - Frecuencia: Bajo demanda
   - Duración: 30-45 min
   - Participantes: Equipo técnico específico
   - Objetivo: Resolver bloqueos urgentes
   - Ejemplos de triggers
   
   **Reuniones de Progress (Semanales)**
   - Día: Miércoles 10:00 AM
   - Duración: 45 min
   - Participantes: Alteridad, Gateway, IT Promed
   - Agenda tipo:
     1. Tareas completadas (10 min)
     2. Bloqueos y riesgos (15 min)
     3. Plan siguiente semana (15 min)
     4. Q&A (5 min)
   - Entregable: Acta + actualización Gantt
   
   **Reuniones de Steering (Mensuales)**
   - Día: Primera semana del mes
   - Duración: 1 hora
   - Participantes: Alteridad, Promed Ejecutivo, Gateway Director, IT Director
   - Agenda tipo:
     1. Resumen ejecutivo (10 min)
     2. KPIs y métricas (15 min)
     3. Riesgos y mitigaciones (15 min)
     4. Decisiones estratégicas (15 min)
     5. Plan siguiente mes (5 min)
   - Entregable: Reporte ejecutivo mensual
   
4. **Matriz RACI**
   - Tabla interactiva
   - Filas: Tareas/Entregables (~20-30)
   - Columnas: Roles (Alteridad, Promed, Gateway, IT Promed)
   - Valores: R, A, C, I
   - Filtros por rol
   - Búsqueda de tareas
   
5. **Riesgos Identificados**
   
   **Riesgo 1: Retrasos en acceso a sistemas**
   - Probabilidad: Media
   - Impacto: Alto
   - Mitigación: Solicitar accesos en kick-off
   - Contingencia: Trabajar con ambientes de prueba
   
   **Riesgo 2: Cambios en alcance**
   - Probabilidad: Media
   - Impacto: Medio
   - Mitigación: Control de cambios formal
   - Contingencia: Ajuste de timeline
   
   **Riesgo 3: Disponibilidad de recursos clave**
   - Probabilidad: Baja
   - Impacto: Alto
   - Mitigación: Identificar backups
   - Contingencia: Ajuste de plan
   
   **Riesgo 4: Complejidad técnica subestimada**
   - Probabilidad: Media
   - Impacto: Alto
   - Mitigación: POCs tempranos
   - Contingencia: Escalamiento de recursos
   
   **Riesgo 5: Resistencia al cambio**
   - Probabilidad: Media
   - Impacto: Medio
   - Mitigación: Capacitación temprana
   - Contingencia: Change management
   
6. **Estrategias de Mitigación**
   - Comunicación proactiva
   - Reuniones regulares
   - Documentación exhaustiva
   - Testing continuo
   - Capacitación incremental
   
7. **Plan de Contingencia**
   - Escenarios de riesgo alto
   - Acciones predefinidas
   - Responsables de activación
   
8. **KPIs de Seguimiento**
   - Progreso general (%)
   - Tareas completadas vs planificadas
   - Riesgos activos
   - Calidad de entregables
   - Satisfacción del cliente
   
9. **Criterios de Éxito por Fase**
   - Fase 1: Diseño aprobado
   - Fase 2: Integración funcional
   - Fase 3: Pruebas pasadas
   - Fase 4: Go-live exitoso
   - Fase 5: Métricas de mejora alcanzadas

**Componentes**:
- Gantt interactivo (librería react-gantt-chart)
- Calendario de reuniones (react-big-calendar)
- Matriz RACI (tabla interactiva)
- Cards de riesgos
- Dashboard de KPIs
- Timeline de criterios de éxito

---

## 🎨 Paleta de Colores por Pilar

```css
/* Hallazgos 2025 */
--pilar-hallazgos: oklch(0.54 0.18 230); /* Azul Alteridad */

/* Volumen del Problema */
--pilar-volumen: oklch(0.60 0.22 25); /* Rojo Alteridad */

/* Proceso Actual */
--pilar-proceso: oklch(0.45 0.01 286); /* Gris oscuro */

/* Propuesta 2026 */
--pilar-propuesta: oklch(0.65 0.18 145); /* Verde */

/* Detalles Técnicos */
--pilar-detalles: oklch(0.45 0.15 230); /* Azul oscuro */

/* Mantenimiento DMS */
--pilar-dms: oklch(0.55 0.20 290); /* Púrpura */

/* Plan de Trabajo */
--pilar-plan: oklch(0.65 0.18 50); /* Naranja */
```

---

## 📦 Assets Necesarios

### Screenshots a Obtener

1. **dms.alteridad.org**
   - [ ] Business Rules Engine (editor de reglas)
   - [ ] Dashboard de alertas
   - [ ] Process Mining (análisis de flujo)
   - [ ] Tarjetas de análisis
   - [ ] Dashboard de calidad de datos

2. **Proceso Actual** (si disponible)
   - [ ] Formulario F-007
   - [ ] Odoo - Pantalla de factura
   - [ ] NAF - Registro de factura (si accesible)

### Iconos/Emojis por Pilar

- Hallazgos 2025: 📋 o 🔍
- Volumen del Problema: 📊 o 📈
- Proceso Actual: ⚙️ o 🔄
- Propuesta 2026: 💼 o 🎯
- Detalles Técnicos: 🔧 o 💻
- Mantenimiento DMS: 🖥️ o 🛠️
- Plan de Trabajo: 📅 o 🗓️

---

## 🚀 Plan de Implementación

### Fase 1: Homepage y Navegación (2-3 horas)
1. Diseñar componente PillarCard
2. Crear homepage con 6 paneles + barra
3. Implementar navegación entre páginas
4. Agregar animaciones de transición

### Fase 2: Pilar 1 - Diagnóstico (4-5 horas)
1. Página Hallazgos 2025
2. Página Volumen del Problema
3. Página Proceso Actual

### Fase 3: Pilar 2 - Solución (3-4 horas)
1. Página Propuesta 2026
2. Página Detalles Técnicos
3. Página Mantenimiento DMS

### Fase 4: Pilar 3 - Ejecución (5-6 horas)
1. Página Plan de Trabajo 2026
2. Componente Gantt
3. Componente Calendario
4. Matriz RACI
5. Cards de riesgos

### Fase 5: Pulido y Testing (2-3 horas)
1. Responsividad
2. Navegación
3. Exportación a PDF (si aplica)
4. Testing completo

**Total Estimado**: 16-21 horas de desarrollo

---

## ✅ Próximos Pasos

1. **Confirmar estructura** con el usuario
2. **Obtener screenshots** de dms.alteridad.org
3. **Decidir nivel de detalle** del Gantt (50 tareas vs 20 tareas)
4. **Comenzar implementación** por fases
5. **Iterar con feedback** del usuario

---

¿Confirmamos esta estructura antes de empezar a implementar?
