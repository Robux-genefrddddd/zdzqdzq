import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Play, Menu, File } from "lucide-react";
import { useState, useCallback } from "react";
import { EditorLeftPanel } from "@/components/editor-left-panel";
import { EditorPropertiesPanel } from "@/components/editor-properties-panel";
import { EditorToolbar } from "@/components/editor-toolbar";
import { EditorBottomPanel } from "@/components/editor-bottom-panel";
import { Canvas } from "@/components/canvas";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { mockFiles, mockEditorFile } from "@shared/mock-data";
import type { Layer, PathPoint } from "@shared/types";

export default function Editor() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string>("select");
  const [previousTool, setPreviousTool] = useState<string>("select");
  const [activeShapeType, setActiveShapeType] = useState<string>("rectangle");
  const [history, setHistory] = useState<Layer[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Get file data
  const file = fileId ? mockFiles.find((f) => f.id === fileId) : undefined;
  const editorData = mockEditorFile;

  // Manage canvas state at parent level - start with empty canvas
  const [elements, setElements] = useState<Layer[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const handleSelectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  const handleAddElement = useCallback(
    (type: string, x: number, y: number, shapeType?: string) => {
      let displayType = type.charAt(0).toUpperCase() + type.slice(1);
      if (shapeType) {
        displayType = shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
      }

      // Default dimensions based on shape type
      let width = 200;
      let height = 120;
      let borderRadius = 8;

      if (shapeType === "circle") {
        width = 100;
        height = 100;
        borderRadius = 50;
      } else if (shapeType === "triangle") {
        width = 120;
        height = 120;
        borderRadius = 0;
      } else if (shapeType === "polygon") {
        width = 150;
        height = 150;
        borderRadius = 0;
      } else if (shapeType === "line") {
        width = 100;
        height = 2;
        borderRadius = 0;
      } else if (shapeType === "arrow") {
        width = 120;
        height = 40;
        borderRadius = 0;
      } else if (shapeType === "star") {
        width = 120;
        height = 120;
        borderRadius = 0;
      }

      const newElement: Layer = {
        id: `layer-${Date.now()}`,
        name: `${displayType} ${elements.length + 1}`,
        type: type as any,
        properties: {
          x,
          y,
          width,
          height,
          style: {
            fill: type === "text" ? null : "#6366f1",
            stroke: null,
            borderRadius,
            fontSize: type === "text" ? 14 : undefined,
            fontWeight: type === "text" ? "500" : undefined,
            opacity: 1,
          },
          shapeType: shapeType as any,
        },
      };

      setElements((prev) => {
        const newElements = [...prev, newElement];
        // Update history when element is added
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        return newElements;
      });
      setSelectedElementId(newElement.id);
      return newElement.id;
    },
    [elements.length, history, historyIndex],
  );

  const handleUpdateElement = useCallback((id: string, updates: any) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          const properties = el.properties || {
            x: 0,
            y: 0,
            width: 200,
            height: 120,
            style: {},
          };

          return {
            ...el,
            name: updates.name ?? el.name,
            properties: {
              ...properties,
              x: updates.x ?? properties.x,
              y: updates.y ?? properties.y,
              width: updates.width ?? properties.width,
              height: updates.height ?? properties.height,
              style: {
                ...properties.style,
                ...(updates.style || {}),
              },
              content: updates.content ?? properties.content,
            },
          };
        }
        return el;
      }),
    );
  }, []);

  const handleDeleteElement = useCallback(
    (id: string) => {
      setElements((prev) => {
        const newElements = prev.filter((el) => el.id !== id);
        // Update history when element is deleted
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        return newElements;
      });
      setSelectedElementId((current) => (current === id ? null : current));
    },
    [history, historyIndex],
  );

  const handleDuplicateElement = useCallback(
    (id: string) => {
      setElements((prev) => {
        const elementToDuplicate = prev.find((el) => el.id === id);
        if (!elementToDuplicate) return prev;

        const duplicated: Layer = {
          ...elementToDuplicate,
          id: `layer-${Date.now()}`,
          name: `${elementToDuplicate.name} copy`,
          properties: elementToDuplicate.properties
            ? {
                ...elementToDuplicate.properties,
                x: (elementToDuplicate.properties.x || 0) + 20,
                y: (elementToDuplicate.properties.y || 0) + 20,
              }
            : undefined,
        };

        const newElements = [...prev, duplicated];
        // Update history when element is duplicated
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        return newElements;
      });
    },
    [history, historyIndex],
  );

  const handleAddPath = useCallback(
    (points: PathPoint[], isClosed: boolean) => {
      const minX = Math.min(...points.map((p) => p.x));
      const minY = Math.min(...points.map((p) => p.y));
      const maxX = Math.max(...points.map((p) => p.x));
      const maxY = Math.max(...points.map((p) => p.y));

      const newElement: Layer = {
        id: `layer-${Date.now()}`,
        name: `Path ${elements.length + 1}`,
        type: "path",
        properties: {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          style: {
            fill: null,
            stroke: "#000000",
            strokeWidth: 2,
            opacity: 1,
          },
          path: {
            points: points.map((p) => ({ x: p.x - minX, y: p.y - minY })),
            closed: isClosed,
            stroke: "#000000",
            strokeWidth: 2,
          },
        },
      };

      setElements((prev) => {
        const newElements = [...prev, newElement];
        // Update history when path is added
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        return newElements;
      });
      setSelectedElementId(newElement.id);
    },
    [elements.length, history, historyIndex],
  );

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Update history when elements change (for undo/redo)
  const updateHistory = useCallback(
    (newElements: Layer[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex],
  );

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSelectTool: (tool: string) => {
      const shapeTypes = [
        "rectangle",
        "circle",
        "triangle",
        "polygon",
        "line",
        "arrow",
        "star",
      ];
      if (shapeTypes.includes(tool)) {
        setActiveShapeType(tool);
      }

      // Handle temporary hand tool
      if (tool === "hand") {
        // Hand tool only activates temporarily via Space
        return;
      }

      setPreviousTool(activeTool);
      setActiveTool(tool);
    },
    onDelete: () => {
      if (selectedElementId) {
        handleDeleteElement(selectedElementId);
      }
    },
    onSelectAll: () => {
      // Mock: show all elements as selected (in real implementation, would multiselect)
      if (elements.length > 0) {
        setSelectedElementId(elements[0].id);
      }
    },
    onDuplicate: () => {
      if (selectedElementId) {
        handleDuplicateElement(selectedElementId);
      }
    },
    onGroup: () => {
      // Mock: grouping not fully implemented
      console.log("Group action (not yet implemented)");
    },
    onUngroup: () => {
      // Mock: ungrouping not fully implemented
      console.log("Ungroup action (not yet implemented)");
    },
    onUndo: handleUndo,
    onRedo: handleRedo,
    onZoom: (action: string) => {
      if (action === "in") {
        setZoom((prev) => Math.min(prev * 1.2, 5));
      } else if (action === "out") {
        setZoom((prev) => Math.max(prev / 1.2, 0.1));
      } else if (action === "reset") {
        setZoom(1);
        setPanX(0);
        setPanY(0);
      } else if (action === "fit") {
        // Fit all elements in view
        setZoom(1);
        setPanX(0);
        setPanY(0);
      }
    },
    onTemporaryHandTool: (active: boolean) => {
      if (active) {
        setPreviousTool(activeTool);
        setActiveTool("hand");
      } else {
        // Return to previous tool
        setActiveTool(previousTool);
      }
    },
    onEscapeAction: () => {
      // Escape: deselect or cancel current action
      setSelectedElementId(null);
    },
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Left Toolbar - Vertical Icons */}
      <div className="w-14 border-r border-border bg-background flex flex-col items-center py-4 space-y-2">
        <button
          onClick={() => navigate("/recents")}
          className="p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-px bg-border" />
        <button
          className="p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="File"
        >
          <File className="w-5 h-5" />
        </button>
        <button
          className="p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Assets"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Left Panel */}
      <EditorLeftPanel
        fileName={editorData.title}
        pages={editorData.pages}
        layers={elements}
        selectedElementId={selectedElementId}
        onSelectElement={handleSelectElement}
      />

      {/* Canvas Center */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-border bg-background/80 backdrop-blur-sm px-6 flex items-center justify-between">
          {/* Left: File Name */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              defaultValue={editorData.title}
              className="text-lg font-light text-foreground bg-transparent border-0 focus:outline-none focus:ring-0 max-w-xs"
            />
            <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors">
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Avatar, Play, Share */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
              <Play className="w-4 h-4" />
              Play
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-foreground to-muted flex items-center justify-center text-background text-sm font-medium">
              A
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-auto flex flex-col">
          <Canvas
            elements={elements}
            selectedElementId={selectedElementId}
            zoom={zoom}
            panX={panX}
            panY={panY}
            activeTool={activeTool}
            activeShapeType={activeShapeType || activeTool}
            onSelectElement={handleSelectElement}
            onAddElement={handleAddElement}
            onAddPath={handleAddPath}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onPan={(dx, dy) => {
              setPanX((prev) => prev + dx);
              setPanY((prev) => prev + dy);
            }}
          />

          {/* Bottom Panel */}
          <EditorBottomPanel
            selectedElement={selectedElement}
            elementsCount={elements.length}
          />
        </div>

        {/* Floating Toolbar */}
        <EditorToolbar
          activeTool={activeTool}
          onToolChange={(tool) => {
            // If it's a shape type (rectangle, circle, etc.), set activeShapeType
            const shapeTypes = [
              "rectangle",
              "circle",
              "triangle",
              "polygon",
              "line",
              "arrow",
              "star",
            ];
            if (shapeTypes.includes(tool)) {
              setActiveShapeType(tool);
              setActiveTool(tool);
            } else {
              setActiveTool(tool);
            }
          }}
          onZoom={(direction) => {
            if (typeof direction === "number") {
              setZoom(direction / 100);
            } else if (direction === "in") {
              setZoom((prev) => Math.min(prev * 1.2, 5));
            } else if (direction === "out") {
              setZoom((prev) => Math.max(prev / 1.2, 0.1));
            }
            // fit/fill would need canvas calculation, skip for now
          }}
          zoomLevel={Math.round(zoom * 100)}
        />
      </div>

      {/* Right Panel - Properties */}
      <EditorPropertiesPanel
        selectedElement={selectedElement}
        onUpdate={(updates) => {
          if (selectedElement) {
            handleUpdateElement(selectedElement.id, updates);
          }
        }}
        onDelete={() => {
          if (selectedElement) {
            handleDeleteElement(selectedElement.id);
          }
        }}
      />
    </div>
  );
}
