import { useRef, useEffect, useState } from "react";
import { CanvasElement } from "./canvas-element";
import { useCanvasState } from "@/hooks/useCanvasState";
import { Layer } from "@shared/types";

interface CanvasProps {
  initialLayers?: Layer[];
  activeTool?: string;
  onStateChange?: (state: any) => void;
}

export function Canvas({
  initialLayers = [],
  activeTool = "select",
  onStateChange,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isCanvasCreating, setIsCanvasCreating] = useState(false);
  const [createStart, setCreateStart] = useState({ x: 0, y: 0 });

  const canvasState = useCanvasState(initialLayers);

  useEffect(() => {
    onStateChange?.(canvasState);
  }, [canvasState, onStateChange]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "select") return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasState.zoom - canvasState.panX;
    const y = (e.clientY - rect.top) / canvasState.zoom - canvasState.panY;

    setIsCanvasCreating(true);
    setCreateStart({ x, y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isCanvasCreating || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasState.zoom - canvasState.panX;
    const y = (e.clientY - rect.top) / canvasState.zoom - canvasState.panY;

    // Visual feedback for element creation could be added here
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (!isCanvasCreating || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasState.zoom - canvasState.panX;
    const y = (e.clientY - rect.top) / canvasState.zoom - canvasState.panY;

    // Don't create if barely dragged
    if (Math.abs(x - createStart.x) < 10 && Math.abs(y - createStart.y) < 10) {
      canvasState.addElement(activeTool as any, createStart.x, createStart.y);
    } else {
      const width = Math.max(50, x - createStart.x);
      const height = Math.max(50, y - createStart.y);
      const id = canvasState.addElement(activeTool as any, createStart.x, createStart.y);
      canvasState.updateElement(id, { width, height });
    }

    setIsCanvasCreating(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking empty canvas
    if (e.target === canvasRef.current) {
      canvasState.selectElement(null);
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
          transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
          transformOrigin: "0 0",
          transition: isCanvasCreating ? "none" : undefined,
        }}
      >
        {canvasState.elements.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2">
              <div className="text-6xl opacity-20">📐</div>
              <p className="text-muted-foreground text-sm opacity-50">
                Click a tool and drag on canvas to create an element
              </p>
            </div>
          </div>
        ) : (
          canvasState.elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={canvasState.selectedElementId === element.id}
              onSelect={() => canvasState.selectElement(element.id)}
              onUpdate={(updates) =>
                canvasState.updateElement(element.id, updates)
              }
              zoom={canvasState.zoom}
            />
          ))
        )}
      </div>
    </div>
  );
}
