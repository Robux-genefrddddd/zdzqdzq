import { Layer } from "@shared/types";
import { X } from "lucide-react";

interface EditorBottomPanelProps {
  selectedElement: Layer | undefined;
  elementsCount: number;
}

export function EditorBottomPanel({ selectedElement, elementsCount }: EditorBottomPanelProps) {
  if (!selectedElement || !selectedElement.properties) {
    return (
      <div className="border-t border-border bg-background/50 px-6 py-3 text-xs text-muted-foreground">
        <span>{elementsCount} element{elementsCount !== 1 ? "s" : ""} on canvas</span>
      </div>
    );
  }

  const { properties } = selectedElement;
  const { x, y, width, height, style = {} } = properties;

  return (
    <div className="border-t border-border bg-background/50">
      <div className="px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Selected:</span>
            <span className="font-medium text-foreground">{selectedElement.name}</span>
            <span className="text-muted-foreground">({selectedElement.type})</span>
          </div>

          <div className="flex items-center gap-6 border-l border-border pl-8">
            {/* Position */}
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Position:</span>
              <span className="font-mono">
                X: {Math.round(x)}, Y: {Math.round(y)}
              </span>
            </div>

            {/* Size */}
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-mono">
                {Math.round(width)} × {Math.round(height)}
              </span>
            </div>

            {/* Style Info */}
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Fill:</span>
              <div className="flex items-center gap-2">
                {style.fill ? (
                  <>
                    <div
                      className="w-3 h-3 rounded border border-border"
                      style={{ backgroundColor: style.fill }}
                    />
                    <span className="font-mono">{style.fill}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </div>
            </div>

            {/* Opacity */}
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Opacity:</span>
              <span className="font-mono">{Math.round((style.opacity ?? 1) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground">
          {elementsCount} total element{elementsCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
