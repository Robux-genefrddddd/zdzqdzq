import { useRef, useState } from "react";
import { CanvasElement } from "./canvas-element";
import { Layer } from "@shared/types";

interface CanvasProps {
  elements: Layer[];
  selectedElementId: string | null;
  zoom: number;
  panX: number;
  panY: number;
  activeTool?: string;
  onSelectElement: (id: string | null) => void;
  onAddElement: (type: string, x: number, y: number) => string;
  onUpdateElement: (id: string, updates: any) => void;
}

export function Canvas({
  elements,
  selectedElementId,
  zoom,
  panX,
  panY,
  activeTool = "select",
  onSelectElement,
  onAddElement,
  onUpdateElement,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isCanvasCreating, setIsCanvasCreating] = useState(false);
  const [createStart, setCreateStart] = useState({ x: 0, y: 0 });
  const [previewRect, setPreviewRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "select") return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panX;
    const y = (e.clientY - rect.top) / zoom - panY;

    setIsCanvasCreating(true);
    setCreateStart({ x, y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isCanvasCreating || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panX;
    const y = (e.clientY - rect.top) / zoom - panY;

    // Visual feedback for element creation could be added here
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (!isCanvasCreating || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panX;
    const y = (e.clientY - rect.top) / zoom - panY;

    // Don't create if barely dragged
    if (Math.abs(x - createStart.x) < 10 && Math.abs(y - createStart.y) < 10) {
      onAddElement(activeTool, createStart.x, createStart.y);
    } else {
      const width = Math.max(50, x - createStart.x);
      const height = Math.max(50, y - createStart.y);
      const id = onAddElement(activeTool, createStart.x, createStart.y);
      onUpdateElement(id, { width, height });
    }

    setIsCanvasCreating(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking empty canvas (only if click is on the canvas itself, not a child)
    if (e.currentTarget === e.target) {
      onSelectElement(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gradient-to-b from-background to-secondary/20 overflow-auto"
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.02) 25%, rgba(255, 255, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.02) 75%, rgba(255, 255, 255, 0.02) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.02) 25%, rgba(255, 255, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.02) 75%, rgba(255, 255, 255, 0.02) 76%, transparent 77%, transparent)
        `,
        backgroundSize: "50px 50px",
      }}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Canvas Container */}
      <div
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: isCanvasCreating ? "none" : undefined,
        }}
      >
        {elements.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2">
              <div className="text-6xl opacity-20">📐</div>
              <p className="text-muted-foreground text-sm opacity-50">
                Click a tool and drag on canvas to create an element
              </p>
            </div>
          </div>
        ) : (
          elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={() => onSelectElement(element.id)}
              onUpdate={(updates) =>
                onUpdateElement(element.id, updates)
              }
              zoom={zoom}
            />
          ))
        )}
      </div>
    </div>
  );
}
