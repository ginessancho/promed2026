import Sidebar from '@/components/Sidebar';
import AnomaliesChart from '@/components/AnomaliesChart';
import ProjectTimeline from '@/components/ProjectTimeline';
import MermaidDiagram from '@/components/MermaidDiagram';
import { architectureDiagram, flowDiagram, businessRulesDiagram } from '@/data/diagrams';
import { projectPhases, investmentBreakdown, criticalFields, weeklyRoutine } from '@/data/metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, Calendar, DollarSign, Target, Users, Workflow } from 'lucide-react';

export default function Propuesta() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:ml-72 print:ml-0">
        {/* Portada */}
        <section id="top" className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-12 py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="mb-12 flex flex-col sm:flex-row gap-8 sm:gap-12 items-center">
            <img src="/logo-alteridad.png" alt="Alteridad" className="h-20 sm:h-24 lg:h-32 object-contain" />
            <img src="/logo-promed.webp" alt="Promed" className="h-20 sm:h-24 lg:h-32 object-contain" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-4xl">
            Propuesta de Integración y Automatización de Facturación
          </h1>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-12">
            Proyecto F-007 con Odoo
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-base sm:text-lg text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>Preparado por <strong className="text-foreground">Alteridad</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span>para <strong className="text-foreground">PROMED S.A.</strong></span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-lg text-muted-foreground mt-12 mb-8">
            <Calendar className="w-5 h-5" />
            <span>Noviembre 2025</span>
          </div>
          
          <div className="mt-16 text-left bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-foreground font-semibold">Ginés A Sánchez Arias</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <a href="mailto:gines@alteridad.org" className="hover:text-primary transition-colors">
                  gines@alteridad.org
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+33 0664691043</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-16 space-y-20">
          
          {/* Resumen Ejecutivo */}
          <section id="resumen" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              Resumen Ejecutivo
            </h2>
            
            <Card>
              <CardContent className="pt-6 prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed">
                  Promed enfrenta desafíos críticos de integridad de datos en su sistema de facturación, derivados de procesos manuales 
                  y la falta de integración entre Odoo y NAF. El análisis de datos reveló que <strong className="text-accent">14.4% de los artículos</strong> 
                  tienen múltiples marcas asociadas, <strong className="text-accent">70 facturas</strong> presentan inconsistencias en comodatos, 
                  y existen discrepancias sistemáticas en el cálculo de ganancias.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Esta propuesta presenta una solución integral de <strong className="text-primary">automatización y gestión centralizada de reglas de negocio</strong> que 
                  eliminará los reprocesos manuales, garantizará la consistencia de datos críticos y proporcionará una base sólida para 
                  la toma de decisiones estratégicas.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 not-prose">
                  <div className="bg-primary/10 rounded-lg p-6 text-center">
                    <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary">$29K</div>
                    <div className="text-sm text-muted-foreground mt-1">Inversión Total</div>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-6 text-center">
                    <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-3xl font-bold text-accent">12 meses</div>
                    <div className="text-sm text-muted-foreground mt-1">Duración del Proyecto</div>
                  </div>
                  <div className="bg-chart-2/10 rounded-lg p-6 text-center">
                    <Users className="w-8 h-8 text-chart-2 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-chart-2">3 equipos</div>
                    <div className="text-sm text-muted-foreground mt-1">Colaboración Integrada</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 1. Introducción */}
          <section id="introduccion" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              1. Introducción y Diagnóstico Basado en Análisis de Datos
            </h2>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">1.1. Contexto del Negocio</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                  <p>
                    Promed, como líder en los sectores Médico, Industrial y de Investigación, depende de un análisis de ventas preciso 
                    para mantener su posición estratégica en el mercado. La calidad de los datos de facturación es la piedra angular 
                    para la toma de decisiones comerciales, de marketing y de inventario.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">1.2. El Problema: Inconsistencias Sistémicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    Un análisis de integridad de datos sobre la tabla <code className="bg-muted px-2 py-1 rounded">facturacion_detallada</code> ha 
                    revelado un patrón de <strong>inconsistencias sistémicas y errores derivados de procesos manuales</strong> que afectan 
                    la confiabilidad de la información crítica para el negocio.
                  </p>
                  
                  <AnomaliesChart />
                  
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mt-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-destructive" />
                      Impacto en el Negocio
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Análisis de ventas por marca no fiable</li>
                      <li>• Pérdida de trazabilidad de activos críticos</li>
                      <li>• Reportes financieros imprecisos</li>
                      <li>• Dificultad para evaluar la rentabilidad real de los productos</li>
                      <li>• Confusión en la auditoría y seguimiento de facturas</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">1.3. Objetivo de la Propuesta</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                  <p>
                    El objetivo de esta propuesta es presentar un proyecto integral para el <strong>diseño, desarrollo e implementación 
                    de una solución de integración y automatización</strong> que resuelva de raíz no solo el problema de las marcas, 
                    sino todo el espectro de errores humanos y de integridad de datos.
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Reemplazar</strong> el flujo manual de F-007 con un proceso automatizado y centralizado en Odoo</li>
                    <li><strong>Integrar</strong> Odoo con NAF para una transferencia de datos fluida, validada y automática</li>
                    <li><strong>Implementar reglas de negocio centralizadas</strong> para garantizar la consistencia de los datos</li>
                    <li><strong>Eliminar</strong> los reprocesos manuales y la dependencia de la entrada de datos duplicada</li>
                    <li><strong>Garantizar</strong> la precisión y consistencia de los datos críticos de facturación</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 2. Solución Propuesta */}
          <section id="solucion" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              2. Solución Propuesta: Automatización y Reglas de Negocio
            </h2>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">2.1. Flujo de Proceso Propuesto (TO-BE)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-6">
                    El nuevo flujo de trabajo será automatizado, coherente y gobernado por reglas de negocio claras, 
                    con Odoo como el punto de origen de la verdad.
                  </p>
                  <MermaidDiagram chart={flowDiagram} id="flow-diagram" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">2.2. Arquitectura Técnica de Integración</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-6">
                    La arquitectura propuesta se basa en un <strong>Data Management System (DMS)</strong> que actúa como middleware 
                    entre Odoo y NAF, gestionando la validación, enriquecimiento y sincronización de datos.
                  </p>
                  <MermaidDiagram chart={architectureDiagram} id="architecture-diagram" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">2.3. Motor de Reglas de Negocio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-6">
                    El DMS implementará un motor de reglas de negocio centralizado que validará automáticamente 
                    todos los campos críticos antes de la sincronización con NAF.
                  </p>
                  <MermaidDiagram chart={businessRulesDiagram} id="business-rules-diagram" />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 3. Campos Críticos */}
          <section id="campos" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              3. Campos Críticos de Integración
            </h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Clasificación Detallada de Campos</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Estos campos son fundamentales para la integridad de datos, análisis de negocio y trazabilidad.
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Campo</TableHead>
                        <TableHead className="font-semibold">Descripción</TableHead>
                        <TableHead className="font-semibold">Criticidad</TableHead>
                        <TableHead className="font-semibold">Impacto en el Negocio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {criticalFields.map((field, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm font-semibold">
                            {field.campo}
                          </TableCell>
                          <TableCell>{field.descripcion}</TableCell>
                          <TableCell>
                            <Badge variant="destructive" className="bg-accent">
                              {field.criticidad}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{field.impacto}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 4. Nuevo Enfoque */}
          <section id="enfoque" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              4. Nuevo Enfoque: Acompañamiento Estratégico
            </h2>
            
            <Card>
              <CardContent className="pt-6 prose prose-lg max-w-none">
                <p>
                  Alteridad propone un <strong>modelo de acompañamiento estratégico</strong> que va más allá de la consultoría tradicional. 
                  Actuaremos como <strong>Gestor de Transición</strong>, coordinando todos los aspectos del proyecto y asegurando 
                  que la implementación técnica esté alineada con los objetivos de negocio.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 not-prose">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-3">Rol de Alteridad</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Gestión del plan de transición</li>
                      <li>• Coordinación entre equipos</li>
                      <li>• Gestión de riesgos y dependencias</li>
                      <li>• Validación de entregables</li>
                      <li>• Documentación y transferencia de conocimiento</li>
                    </ul>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-3">Partner Técnico</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Gateway Resources Technology, S.A.</li>
                      <li>• Desarrollo del módulo de integración</li>
                      <li>• Implementación de reglas de negocio</li>
                      <li>• Integración Odoo-NAF</li>
                      <li>• Soporte técnico especializado</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 5. Modelo de Servicio */}
          <section id="modelo" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              5. Modelo de Servicio Mensual
            </h2>
            
            <Card>
              <CardContent className="pt-6 prose prose-lg max-w-none">
                <p>
                  El servicio se estructura como un <strong>acompañamiento mensual de 12 meses</strong>, con dedicación continua 
                  y reuniones de seguimiento regulares para garantizar el éxito del proyecto.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 not-prose">
                  <div className="bg-primary/10 rounded-lg p-6">
                    <h4 className="font-semibold mb-2">Reuniones Semanales</h4>
                    <p className="text-3xl font-bold text-primary">45 min</p>
                    <p className="text-sm text-muted-foreground mt-2">Seguimiento técnico con el equipo</p>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-6">
                    <h4 className="font-semibold mb-2">Reuniones Mensuales</h4>
                    <p className="text-3xl font-bold text-accent">1 hora</p>
                    <p className="text-sm text-muted-foreground mt-2">Presentación ejecutiva de avances</p>
                  </div>
                  <div className="bg-chart-2/10 rounded-lg p-6">
                    <h4 className="font-semibold mb-2">Disponibilidad</h4>
                    <p className="text-3xl font-bold text-chart-2">Continua</p>
                    <p className="text-sm text-muted-foreground mt-2">Soporte vía email y chat</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 6. Inversión */}
          <section id="inversion" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              6. Inversión y Estructura de Pago
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-primary" />
                    Desglose de Inversión
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {investmentBreakdown.map((item, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{item.category}</h4>
                          <span className="text-2xl font-bold text-primary">
                            ${item.amount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-2 w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t-2 border-primary">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">Total</span>
                        <span className="text-3xl font-bold text-primary">$29,000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Condiciones de Pago</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                  <ul className="space-y-4">
                    <li>
                      <strong className="text-primary">Adelanto Inicial:</strong> $5,000 USD al firmar el contrato
                    </li>
                    <li>
                      <strong className="text-primary">Pagos Mensuales:</strong> $2,000 USD mensuales durante 12 meses
                    </li>
                    <li>
                      <strong className="text-primary">Facturación:</strong> Primera semana de cada mes
                    </li>
                    <li>
                      <strong className="text-primary">Forma de Pago:</strong> Transferencia bancaria
                    </li>
                  </ul>
                  
                  <div className="bg-muted rounded-lg p-4 mt-6 not-prose">
                    <p className="text-sm text-muted-foreground">
                      <strong>Nota:</strong> El adelanto inicial cubre los costos de arranque del proyecto, 
                      incluyendo análisis detallado, diseño de arquitectura y planificación.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 7. Plan de Proyecto */}
          <section id="plan" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              7. Plan de Proyecto y Timeline
            </h2>
            
            <ProjectTimeline />
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-2xl">Fases del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectPhases.map((phase, index) => (
                    <div key={index} className="border-l-4 border-primary pl-6 py-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{phase.phase}: {phase.name}</h4>
                          <p className="text-sm text-muted-foreground">{phase.months} • {phase.duration} meses</p>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1">
                        {phase.deliverables.map((deliverable, dIndex) => (
                          <li key={dIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 8. Plan de Trabajo */}
          <section id="trabajo" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              8. Plan de Trabajo y Rutinas
            </h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Rutina Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Día</TableHead>
                      <TableHead className="font-semibold">Actividad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyRoutine.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">{item.day}</TableCell>
                        <TableCell>{item.activity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-2xl">Roles y Responsabilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Alteridad (Gestor de Transición)
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Lidera la coordinación del proyecto</li>
                      <li>• Gestiona el plan y los riesgos</li>
                      <li>• Define y valida reglas de negocio</li>
                      <li>• Facilita la comunicación entre equipos</li>
                    </ul>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-accent" />
                      Promed (Sponsor y Usuarios)
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Proporciona la visión de negocio</li>
                      <li>• Valida los entregables</li>
                      <li>• Participa en las pruebas</li>
                      <li>• Aprueba cambios y decisiones clave</li>
                    </ul>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-chart-2" />
                      Gateway Resources (Partner Técnico)
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Ejecuta el desarrollo técnico en Odoo</li>
                      <li>• Implementa la integración con NAF</li>
                      <li>• Desarrolla el módulo de integración</li>
                      <li>• Proporciona soporte técnico</li>
                    </ul>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-chart-4" />
                      IT de Promed (Soporte Técnico)
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Proporciona acceso a los sistemas</li>
                      <li>• Soporte de infraestructura</li>
                      <li>• Coordinación con equipos internos</li>
                      <li>• Gestión de ambientes de prueba</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 9. Próximos Pasos */}
          <section id="proximos" className="scroll-mt-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              9. Próximos Pasos
            </h2>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {[
                    {
                      step: '1',
                      title: 'Revisión y Aprobación',
                      description: 'Promed revisa y aprueba esta propuesta de acompañamiento.',
                      icon: '📋',
                    },
                    {
                      step: '2',
                      title: 'Firma del Contrato',
                      description: 'Se formaliza el acuerdo de servicio mensual y el pago del adelanto.',
                      icon: '✍️',
                    },
                    {
                      step: '3',
                      title: 'Kick-off del Proyecto',
                      description: 'Reunión de inicio en diciembre de 2025 para preparar el arranque en enero de 2026.',
                      icon: '🚀',
                    },
                    {
                      step: '4',
                      title: 'Inicio del Servicio',
                      description: 'Comienzo del acompañamiento y ejecución del plan de transición en enero de 2026.',
                      icon: '⚡',
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-6 items-start">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">
                          Paso {item.step}: {item.title}
                        </h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 10. Anexos */}
          <section id="anexos" className="scroll-mt-20 mb-20">
            <h2 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-2 h-12 bg-primary rounded-full" />
              10. Anexos
            </h2>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Anexo A: Diagramas Originales</CardTitle>
                  <p className="text-muted-foreground">Diagramas de la propuesta inicial</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Diagrama de Flujo AS-IS vs TO-BE</h4>
                    <img 
                      src="/flujo_as_is_to_be.png" 
                      alt="Diagrama de Flujo" 
                      className="w-full border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Diagrama de Arquitectura Técnica</h4>
                    <img 
                      src="/arquitectura_tecnica.png" 
                      alt="Diagrama de Arquitectura" 
                      className="w-full border border-border rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-muted/30 border-t border-border py-12 print:hidden">
          <div className="max-w-6xl mx-auto px-12">
            <div className="flex justify-between items-center">
              <div className="flex gap-8 items-center">
                <img src="/logo-alteridad.png" alt="Alteridad" className="h-16 object-contain" />
                <div>
                  <p className="font-semibold">Alteridad</p>
                  <p className="text-sm text-muted-foreground">Consultoría Estratégica en Transformación Digital</p>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Propuesta F-007 - Versión 3.0</p>
                <p>Noviembre 2025</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
