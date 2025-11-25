import { useState, useMemo } from 'react';
import { ArrowLeft, HelpCircle, Users, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'wouter';

// Tipos de licencia NetSuite
type LicenseType = 'full' | 'self-service' | 'portal' | 'none' | 'external';

const licenseInfo: Record<LicenseType, { label: string; cost: number; color: string; description: string }> = {
  full: { 
    label: 'Full User', 
    cost: 129, 
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    description: 'Acceso completo a NetSuite. Para usuarios que crean, editan y aprueban transacciones.'
  },
  'self-service': { 
    label: 'Self-Service', 
    cost: 49, 
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    description: 'Acceso limitado. Para timesheet, expenses, consultas básicas.'
  },
  portal: { 
    label: 'Portal/App', 
    cost: 0, 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    description: 'Sin licencia NetSuite. Usan portal externo, app móvil o integración.'
  },
  none: { 
    label: 'No necesita', 
    cost: 0, 
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    description: 'No requieren acceso al ERP.'
  },
  external: { 
    label: 'Sistema externo', 
    cost: 0, 
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    description: 'Se mantiene en sistema especializado (ej: Planilla local).'
  },
};

// Módulos de NAF según RFP
interface ModuleMapping {
  nafModule: string;
  rfpUsers: number | string;
  netsuiteEquivalent: string;
  question: string;
  suggestedLicense: LicenseType;
  // Editable by user
  actualUsers: number;
  selectedLicense: LicenseType;
  notes: string;
}

const initialModules: ModuleMapping[] = [
  {
    nafModule: 'Finanzas (Contabilidad)',
    rfpUsers: 62,
    netsuiteEquivalent: 'Financial Management',
    question: '¿Cuántos realmente crean asientos contables vs. solo consultan reportes?',
    suggestedLicense: 'full',
    actualUsers: 62,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Cuentas por Pagar',
    rfpUsers: 'parte de 62',
    netsuiteEquivalent: 'Accounts Payable',
    question: '¿Cuántos procesan facturas de proveedores y pagos?',
    suggestedLicense: 'full',
    actualUsers: 15,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Cuentas por Cobrar',
    rfpUsers: 'parte de 62',
    netsuiteEquivalent: 'Accounts Receivable',
    question: '¿Cuántos gestionan cobranza y aplican pagos?',
    suggestedLicense: 'full',
    actualUsers: 10,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Banco / Caja',
    rfpUsers: 'parte de 62',
    netsuiteEquivalent: 'Bank & Cash Management',
    question: '¿Cuántos hacen conciliación bancaria y manejo de caja?',
    suggestedLicense: 'full',
    actualUsers: 8,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Facturación',
    rfpUsers: '¿?',
    netsuiteEquivalent: 'Invoicing / Billing',
    question: '¿Cuántos crean facturas? ¿Hay facturación automática?',
    suggestedLicense: 'full',
    actualUsers: 20,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Inventario',
    rfpUsers: '¿?',
    netsuiteEquivalent: 'Inventory Management',
    question: '¿Bodegueros usan WMS externo (Manhattan/Eflow) o NAF directo?',
    suggestedLicense: 'portal',
    actualUsers: 30,
    selectedLicense: 'portal',
    notes: 'Probablemente usan WMS que se integra',
  },
  {
    nafModule: 'Órdenes de Compra',
    rfpUsers: '¿?',
    netsuiteEquivalent: 'Purchase Orders',
    question: '¿Cuántos buyers/compradores crean OC a proveedores?',
    suggestedLicense: 'full',
    actualUsers: 25,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Activo Fijo',
    rfpUsers: 'parte de 62',
    netsuiteEquivalent: 'Fixed Assets',
    question: '¿Cuántos administran activos fijos y depreciación?',
    suggestedLicense: 'full',
    actualUsers: 3,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Planilla',
    rfpUsers: '¿?',
    netsuiteEquivalent: 'Payroll (o sistema local)',
    question: '¿Se migra planilla a NetSuite o se mantiene en sistema local por país?',
    suggestedLicense: 'external',
    actualUsers: 0,
    selectedLicense: 'external',
    notes: 'Recomendado: mantener en sistemas locales por complejidad regulatoria',
  },
  {
    nafModule: 'Importaciones',
    rfpUsers: 80,
    netsuiteEquivalent: 'Custom Module / Advanced Procurement',
    question: '¿Los 80 crean importaciones o la mayoría solo consulta estado?',
    suggestedLicense: 'full',
    actualUsers: 20,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Regulatorio',
    rfpUsers: 7,
    netsuiteEquivalent: 'Custom Records / Compliance',
    question: '¿Qué funciones regulatorias? ¿Registros sanitarios, trazabilidad?',
    suggestedLicense: 'full',
    actualUsers: 7,
    selectedLicense: 'full',
    notes: '',
  },
  {
    nafModule: 'Servicio Técnico',
    rfpUsers: 150,
    netsuiteEquivalent: 'Field Service / Case Management',
    question: '¿Técnicos de campo? ¿Necesitan app móvil o acceso completo ERP?',
    suggestedLicense: 'portal',
    actualUsers: 150,
    selectedLicense: 'portal',
    notes: 'Considerar app móvil de Field Service',
  },
  {
    nafModule: 'Transacciones',
    rfpUsers: 600,
    netsuiteEquivalent: '❓ POR DEFINIR',
    question: '⚠️ CRÍTICO: ¿Qué hacen estos 600 usuarios? ¿Entrada de pedidos? ¿Consultas? ¿Aprobaciones?',
    suggestedLicense: 'portal',
    actualUsers: 100,
    selectedLicense: 'self-service',
    notes: 'REQUIERE CLARIFICACIÓN - Asumiendo 100 activos, resto consulta',
  },
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function MapeoModulos() {
  const [modules, setModules] = useState<ModuleMapping[]>(initialModules);

  const updateModule = (index: number, field: keyof ModuleMapping, value: string | number) => {
    setModules(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Cálculos
  const totals = useMemo(() => {
    let fullUsers = 0;
    let selfServiceUsers = 0;
    let portalUsers = 0;
    let externalUsers = 0;
    let noLicenseUsers = 0;

    modules.forEach(m => {
      switch (m.selectedLicense) {
        case 'full': fullUsers += m.actualUsers; break;
        case 'self-service': selfServiceUsers += m.actualUsers; break;
        case 'portal': portalUsers += m.actualUsers; break;
        case 'external': externalUsers += m.actualUsers; break;
        case 'none': noLicenseUsers += m.actualUsers; break;
      }
    });

    const monthlyLicenseCost = (fullUsers * 129) + (selfServiceUsers * 49) + 2500 + 2500; // + base + modules
    const annualLicenseCost = monthlyLicenseCost * 12;
    const totalUsersWithLicense = fullUsers + selfServiceUsers;
    const totalUsersNoLicense = portalUsers + externalUsers + noLicenseUsers;

    return {
      fullUsers,
      selfServiceUsers,
      portalUsers,
      externalUsers,
      noLicenseUsers,
      totalUsersWithLicense,
      totalUsersNoLicense,
      monthlyLicenseCost,
      annualLicenseCost,
    };
  }, [modules]);

  // Comparación con escenario original (899 usuarios)
  const originalMonthly = (149 * 129) + (750 * 49) + 2500 + 2500;
  const savings = originalMonthly - totals.monthlyLicenseCost;
  const savingsPercent = ((savings / originalMonthly) * 100).toFixed(0);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/erp">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver a ERP
                </Button>
              </Link>
              <div className="text-right">
                <h1 className="text-lg font-bold">Mapeo de Módulos</h1>
                <p className="text-xs text-muted-foreground">NAF 6.0 → NetSuite</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Intro */}
          <section className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Ejercicio crítico antes de cotizar NetSuite
              </p>
            </div>
            <h2 className="text-2xl font-bold">
              ¿Cuántos usuarios realmente necesitan licencia?
            </h2>
            <p className="text-sm text-muted-foreground">
              El RFP indica 899 usuarios, pero no todos necesitan acceso directo a NetSuite. 
              Complete este mapeo para obtener un estimado realista de licencias.
            </p>
          </section>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">FULL USERS</span>
                </div>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300">{totals.fullUsers}</p>
                <p className="text-xs text-red-600/70">${129}/mes cada uno</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-600 font-medium">SELF-SERVICE</span>
                </div>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{totals.selfServiceUsers}</p>
                <p className="text-xs text-amber-600/70">${49}/mes cada uno</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">PORTAL / SIN LICENCIA</span>
                </div>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totals.totalUsersNoLicense}</p>
                <p className="text-xs text-blue-600/70">$0/mes (portal, app, externo)</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-600 font-medium">COSTO MENSUAL</span>
                </div>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  {formatMoney(totals.monthlyLicenseCost)}
                </p>
                <p className="text-xs text-emerald-600/70">{formatMoney(totals.annualLicenseCost)}/año</p>
              </CardContent>
            </Card>
          </div>

          {/* Comparison */}
          {savings > 0 && (
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      <strong>Ahorro vs. escenario original (899 usuarios):</strong>
                    </p>
                    <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                      {formatMoney(savings)}/mes = {formatMoney(savings * 12)}/año ({savingsPercent}% menos)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Module Mapping Table */}
          <Card>
            <CardHeader>
              <CardTitle>Mapeo de Módulos NAF → NetSuite</CardTitle>
              <CardDescription>
                Ajuste los usuarios reales y tipo de licencia para cada módulo
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Módulo NAF</TableHead>
                    <TableHead className="w-[80px]">RFP</TableHead>
                    <TableHead className="w-[180px]">NetSuite Equiv.</TableHead>
                    <TableHead className="w-[100px]">Usuarios Reales</TableHead>
                    <TableHead className="w-[160px]">Tipo Licencia</TableHead>
                    <TableHead>Pregunta / Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module, idx) => (
                    <TableRow 
                      key={module.nafModule}
                      className={module.nafModule === 'Transacciones' ? 'bg-amber-50 dark:bg-amber-950/30' : ''}
                    >
                      <TableCell className="font-medium">
                        {module.nafModule}
                        {module.nafModule === 'Transacciones' && (
                          <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                            ⚠️ Revisar
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {module.rfpUsers}
                      </TableCell>
                      <TableCell className="text-sm">{module.netsuiteEquivalent}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={module.actualUsers}
                          onChange={(e) => updateModule(idx, 'actualUsers', parseInt(e.target.value) || 0)}
                          className="w-20 h-8 text-sm"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={module.selectedLicense}
                          onValueChange={(v) => updateModule(idx, 'selectedLicense', v as LicenseType)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(licenseInfo).map(([key, info]) => (
                              <SelectItem key={key} value={key}>
                                <span className={`px-1.5 py-0.5 rounded text-xs ${info.color}`}>
                                  {info.label}
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                  {info.cost > 0 ? `$${info.cost}/mes` : 'Gratis'}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{module.question}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Input
                            value={module.notes}
                            onChange={(e) => updateModule(idx, 'notes', e.target.value)}
                            placeholder={module.question}
                            className="h-8 text-xs"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* License Types Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tipos de Licencia NetSuite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(licenseInfo).map(([key, info]) => (
                  <div key={key} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${info.color}`}>
                      {info.label}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                      <p className="text-xs font-medium mt-1">
                        {info.cost > 0 ? `$${info.cost}/usuario/mes` : 'Sin costo de licencia'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-5">
              <h3 className="font-semibold mb-3">📋 Próximos pasos</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. <strong>Clarificar "Transacciones" (600 usuarios)</strong> - ¿Qué hacen exactamente?</li>
                <li>2. <strong>Validar Servicio Técnico (150)</strong> - ¿App móvil o acceso ERP completo?</li>
                <li>3. <strong>Confirmar usuarios por módulo</strong> - Revisar con cada área</li>
                <li>4. <strong>Actualizar modelo financiero</strong> con números validados</li>
              </ol>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex justify-between pt-6 border-t">
            <Link href="/erp">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a ERP
              </Button>
            </Link>
            <Link href="/erp/costo-beneficio">
              <Button size="sm">
                Ver Análisis Costo-Beneficio
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

