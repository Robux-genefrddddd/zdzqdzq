import { useState, useCallback } from "react";
import { Layer, PathPoint } from "@shared/types";

export interface CanvasToolState {
  activeTool: string;
  isDrawing: boolean;
  pathPoints: PathPoint[];
  dragStart: { x: number; y: number } | null;
  previewRect: { x: number; y: number; width: number; height: number } | null;
}

export interface CanvasToolHandlers {
  // Canvas events
  onCanvasMouseDown: (x: number, y: number, e: React.MouseEvent) => void;
  onCanvasMouseMove: (x: number, y: number, e: React.MouseEvent) => void;
  onCanvasMouseUp: (x: number, y: number, e: React.MouseEvent) => void;
  onCanvasClick: (x: number, y: number, e: React.MouseEvent) => void;
  onCanvasKeyDown: (e: KeyboardEvent) => void;
  // Element interactions
  onElementMouseDown: (id: string, e: React.MouseEvent) => void;
}

interface ToolCallbacks {
  onAddElement: (
    type: string,
    x: number,
    y: number,
    shapeType?: string,
  ) => void;
  onAddPath: (path: PathPoint[], isClosed: boolean) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: any) => void;
  onPan: (dx: number, dy: number) => void;
}

export function useCanvasTool(activeTool: string, callbacks: ToolCallbacks) {
  const [state, setState] = useState<CanvasToolState>({
    activeTool,
    isDrawing: false,
    pathPoints: [],
    dragStart: null,
    previewRect: null,
  });

  const resetDrawing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pathPoints: [],
      isDrawing: false,
      dragStart: null,
      previewRect: null,
    }));
  }, []);

  const onCanvasMouseDown = useCallback(
    (x: number, y: number, e: React.MouseEvent) => {
      const target = e.target as HTMLElement;

      switch (activeTool) {
        case "pen":
        case "pencil":
          // Start path drawing
          setState((prev) => ({
            ...prev,
            isDrawing: true,
            pathPoints: [{ x, y }],
          }));
          break;

        case "rectangle":
        case "circle":
        case "triangle":
        case "polygon":
        case "line":
        case "arrow":
        case "star":
          // Shape: start drag
          if (target === e.currentTarget) {
            setState((prev) => ({
              ...prev,
              dragStart: { x, y },
              isDrawing: true,
            }));
          }
          break;

        case "frame":
          // Frame: start drag
          if (target === e.currentTarget) {
            setState((prev) => ({
              ...prev,
              dragStart: { x, y },
              isDrawing: true,
            }));
          }
          break;

        case "text":
          // Text: click creates text box or edit
          callbacks.onAddElement("text", x, y);
          break;

        case "hand":
          // Pan: start pan
          setState((prev) => ({
            ...prev,
            dragStart: { x, y },
            isDrawing: true,
          }));
          break;

        case "comment":
          // Comment: place pin immediately
          callbacks.onAddElement("comment", x, y);
          break;

        case "select":
        default:
          // Select: start drag for lasso selection
          if (target === e.currentTarget) {
            setState((prev) => ({
              ...prev,
              dragStart: { x, y },
              isDrawing: true,
            }));
          }
          break;
      }
    },
    [activeTool, callbacks],
  );

  const onCanvasMouseMove = useCallback(
    (x: number, y: number) => {
      if (!state.isDrawing || !state.dragStart) return;

      switch (activeTool) {
        case "pen":
          // Already drawing path via clicks
          break;

        case "pencil":
          // Continuous drawing while dragging - sample points for performance
          if (
            state.pathPoints.length === 0 ||
            Math.hypot(
              x - state.pathPoints[state.pathPoints.length - 1].x,
              y - state.pathPoints[state.pathPoints.length - 1].y,
            ) > 3
          ) {
            setState((prev) => ({
              ...prev,
              pathPoints: [...prev.pathPoints, { x, y }],
            }));
          }
          break;

        case "rectangle":
        case "circle":
        case "triangle":
        case "polygon":
        case "line":
        case "arrow":
        case "star":
        case "frame":
          // Shape/Frame: show preview
          const width = x - state.dragStart.x;
          const height = y - state.dragStart.y;
          setState((prev) => ({
            ...prev,
            previewRect: {
              x: width > 0 ? state.dragStart.x : x,
              y: height > 0 ? state.dragStart.y : y,
              width: Math.abs(width),
              height: Math.abs(height),
            },
          }));
          break;

        case "hand":
          // Pan: move canvas
          const dx = x - state.dragStart.x;
          const dy = y - state.dragStart.y;
          callbacks.onPan(dx, dy);
          setState((prev) => ({
            ...prev,
            dragStart: { x, y },
          }));
          break;

        case "select":
        default:
          // Lasso: show preview
          const w = x - state.dragStart.x;
          const h = y - state.dragStart.y;
          setState((prev) => ({
            ...prev,
            previewRect: {
              x: w > 0 ? state.dragStart.x : x,
              y: h > 0 ? state.dragStart.y : y,
              width: Math.abs(w),
              height: Math.abs(h),
            },
          }));
          break;
      }
    },
    [activeTool, state.isDrawing, state.dragStart, callbacks],
  );

  const onCanvasMouseUp = useCallback(
    (x: number, y: number) => {
      if (!state.dragStart) return;

      switch (activeTool) {
        case "rectangle":
        case "circle":
        case "triangle":
        case "polygon":
        case "line":
        case "arrow":
        case "star":
          // Shape: create if dragged enough
          if (
            state.previewRect &&
            (state.previewRect.width > 10 || state.previewRect.height > 10)
          ) {
            callbacks.onAddElement(
              activeTool,
              state.dragStart.x,
              state.dragStart.y,
              activeTool,
            );
          }
          resetDrawing();
          break;

        case "frame":
          // Frame: create if dragged
          if (
            state.previewRect &&
            (state.previewRect.width > 10 || state.previewRect.height > 10)
          ) {
            callbacks.onAddElement(
              "frame",
              state.dragStart.x,
              state.dragStart.y,
            );
          }
          resetDrawing();
          break;

        case "pencil":
          // Pencil: finish path
          if (state.pathPoints.length > 1) {
            callbacks.onAddPath(state.pathPoints, false);
          }
          resetDrawing();
          break;

        case "hand":
        case "select":
        default:
          resetDrawing();
          break;
      }
    },
    [
      activeTool,
      state.dragStart,
      state.previewRect,
      state.pathPoints,
      callbacks,
      resetDrawing,
    ],
  );

  const onCanvasClick = useCallback(
    (x: number, y: number) => {
      if (activeTool === "pen") {
        // Pen: add point on click
        setState((prev) => ({
          ...prev,
          pathPoints: [...prev.pathPoints, { x, y }],
          isDrawing: true,
        }));
      }
    },
    [activeTool],
  );

  const onCanvasKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeTool === "pen" || activeTool === "pencil") {
        if (e.key === "Enter" || e.key === "Escape") {
          // Finish path
          if (state.pathPoints.length > 1) {
            callbacks.onAddPath(state.pathPoints, e.key === "Enter");
          }
          resetDrawing();
          e.preventDefault();
        }
      }
    },
    [activeTool, state.pathPoints, callbacks, resetDrawing],
  );

  const onElementMouseDown = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (activeTool === "select") {
        callbacks.onSelectElement(id);
      }
    },
    [activeTool, callbacks],
  );

  return {
    state,
    handlers: {
      onCanvasMouseDown,
      onCanvasMouseMove,
      onCanvasMouseUp,
      onCanvasClick,
      onCanvasKeyDown,
      onElementMouseDown,
    },
    resetDrawing,
  };
}
