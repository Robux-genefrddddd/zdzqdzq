import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Pen,
  Image,
  Hand,
  Zap,
  Triangle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
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
  | "shape"
  | "text"
  | "pen"
  | "image"
  | "hand"
  | "component";

interface EditorToolbarProps {
  activeTool?: string;
  onToolChange?: (tool: ToolType) => void;
}

export function EditorToolbar({ activeTool = "select", onToolChange }: EditorToolbarProps) {
  const [showShapes, setShowShapes] = useState(false);

  const shapes = [
    { id: "rectangle", label: "Rectangle", icon: "▭" },
    { id: "circle", label: "Circle", icon: "●" },
    { id: "triangle", label: "Triangle", icon: "▲" },
    { id: "polygon", label: "Polygon", icon: "⬡" },
    { id: "line", label: "Line", icon: "—" },
  ];

  const tools: Array<{
    id: ToolType;
    label: string;
    icon: React.ReactNode;
    shortcut?: string;
  }> = [
    {
      id: "select",
      label: "Select",
      icon: <MousePointer2 className="w-5 h-5" />,
      shortcut: "S",
    },
    {
      id: "frame",
      label: "Frame",
      icon: <Square className="w-5 h-5" />,
      shortcut: "F",
    },
    {
      id: "shape",
      label: "Shape",
      icon: <Circle className="w-5 h-5" />,
      shortcut: "U",
    },
    {
      id: "text",
      label: "Text",
      icon: <Type className="w-5 h-5" />,
      shortcut: "T",
    },
    {
      id: "pen",
      label: "Pen",
      icon: <Pen className="w-5 h-5" />,
      shortcut: "P",
    },
    {
      id: "image",
      label: "Image",
      icon: <Image className="w-5 h-5" />,
      shortcut: "I",
    },
    {
      id: "hand",
      label: "Hand",
      icon: <Hand className="w-5 h-5" />,
      shortcut: "H",
    },
    {
      id: "component",
      label: "Component",
      icon: <Zap className="w-5 h-5" />,
      shortcut: "C",
    },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border shadow-soft-lg backdrop-blur-md">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange?.(tool.id)}
            className={`relative group p-2.5 rounded-lg transition-all duration-200 ${
              activeTool === tool.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            title={`${tool.label} ${tool.shortcut ? `(${tool.shortcut})` : ""}`}
          >
            {tool.icon}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs text-background bg-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {tool.label}
            </div>
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Zoom Controls */}
        <button className="text-muted-foreground hover:text-foreground hover:bg-secondary p-2.5 rounded-lg transition-colors text-sm">
          100%
        </button>
      </div>
    </div>
  );
}
