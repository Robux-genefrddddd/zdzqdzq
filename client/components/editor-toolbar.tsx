import { useState } from "react";
import {
  MousePointer2,
  Square,
  Circle,
  Triangle,
  Pen,
  Type,
  Hand,
  MessageCircle,
  Grid3x3,
  Play,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  Star,
  Minus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ToolType =
  | "select"
  | "frame"
  | "rectangle"
  | "circle"
  | "triangle"
  | "polygon"
  | "line"
  | "arrow"
  | "star"
  | "pen"
  | "text"
  | "hand"
  | "comment"
  | "resources"
  | "play";

interface EditorToolbarProps {
  activeTool?: string;
  onToolChange?: (tool: ToolType) => void;
  onZoom?: (direction: "in" | "out" | "fit" | "fill" | number) => void;
  zoomLevel?: number;
}

export function EditorToolbar({
  activeTool = "select",
  onToolChange,
  onZoom,
  zoomLevel = 100,
}: EditorToolbarProps) {
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showPenMenu, setShowPenMenu] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  // Tool button component
  const ToolButton = ({
    id,
    icon: Icon,
    label,
    shortcut,
    onClick,
    hasMenu,
  }: {
    id: string;
    icon: React.ElementType;
    label: string;
    shortcut?: string;
    onClick: () => void;
    hasMenu?: boolean;
  }) => {
    const isActive = activeTool === id;
    return (
      <button
        onClick={onClick}
        className={`relative flex items-center justify-center h-8 w-8 rounded transition-colors ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
        }`}
        title={shortcut ? `${label} (${shortcut})` : label}
        aria-label={label}
      >
        <Icon size={18} />
        {hasMenu && (
          <ChevronDown
            size={12}
            className="absolute bottom-0 right-0"
            style={{ backgroundColor: "inherit" }}
          />
        )}
      </button>
    );
  };

  const shapes = [
    { id: "rectangle", label: "Rectangle", icon: Rectangle, shortcut: "R" },
    { id: "line", label: "Line", icon: Minus, shortcut: "L" },
    { id: "arrow", label: "Arrow", icon: ArrowRight, shortcut: null },
    { id: "circle", label: "Ellipse", icon: Circle, shortcut: "O" },
    { id: "polygon", label: "Polygon", icon: Triangle, shortcut: null },
    { id: "star", label: "Star", icon: Star, shortcut: null },
  ];

  const penTools = [
    { id: "pen", label: "Pen", shortcut: "P" },
    { id: "pencil", label: "Pencil", shortcut: null },
  ];

  const zoomOptions = [
    { label: "Fit", value: "fit" },
    { label: "Fill", value: "fill" },
    { label: "50%", value: 50 },
    { label: "100%", value: 100 },
    { label: "200%", value: 200 },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      {/* Main toolbar container */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-2xl shadow-lg backdrop-blur-md">
        
        {/* GROUP 1: Selection & Frame */}
        <div className="flex items-center gap-1">
          <ToolButton
            id="select"
            icon={MousePointer2}
            label="Move"
            shortcut="V"
            onClick={() => onToolChange?.("select")}
          />
          <ToolButton
            id="frame"
            icon={Square}
            label="Frame"
            shortcut="F"
            onClick={() => onToolChange?.("frame")}
          />
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-border/50" />

        {/* GROUP 2: Shape tools with dropdown */}
        <DropdownMenu open={showShapeMenu} onOpenChange={setShowShapeMenu}>
          <div className="flex items-center gap-1">
            <DropdownMenuTrigger asChild>
              <button
                className={`relative flex items-center justify-center h-8 w-8 rounded transition-colors ${
                  activeTool?.includes("shape") ||
                  ["rectangle", "circle", "triangle", "polygon", "line", "arrow", "star"].includes(
                    activeTool || ""
                  )
                    ? "bg-blue-500 text-white"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                }`}
                title="Shape (U)"
                aria-label="Shape tools"
              >
                <Square size={18} />
                <ChevronDown size={12} className="absolute bottom-0 right-0" />
              </button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="center" side="top" className="w-40">
            <DropdownMenuLabel>Shapes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {shapes.map((shape) => (
              <DropdownMenuItem
                key={shape.id}
                onClick={() => {
                  onToolChange?.(shape.id as ToolType);
                  setShowShapeMenu(false);
                }}
                className={activeTool === shape.id ? "bg-blue-500/20" : ""}
              >
                <shape.icon size={16} className="mr-2" />
                <span>{shape.label}</span>
                {shape.shortcut && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {shape.shortcut}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Pen tool with dropdown */}
        <DropdownMenu open={showPenMenu} onOpenChange={setShowPenMenu}>
          <div className="flex items-center gap-1">
            <DropdownMenuTrigger asChild>
              <button
                className={`relative flex items-center justify-center h-8 w-8 rounded transition-colors ${
                  activeTool === "pen"
                    ? "bg-blue-500 text-white"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                }`}
                title="Pen (P)"
                aria-label="Pen tools"
              >
                <Pen size={18} />
                <ChevronDown size={12} className="absolute bottom-0 right-0" />
              </button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="center" side="top" className="w-40">
            <DropdownMenuLabel>Pen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {penTools.map((tool) => (
              <DropdownMenuItem
                key={tool.id}
                onClick={() => {
                  onToolChange?.(tool.id as ToolType);
                  setShowPenMenu(false);
                }}
                className={activeTool === tool.id ? "bg-blue-500/20" : ""}
              >
                <Pen size={16} className="mr-2" />
                <span>{tool.label}</span>
                {tool.shortcut && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {tool.shortcut}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Text tool */}
        <ToolButton
          id="text"
          icon={Type}
          label="Text"
          shortcut="T"
          onClick={() => onToolChange?.("text")}
        />

        {/* Separator */}
        <div className="w-px h-6 bg-border/50" />

        {/* GROUP 3: Secondary tools */}
        <ToolButton
          id="hand"
          icon={Hand}
          label="Hand"
          shortcut="Space"
          onClick={() => onToolChange?.("hand")}
        />

        <ToolButton
          id="comment"
          icon={MessageCircle}
          label="Comment"
          shortcut="C"
          onClick={() => onToolChange?.("comment")}
        />

        <ToolButton
          id="resources"
          icon={Grid3x3}
          label="Resources"
          shortcut="Shift+I"
          onClick={() => onToolChange?.("resources")}
        />

        <ToolButton
          id="play"
          icon={Play}
          label="Present"
          onClick={() => onToolChange?.("play")}
        />

        {/* Separator */}
        <div className="w-px h-6 bg-border/50" />

        {/* GROUP 4: Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onZoom?.("out")}
            className="flex items-center justify-center h-8 w-8 rounded text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>

          <DropdownMenu open={showZoomMenu} onOpenChange={setShowZoomMenu}>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1 h-8 px-2 rounded text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                title="Zoom"
                aria-label="Zoom menu"
              >
                {zoomLevel}%
                <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-40">
              <DropdownMenuLabel>Zoom</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {zoomOptions.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  onClick={() => {
                    onZoom?.(
                      typeof option.value === "number"
                        ? option.value
                        : option.value
                    );
                    setShowZoomMenu(false);
                  }}
                  className={
                    zoomLevel === option.value ? "bg-blue-500/20" : ""
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => onZoom?.("in")}
            className="flex items-center justify-center h-8 w-8 rounded text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
