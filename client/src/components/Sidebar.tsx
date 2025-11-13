import { useEffect, useState } from 'react';
import { FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const sections = [
  { id: 'top', label: 'Inicio' },
  { id: 'resumen', label: 'Resumen Ejecutivo' },
  { id: 'introduccion', label: '1. Introducción' },
  { id: 'solucion', label: '2. Solución Propuesta' },
  { id: 'campos', label: '3. Campos Críticos' },
  { id: 'enfoque', label: '4. Nuevo Enfoque' },
  { id: 'modelo', label: '5. Modelo de Servicio' },
  { id: 'inversion', label: '6. Inversión' },
  { id: 'plan', label: '7. Plan de Proyecto' },
  { id: 'trabajo', label: '8. Plan de Trabajo' },
  { id: 'proximos', label: '9. Próximos Pasos' },
  { id: 'anexos', label: '10. Anexos' },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('top');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary text-primary-foreground p-3 rounded-lg shadow-lg print:hidden"
      >
        <FileText className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden print:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-card border-r border-border shadow-sm z-50 print:hidden transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Propuesta F-007</h2>
          </div>
          <p className="text-sm text-muted-foreground">Integración Odoo-NAF</p>
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-6 pt-6 border-t border-border">
          <Button onClick={handlePrint} className="w-full" variant="default">
            <Printer className="w-4 h-4 mr-2" />
            Exportar a PDF
          </Button>
        </div>
      </div>
    </aside>
    </>
  );
}
