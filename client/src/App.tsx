import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CustomAuthProvider } from "./contexts/CustomAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Propuesta from "./pages/Propuesta";
import Hallazgos2025 from "./pages/Hallazgos2025";
import VolumenProblema from "./pages/VolumenProblema";
import ProcesoActual from "./pages/ProcesoActual";
import Propuesta2026 from "./pages/Propuesta2026";
import DetallesTecnicos from "./pages/DetallesTecnicos";
import MantenimientoDMS from "./pages/MantenimientoDMS";
import PlanTrabajo2026 from "./pages/PlanTrabajo2026";
import Demonstracion from "./pages/Demonstracion";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/propuesta-original"} component={Propuesta} />
      <Route path={"/hallazgos-2025"} component={Hallazgos2025} />
      <Route path={"/volumen-problema"} component={VolumenProblema} />
      <Route path={"/proceso-actual"} component={ProcesoActual} />
      <Route path={"/propuesta-2026"} component={Propuesta2026} />
      <Route path={"/detalles-tecnicos"} component={DetallesTecnicos} />
      <Route path={"/mantenimiento-dms"} component={MantenimientoDMS} />
      <Route path={"/plan-trabajo-2026"} component={PlanTrabajo2026} />
      <Route path={"/demonstracion"} component={Demonstracion} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
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
