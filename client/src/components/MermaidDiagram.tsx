import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 14,
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const element = document.createElement('div');
      element.className = 'mermaid';
      element.innerHTML = chart.trim();
      containerRef.current.appendChild(element);
      
      mermaid.run({
        nodes: [element],
      });
    }
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      id={id}
      className="w-full overflow-x-auto bg-card border border-border rounded-lg p-6"
    />
  );
}
