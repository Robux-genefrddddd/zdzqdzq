import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Play, Menu, File } from "lucide-react";
import { useState, useCallback } from "react";
import { EditorLeftPanel } from "@/components/editor-left-panel";
import { EditorPropertiesPanel } from "@/components/editor-properties-panel";
import { EditorToolbar } from "@/components/editor-toolbar";
import { Canvas } from "@/components/canvas";
import { mockFiles, mockEditorFile } from "@shared/mock-data";
import type { Layer } from "@shared/types";

export default function Editor() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string>("select");

  // Get file data
  const file = fileId ? mockFiles.find((f) => f.id === fileId) : undefined;
  const editorData = mockEditorFile;

  // Manage canvas state at parent level
  const [elements, setElements] = useState<Layer[]>(editorData.pages[0]?.layers || []);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const handleSelectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  const handleAddElement = useCallback(
    (type: string, x: number, y: number) => {
      const newElement: Layer = {
        id: `layer-${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${elements.length + 1}`,
        type: type as any,
        properties: {
          x,
          y,
          width: 200,
          height: 120,
          style: {
            fill: undefined,
            stroke: undefined,
            borderRadius: 8,
            fontSize: type === "text" ? 14 : undefined,
            fontWeight: type === "text" ? "500" : undefined,
          },
        },
      };

      setElements((prev) => [...prev, newElement]);
      setSelectedElementId(newElement.id);
      return newElement.id;
    },
    [elements.length],
  );

  const handleUpdateElement = useCallback(
    (id: string, updates: any) => {
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
    },
    [],
  );

  const handleDeleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElementId((current) => (current === id ? null : current));
  }, []);

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
        layers={editorData.pages[0]?.layers || []}
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
        <div className="flex-1 relative overflow-auto">
          <Canvas
            elements={elements}
            selectedElementId={selectedElementId}
            zoom={zoom}
            panX={panX}
            panY={panY}
            activeTool={activeTool}
            onSelectElement={handleSelectElement}
            onAddElement={handleAddElement}
            onUpdateElement={handleUpdateElement}
          />
        </div>

        {/* Floating Toolbar */}
        <EditorToolbar activeTool={activeTool} onToolChange={setActiveTool} />
      </div>

      {/* Right Panel - Properties */}
      <EditorPropertiesPanel
        selectedElement={selectedElement}
        onUpdate={(updates) => {
          if (selectedElement) {
            canvasState.updateElement(selectedElement.id, updates);
          }
        }}
        onDelete={() => {
          if (selectedElement) {
            canvasState.deleteElement(selectedElement.id);
          }
        }}
      />
    </div>
  );
}
