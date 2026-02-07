import { useRef, useEffect } from "react";
import { CanvasElement } from "./canvas-element";
import { PathPreview, CanvasPath } from "./canvas-path";
import { Layer, PathPoint } from "@shared/types";
import { useCanvasTool } from "@/hooks/useCanvasTool";

interface CanvasProps {
  elements: Layer[];
  selectedElementId: string | null;
  zoom: number;
  panX: number;
  panY: number;
  activeTool?: string;
  activeShapeType?: string;
  onSelectElement: (id: string | null) => void;
  onAddElement: (
    type: string,
    x: number,
    y: number,
    shapeType?: string,
  ) => string;
  onAddPath: (path: PathPoint[], isClosed: boolean) => void;
  onUpdateElement: (id: string, updates: any) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  onPan?: (dx: number, dy: number) => void;
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
  onAddPath,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onPan,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Use tool-specific behaviors
  const { state, handlers, resetDrawing } = useCanvasTool(activeTool, {
    onAddElement: (type, x, y, shapeType) => {
      // Adjust for zoom and pan
      const adjustedX = x / zoom - panX;
      const adjustedY = y / zoom - panY;
      onAddElement(type, adjustedX, adjustedY, shapeType || activeShapeType);
    },
    onAddPath: onAddPath,
    onSelectElement,
    onUpdateElement,
    onPan: onPan || (() => {}),
  });

  // Canvas event handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handlers.onCanvasMouseDown(x, y, e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handlers.onCanvasMouseMove(x, y, e);
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handlers.onCanvasMouseUp(x, y, e);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handlers.onCanvasClick(x, y, e);

    // Deselect on empty canvas click for select tool
    if (activeTool === "select" && e.target === canvasRef.current) {
      onSelectElement(null);
    }
  };

  // Keyboard events for Pen (Enter/Escape to finish)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handlers.onCanvasKeyDown(e);
    };

    if (activeTool === "pen" || activeTool === "pencil") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [activeTool, handlers]);

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
        }}
      >
        {elements.length === 0 && state.pathPoints.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2">
              <div className="text-6xl opacity-20">📐</div>
              <p className="text-muted-foreground text-sm opacity-50">
                Select a tool and start creating
              </p>
            </div>
          </div>
        ) : (
          <>
            {elements.map((element) =>
              element.type === "path" &&
              element.properties &&
              "path" in element.properties ? (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: `${element.properties.x}px`,
                    top: `${element.properties.y}px`,
                    width: `${element.properties.width}px`,
                    height: `${element.properties.height}px`,
                    cursor: "grab",
                    outline:
                      selectedElementId === element.id
                        ? "2px solid #3b82f6"
                        : "none",
                  }}
                  onClick={() => onSelectElement(element.id)}
                >
                  <CanvasPath
                    path={(element.properties as any).path}
                    isSelected={selectedElementId === element.id}
                  />
                </div>
              ) : (
                <CanvasElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onSelect={() => onSelectElement(element.id)}
                  onUpdate={(updates) => onUpdateElement(element.id, updates)}
                  onDelete={() => onDeleteElement?.(element.id)}
                  onDuplicate={() => onDuplicateElement?.(element.id)}
                  zoom={zoom}
                />
              ),
            )}
          </>
        )}

        {/* Preview Rectangle (for shapes/frames being dragged) */}
        {state.previewRect && (
          <div
            style={{
              position: "absolute",
              left: `${state.previewRect.x}px`,
              top: `${state.previewRect.y}px`,
              width: `${state.previewRect.width}px`,
              height: `${state.previewRect.height}px`,
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              border: "2px solid #3b82f6",
              borderRadius:
                activeTool === "circle"
                  ? "50%"
                  : activeTool === "triangle" || activeTool === "polygon"
                    ? "0"
                    : "8px",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}

        {/* Path Preview (for pen/pencil) */}
        {(activeTool === "pen" || activeTool === "pencil") &&
          state.pathPoints.length > 0 && (
            <PathPreview
              points={state.pathPoints}
              currentPoint={
                state.pathPoints.length > 0
                  ? state.pathPoints[state.pathPoints.length - 1]
                  : undefined
              }
            />
          )}

        {/* Pen tool instructions */}
        {activeTool === "pen" && state.pathPoints.length > 0 && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm pointer-events-none"
            style={{ zIndex: 50 }}
          >
            Click to add points. Press Enter to finish, Escape to cancel.
          </div>
        )}
      </div>
    </div>
  );
}
