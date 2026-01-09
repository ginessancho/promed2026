/**
 * Migration script: Convert wouter pages to Next.js App Router pages
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, basename } from 'path';

// Map of source files to destination directories
const migrations = [
  // Facturacion
  ['client/src/pages/facturacion/Hallazgos2025.tsx', 'app/facturacion/hallazgos-2025/page.tsx'],
  ['client/src/pages/facturacion/VolumenProblema.tsx', 'app/facturacion/volumen-problema/page.tsx'],
  ['client/src/pages/facturacion/ProcesoActual.tsx', 'app/facturacion/proceso-actual/page.tsx'],
  ['client/src/pages/facturacion/Propuesta2026.tsx', 'app/facturacion/propuesta-2026/page.tsx'],
  ['client/src/pages/facturacion/DetallesTecnicos.tsx', 'app/facturacion/detalles-tecnicos/page.tsx'],
  ['client/src/pages/facturacion/MantenimientoDMS.tsx', 'app/facturacion/mantenimiento-dms/page.tsx'],
  ['client/src/pages/facturacion/CostosAnalisis.tsx', 'app/facturacion/analisis-costos/page.tsx'],
  ['client/src/pages/facturacion/PlanTrabajo.tsx', 'app/facturacion/plan-de-trabajo/page.tsx'],
  ['client/src/pages/facturacion/Demonstracion.tsx', 'app/facturacion/demonstracion/page.tsx'],
  // ERP
  ['client/src/pages/erp/index.tsx', 'app/erp/page.tsx'],
  ['client/src/pages/erp/ModeloROI.tsx', 'app/erp/modelo-roi/page.tsx'],
  ['client/src/pages/erp/CostoBeneficio.tsx', 'app/erp/costo-beneficio/page.tsx'],
  ['client/src/pages/erp/MapeoModulos.tsx', 'app/erp/mapeo-modulos/page.tsx'],
  ['client/src/pages/erp/ResumenDecisiones.tsx', 'app/erp/resumen-decisiones/page.tsx'],
  // Procesos
  ['client/src/pages/procesos/index.tsx', 'app/procesos/page.tsx'],
  ['client/src/pages/procesos/Comodatos.tsx', 'app/procesos/comodatos/page.tsx'],
  ['client/src/pages/procesos/Activos.tsx', 'app/procesos/activos/page.tsx'],
  ['client/src/pages/procesos/AdministracionOperacional.tsx', 'app/procesos/administracion/page.tsx'],
  ['client/src/pages/procesos/ServicioTecnico.tsx', 'app/procesos/servicio-tecnico/page.tsx'],
  ['client/src/pages/procesos/Importaciones.tsx', 'app/procesos/importaciones/page.tsx'],
  // NotFound
  ['client/src/pages/NotFound.tsx', 'app/not-found/page.tsx'],
];

function convertFile(source, dest) {
  if (!existsSync(source)) {
    console.log(`⚠️  Skipping ${source} - file not found`);
    return;
  }

  let content = readFileSync(source, 'utf-8');
  
  // Add "use client" at the top if not already present
  if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
    content = '"use client";\n\n' + content;
  }
  
  // Replace wouter Link import with Next.js Link
  content = content.replace(
    /import\s*{\s*Link\s*}\s*from\s*['"]wouter['"];?/g,
    "import Link from 'next/link';"
  );
  
  // Replace wouter Link with multiple imports
  content = content.replace(
    /import\s*{\s*Link,\s*(.*?)\s*}\s*from\s*['"]wouter['"];?/g,
    "import Link from 'next/link';"
  );
  
  // Replace @/ imports for old client structure
  content = content.replace(/@\/const/g, '@/shared/const');
  
  // Replace import.meta.env.VITE_ with process.env.NEXT_PUBLIC_
  content = content.replace(/import\.meta\.env\.VITE_/g, 'process.env.NEXT_PUBLIC_');

  writeFileSync(dest, content);
  console.log(`✅ Converted: ${source} -> ${dest}`);
}

// Run migrations
console.log('🚀 Starting page migration...\n');
for (const [source, dest] of migrations) {
  convertFile(source, dest);
}
console.log('\n✨ Migration complete!');
