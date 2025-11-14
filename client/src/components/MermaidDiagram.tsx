import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  id: string;
  animated?: boolean;
}

export default function MermaidDiagram({ chart, id, animated = true }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 14,
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const element = document.createElement('div');
      element.className = 'mermaid';
      element.textContent = chart;
      containerRef.current.appendChild(element);
      
      mermaid.run({
        nodes: [element],
      }).then(() => {
        if (animated) {
          addAnimations(containerRef.current);
        }
      });
    }
  }, [chart, animated]);

  const addAnimations = (container: HTMLDivElement | null) => {
    if (!container) return;

    // Add animation classes to SVG elements
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Animate all edges (arrows)
    const edges = svg.querySelectorAll('.edgePath path');
    edges.forEach((edge, index) => {
      const pathElement = edge as SVGPathElement;
      pathElement.style.strokeDasharray = '5, 5';
      pathElement.style.animation = `flowAnimation 2s linear infinite`;
      pathElement.style.animationDelay = `${index * 0.1}s`;
    });

    // Pulse decision nodes (diamonds)
    const decisions = svg.querySelectorAll('.node[class*="decision"], .node polygon');
    decisions.forEach((node) => {
      const element = node as SVGElement;
      element.style.animation = 'pulseNode 2s ease-in-out infinite';
    });

    // Glow effect on critical nodes
    const criticalNodes = svg.querySelectorAll('.node rect[style*="fill:#90EE90"], .node rect[style*="fill:#90ee90"]');
    criticalNodes.forEach((node) => {
      const element = node as SVGElement;
      element.style.animation = 'glowGreen 2s ease-in-out infinite';
    });

    // Error nodes pulse red
    const errorNodes = svg.querySelectorAll('.node rect[style*="fill:#FF6B6B"], .node rect[style*="fill:#ff6b6b"]');
    errorNodes.forEach((node) => {
      const element = node as SVGElement;
      element.style.animation = 'pulseRed 1.5s ease-in-out infinite';
    });
  };

  return (
    <>
      <style>{`
        @keyframes flowAnimation {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 10;
          }
        }

        @keyframes pulseNode {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes glowGreen {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(144, 238, 144, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(144, 238, 144, 0.9));
          }
        }

        @keyframes pulseRed {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(255, 107, 107, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.9));
          }
        }

        /* Fade in on scroll */
        .mermaid-container {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hover effects */
        .mermaid svg .node:hover {
          cursor: pointer;
          opacity: 0.9;
        }

        .mermaid svg .edgePath:hover path {
          stroke-width: 2.5px;
          cursor: pointer;
        }
      `}</style>
      <div 
        ref={containerRef} 
        id={id}
        className="mermaid-container w-full overflow-x-auto bg-card border border-border rounded-lg p-6"
      />
    </>
  );
}
