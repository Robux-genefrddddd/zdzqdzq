import { useState } from "react";
import { ChevronDown, Trash2, Copy } from "lucide-react";
import { Layer } from "@shared/types";

interface EditorPropertiesPanelProps {
  selectedElement: Layer | undefined;
  onUpdate: (updates: any) => void;
  onDelete?: () => void;
}

export function EditorPropertiesPanel({
  selectedElement,
  onUpdate,
  onDelete,
}: EditorPropertiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<
    Set<string>
  >(new Set(["position", "appearance", "text"]));

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  if (!selectedElement || !selectedElement.properties) {
    return (
      <div className="w-72 border-l border-border bg-background flex flex-col h-screen">
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Select an element to edit properties
          </p>
        </div>
      </div>
    );
  }

  const { properties } = selectedElement;
  const { x, y, width, height, style = {} } = properties;

  const PropertySection = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-border">
      <button
        onClick={() => toggleSection(id)}
        className="flex items-center justify-between w-full p-3 hover:bg-secondary transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            expandedSections.has(id) ? "rotate-180" : ""
          }`}
        />
      </button>
      {expandedSections.has(id) && (
        <div className="px-3 pb-3 space-y-3 bg-secondary/30">{children}</div>
      )}
    </div>
  );

  const PropertyInput = ({
    label,
    value,
    onChange,
    suffix = "",
  }: {
    label: string;
    value: number | string;
    onChange: (value: any) => void;
    suffix?: string;
  }) => (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1 block">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          className="flex-1 px-2 py-1 rounded bg-background border border-border text-sm text-foreground"
        />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );

  const ColorInput = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value?: string;
    onChange: (value: string) => void;
  }) => (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1 block">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#6366f1"}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 rounded bg-background border border-border cursor-pointer"
        />
        <input
          type="text"
          value={value || "#6366f1"}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 rounded bg-background border border-border text-sm text-foreground font-mono"
        />
      </div>
    </div>
  );

  return (
    <div className="w-72 border-l border-border bg-background flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {selectedElement.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedElement.type}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onDelete}
              className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Position & Size */}
        <PropertySection title="Position & Size" id="position">
          <div className="grid grid-cols-2 gap-2">
            <PropertyInput
              label="X"
              value={x}
              onChange={(val) => onUpdate({ x: val })}
              suffix="px"
            />
            <PropertyInput
              label="Y"
              value={y}
              onChange={(val) => onUpdate({ y: val })}
              suffix="px"
            />
            <PropertyInput
              label="W"
              value={width}
              onChange={(val) => onUpdate({ width: val })}
              suffix="px"
            />
            <PropertyInput
              label="H"
              value={height}
              onChange={(val) => onUpdate({ height: val })}
              suffix="px"
            />
          </div>
        </PropertySection>

        {/* Appearance */}
        <PropertySection title="Appearance" id="appearance">
          <ColorInput
            label="Fill"
            value={style.fill}
            onChange={(val) => onUpdate({ style: { fill: val } })}
          />
          <ColorInput
            label="Stroke"
            value={style.stroke}
            onChange={(val) => onUpdate({ style: { stroke: val } })}
          />
          <PropertyInput
            label="Stroke Width"
            value={style.strokeWidth || 1}
            onChange={(val) =>
              onUpdate({ style: { strokeWidth: val } })
            }
            suffix="px"
          />
          <PropertyInput
            label="Radius"
            value={style.borderRadius || 0}
            onChange={(val) =>
              onUpdate({ style: { borderRadius: val } })
            }
            suffix="px"
          />
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1 block">
              Opacity
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={(style.opacity ?? 1) * 100}
              onChange={(e) =>
                onUpdate({
                  style: { opacity: parseFloat(e.target.value) / 100 },
                })
              }
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">
              {Math.round((style.opacity ?? 1) * 100)}%
            </span>
          </div>
        </PropertySection>

        {/* Text Properties */}
        {selectedElement.type === "text" && (
          <PropertySection title="Text" id="text">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1 block">
                Content
              </label>
              <textarea
                value={properties.content || ""}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className="w-full px-2 py-1 rounded bg-background border border-border text-sm text-foreground font-mono resize-none"
                rows={3}
              />
            </div>
            <PropertyInput
              label="Font Size"
              value={style.fontSize || 14}
              onChange={(val) => onUpdate({ style: { fontSize: val } })}
              suffix="px"
            />
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1 block">
                Font Weight
              </label>
              <select
                value={style.fontWeight || "400"}
                onChange={(e) =>
                  onUpdate({ style: { fontWeight: e.target.value } })
                }
                className="w-full px-2 py-1 rounded bg-background border border-border text-sm text-foreground"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1 block">
                Text Align
              </label>
              <select
                value={style.textAlign || "center"}
                onChange={(e) =>
                  onUpdate({ style: { textAlign: e.target.value } })
                }
                className="w-full px-2 py-1 rounded bg-background border border-border text-sm text-foreground"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <ColorInput
              label="Text Color"
              value={style.fill}
              onChange={(val) => onUpdate({ style: { fill: val } })}
            />
          </PropertySection>
        )}
      </div>
    </div>
  );
}
