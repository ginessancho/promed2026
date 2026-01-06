import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";

interface MermaidDiagramProps {
  chart: string;
  id: string;
  className?: string;
}

// Initialize globally once
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: 14,
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
  },
});

export default function MermaidDiagram({ chart, id, className }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  
  useEffect(() => {
    let mounted = true;

    const renderChart = async () => {
      try {
        // Generate a unique ID for this specific render to ensure marker/def isolation
        const uniqueId = `${id}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);
        
        if (mounted) {
          setSvg(renderedSvg);
        }
      } catch (error) {
        console.error("Mermaid render error:", error);
      }
    };

    renderChart();

    return () => {
      mounted = false;
    };
  }, [chart, id]);

  return (
    <div
      className={cn(
        "mermaid-diagram max-w-full overflow-x-auto bg-card border border-border rounded-lg p-6 flex justify-center",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
