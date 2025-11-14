# Propuesta F-007 Enhanced - Sitio Web Interactivo

Sitio web interactivo mejorado para presentar la propuesta de integración Odoo-NAF para Promed S.A.

## 🚀 Características Principales

### Mejoras Implementadas (Prioridad Alta)

1. **Gráficos Interactivos**
   - Visualización de anomalías detectadas en el análisis de datos
   - Gráfico de barras con Recharts mostrando:
     - Dispersión de marcas (14.4%)
     - Inconsistencias de comodatos (70 facturas)
     - Múltiples números físicos (430 facturas)
     - Errores de cálculo de ganancia
   - Tooltips informativos con detalles de impacto

2. **Logos Corporativos**
   - Logo de Alteridad integrado
   - Logo de Promed integrado
   - Colores corporativos de Alteridad (azul y rojo) aplicados en todo el diseño

3. **Diagramas Vectoriales con Mermaid.js**
   - Diagrama de flujo TO-BE (proceso propuesto)
   - Diagrama de arquitectura técnica (capas de integración)
   - Diagrama de reglas de negocio (validaciones)
   - Diagramas editables, escalables y de alta calidad

4. **Timeline Visual del Proyecto**
   - 12 meses de proyecto visualizados (Ene-Dic 2026)
   - Indicadores de progreso por mes
   - Fases del proyecto con código de colores
   - Actividades detalladas por mes

### Funcionalidades Adicionales

- ✅ **Navegación lateral** con outline automático y scroll suave
- ✅ **Indicador de sección activa** en la navegación
- ✅ **Diseño responsive** para móvil, tablet y desktop
- ✅ **Menú móvil** con overlay y animaciones
- ✅ **Exportación a PDF** con un clic (optimizado para impresión)
- ✅ **Tablas interactivas** con datos de campos críticos
- ✅ **Cards informativos** con KPIs del proyecto
- ✅ **Animaciones sutiles** en hover y scroll

## 📊 Contenido de la Propuesta

1. **Portada** - Logos corporativos e información de contacto
2. **Resumen Ejecutivo** - KPIs clave del proyecto
3. **Introducción y Diagnóstico** - Análisis de datos con gráficos
4. **Solución Propuesta** - Diagramas de flujo y arquitectura
5. **Campos Críticos** - Tabla detallada de campos de integración
6. **Nuevo Enfoque** - Modelo de acompañamiento estratégico
7. **Modelo de Servicio** - Estructura de reuniones y soporte
8. **Inversión** - Desglose financiero con visualización
9. **Plan de Proyecto** - Timeline de 12 meses con fases
10. **Plan de Trabajo** - Rutinas semanales y roles
11. **Próximos Pasos** - Roadmap de implementación
12. **Anexos** - Diagramas originales de referencia

## 🛠️ Stack Tecnológico

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Gráficos**: Recharts
- **Diagramas**: Mermaid.js
- **Iconos**: Lucide React
- **Build**: Vite 7
- **Routing**: Wouter

## 🎨 Diseño

- **Colores Corporativos**: 
  - Azul Alteridad: `oklch(0.54 0.18 230)`
  - Rojo Alteridad: `oklch(0.60 0.22 25)`
- **Tipografía**: System fonts (optimizado para rendimiento)
- **Espaciado**: Sistema de diseño consistente con Tailwind
- **Responsive**: Mobile-first design

## 📱 Responsive Design

- **Mobile** (< 640px): Menú hamburguesa, layout de una columna
- **Tablet** (640px - 1024px): Layout adaptativo
- **Desktop** (> 1024px): Sidebar fijo, layout de dos columnas

## 🖨️ Exportación a PDF

El sitio incluye estilos optimizados para impresión:
- Sidebar oculto en impresión
- Márgenes optimizados
- Saltos de página apropiados
- Colores ajustados para impresión

**Cómo exportar:**
1. Hacer clic en el botón "Exportar a PDF" en el sidebar
2. O usar `Ctrl+P` (Windows/Linux) o `Cmd+P` (Mac)
3. Seleccionar "Guardar como PDF"

## 📂 Estructura del Proyecto

```
client/
├── public/
│   ├── logo-alteridad.png
│   ├── logo-promed.webp
│   ├── arquitectura_tecnica.png
│   └── flujo_as_is_to_be.png
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx              # Navegación lateral
│   │   ├── AnomaliesChart.tsx       # Gráfico de anomalías
│   │   ├── ProjectTimeline.tsx      # Timeline del proyecto
│   │   └── MermaidDiagram.tsx       # Wrapper para Mermaid
│   ├── data/
│   │   ├── metrics.ts               # Datos estructurados
│   │   └── diagrams.ts              # Definiciones de diagramas
│   ├── pages/
│   │   └── Propuesta.tsx            # Página principal
│   ├── App.tsx
│   ├── index.css                    # Estilos globales + colores
│   └── const.ts                     # Constantes (logo, título)
└── ...
```

## 🚀 Desarrollo

### Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El sitio estará disponible en `http://localhost:3000` y se recarga automáticamente con los cambios.

### Build de Producción

```bash
# Crear build de producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

## 🌐 Deployment

El sitio está configurado para desplegarse en **promed.alteridad.org**.

### Quick Deploy

```bash
# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar script de deployment
./deploy.sh production
```

### Documentación Completa

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de deployment incluyendo:
- Deployment en servidor propio (VPS/Dedicated)
- Deployment en Vercel
- Deployment en Netlify
- Deployment con Docker
- Configuración de Nginx
- Configuración de SSL con Let's Encrypt

## 📝 Información del Proyecto

**Cliente**: Promed, S.A.  
**Proveedor**: Alteridad  
**Autor**: Ginés A. Sánchez Arias  
**Email**: gines@alteridad.org  
**Teléfono**: +33 0664691043  
**Fecha**: Noviembre 2025  
**Versión**: 3.0

## 💰 Inversión

- **Adelanto Inicial**: $5,000 USD
- **Servicio Mensual**: $2,000 USD/mes × 12 meses
- **Total**: $29,000 USD
- **Duración**: 12 meses (Enero - Diciembre 2026)

## 🎯 Partner Técnico

Gateway Resources Technology, S.A.

---

**Nota**: Este sitio web es una versión mejorada de la propuesta original, con gráficos interactivos, diagramas vectoriales de alta calidad, timeline visual y diseño responsive optimizado para presentación al cliente.
