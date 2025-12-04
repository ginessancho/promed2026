import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CustomAuthProvider } from "./contexts/CustomAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINAS PRINCIPALES
// ═══════════════════════════════════════════════════════════════════════════════
import Home from "./pages/Home";

// ═══════════════════════════════════════════════════════════════════════════════
// MÓDULO: FACTURACIÓN
// ═══════════════════════════════════════════════════════════════════════════════
import FacturacionIndex from "./pages/facturacion/index";
import Hallazgos2025 from "./pages/facturacion/Hallazgos2025";
import VolumenProblema from "./pages/facturacion/VolumenProblema";
import ProcesoActual from "./pages/facturacion/ProcesoActual";
import Propuesta2026 from "./pages/facturacion/Propuesta2026";
import DetallesTecnicos from "./pages/facturacion/DetallesTecnicos";
import MantenimientoDMS from "./pages/facturacion/MantenimientoDMS";
import CostosAnalisis from "./pages/facturacion/CostosAnalisis";
import PlanTrabajo from "./pages/facturacion/PlanTrabajo";
import Demonstracion from "./pages/facturacion/Demonstracion";

// ═══════════════════════════════════════════════════════════════════════════════
// MÓDULO: ERP (NAF → NetSuite)
// ═══════════════════════════════════════════════════════════════════════════════
import ERPIndex from "./pages/erp/index";
import ERPModeloROI from "./pages/erp/ModeloROI";
import ERPCostoBeneficio from "./pages/erp/CostoBeneficio";
import ERPMapeoModulos from "./pages/erp/MapeoModulos";
import ERPResumenDecisiones from "./pages/erp/ResumenDecisiones";

// ═══════════════════════════════════════════════════════════════════════════════
// MÓDULO: PROCESOS CRÍTICOS
// ═══════════════════════════════════════════════════════════════════════════════
import ProcesosIndex from "./pages/procesos/index";
import Comodatos from "./pages/procesos/Comodatos";
import Activos from "./pages/procesos/Activos";
import AdministracionOperacional from "./pages/procesos/AdministracionOperacional";
import ServicioTecnico from "./pages/procesos/ServicioTecnico";
import Importaciones from "./pages/procesos/Importaciones";

function Router() {
  return (
    <Switch>
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HOME - Portal Principal */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Route path="/" component={Home} />

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* FACTURACIÓN - Rutas del módulo de facturación */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Route path="/facturacion" component={FacturacionIndex} />
      <Route path="/facturacion/hallazgos-2025" component={Hallazgos2025} />
      <Route path="/facturacion/volumen-problema" component={VolumenProblema} />
      <Route path="/facturacion/proceso-actual" component={ProcesoActual} />
      <Route path="/facturacion/propuesta-2026" component={Propuesta2026} />
      <Route path="/facturacion/detalles-tecnicos" component={DetallesTecnicos} />
      <Route path="/facturacion/mantenimiento-dms" component={MantenimientoDMS} />
      <Route path="/facturacion/analisis-costos" component={CostosAnalisis} />
      <Route path="/facturacion/plan-de-trabajo" component={PlanTrabajo} />
      <Route path="/facturacion/demonstracion" component={Demonstracion} />

      {/* Rutas legacy (mantener compatibilidad con bookmarks existentes) */}
      <Route path="/hallazgos-2025" component={Hallazgos2025} />
      <Route path="/volumen-problema" component={VolumenProblema} />
      <Route path="/proceso-actual" component={ProcesoActual} />
      <Route path="/propuesta-2026" component={Propuesta2026} />
      <Route path="/detalles-tecnicos" component={DetallesTecnicos} />
      <Route path="/mantenimiento-dms" component={MantenimientoDMS} />
      <Route path="/analisis-costos" component={CostosAnalisis} />
      <Route path="/plan-de-trabajo" component={PlanTrabajo} />
      <Route path="/demonstracion" component={Demonstracion} />

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ERP - Rutas del módulo de migración ERP */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Route path="/erp" component={ERPIndex} />
      <Route path="/erp/modelo-roi" component={ERPModeloROI} />
      <Route path="/erp/costo-beneficio" component={ERPCostoBeneficio} />
      <Route path="/erp/mapeo-modulos" component={ERPMapeoModulos} />
      <Route path="/erp/resumen-decisiones" component={ERPResumenDecisiones} />

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* PROCESOS - Rutas del módulo de procesos críticos */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Route path="/procesos" component={ProcesosIndex} />
      <Route path="/procesos/comodatos" component={Comodatos} />
      <Route path="/procesos/activos" component={Activos} />
      <Route path="/procesos/administracion" component={AdministracionOperacional} />
      <Route path="/procesos/servicio-tecnico" component={ServicioTecnico} />
      <Route path="/procesos/importaciones" component={Importaciones} />

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* FALLBACKS */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CustomAuthProvider>
          <TooltipProvider>
            <Toaster />
            <ProtectedRoute>
              <Router />
            </ProtectedRoute>
          </TooltipProvider>
        </CustomAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
