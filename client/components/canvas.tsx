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
  activeShapeType?: string;
  onSelectElement: (id: string | null) => void;
  onAddElement: (type: string, x: number, y: number, shapeType?: string) => string;
  onUpdateElement: (id: string, updates: any) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
}

export function Canvas({
  elements,
  selectedElementId,
  zoom,
  panX,
  panY,
  activeTool = "select",
  activeShapeType = "rectangle",
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
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
  const [isLassoSelecting, setIsLassoSelecting] = useState(false);
  const [lassoRect, setLassoRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [lassoStart, setLassoStart] = useState({ x: 0, y: 0 });

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panX;
    const y = (e.clientY - rect.top) / zoom - panY;

    // Lasso selection in select mode
    if (activeTool === "select" && e.target === canvasRef.current) {
      setIsLassoSelecting(true);
      setLassoStart({ x, y });
      return;
    }

    // Element creation mode
    if (activeTool === "select") return;

    setIsCanvasCreating(true);
    setCreateStart({ x, y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panX;
    const y = (e.clientY - rect.top) / zoom - panY;

    // Lasso selection
    if (isLassoSelecting) {
      const width = x - lassoStart.x;
      const height = y - lassoStart.y;
      setLassoRect({
        x: width > 0 ? lassoStart.x : x,
        y: height > 0 ? lassoStart.y : y,
        width: Math.abs(width),
        height: Math.abs(height),
      });
      return;
    }

    // Show live preview while dragging for element creation
    if (!isCanvasCreating) return;

    const width = Math.max(50, x - createStart.x);
    const height = Math.max(50, y - createStart.y);
    setPreviewRect({
      x: createStart.x,
      y: createStart.y,
      width,
      height,
    });
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    // Handle lasso selection
    if (isLassoSelecting && lassoRect) {
      setIsLassoSelecting(false);
      setLassoRect(null);
      // Select elements within lasso rect
      const selectedInLasso = elements.filter((el) => {
        if (!el.properties) return false;
        const { x, y, width, height } = el.properties;
        return (
          x < lassoRect.x + lassoRect.width &&
          x + width > lassoRect.x &&
          y < lassoRect.y + lassoRect.height &&
          y + height > lassoRect.y
        );
      });

      // Select first element in lasso if any
      if (selectedInLasso.length > 0) {
        onSelectElement(selectedInLasso[0].id);
      }
      return;
    }

    // Handle element creation
    if (!isCanvasCreating) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panX;
    const y = (e.clientY - rect.top) / zoom - panY;

    // Shape types that need shapeType parameter
    const shapeTypes = ["rectangle", "circle", "triangle", "polygon", "line", "arrow", "star"];
    const shapeTypeParam = shapeTypes.includes(activeTool) ? activeTool : undefined;

    // Don't create if barely dragged
    if (Math.abs(x - createStart.x) < 10 && Math.abs(y - createStart.y) < 10) {
      onAddElement(activeTool, createStart.x, createStart.y, shapeTypeParam);
    } else {
      const width = Math.max(50, x - createStart.x);
      const height = Math.max(50, y - createStart.y);
      const id = onAddElement(activeTool, createStart.x, createStart.y, shapeTypeParam);
      onUpdateElement(id, { width, height });
    }

    setIsCanvasCreating(false);
    setPreviewRect(null);
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
              onDelete={() => onDeleteElement?.(element.id)}
              onDuplicate={() => onDuplicateElement?.(element.id)}
              zoom={zoom}
            />
          ))
        )}

        {/* Live Preview Rectangle while dragging */}
        {previewRect && (
          <div
            style={{
              position: "absolute",
              left: `${previewRect.x}px`,
              top: `${previewRect.y}px`,
              width: `${previewRect.width}px`,
              height: `${previewRect.height}px`,
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              border: "2px solid #6366f1",
              borderRadius: "8px",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}

        {/* Lasso Selection Rectangle */}
        {lassoRect && (
          <div
            style={{
              position: "absolute",
              left: `${lassoRect.x}px`,
              top: `${lassoRect.y}px`,
              width: `${lassoRect.width}px`,
              height: `${lassoRect.height}px`,
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              border: "2px dashed #3b82f6",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
}
