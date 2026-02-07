import {
  Plus,
  ChevronDown,
  File,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import { Layer } from "@shared/types";

interface EditorLeftPanelProps {
  fileName: string;
  pages: Array<{ id: string; name: string }>;
  layers: Layer[];
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
}

export function EditorLeftPanel({
  fileName,
  pages,
  layers,
  selectedElementId,
  onSelectElement,
}: EditorLeftPanelProps) {
  const [activeTab, setActiveTab] = useState<"layers" | "assets">("layers");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(
    new Set(pages.map((p) => p.id)),
  );
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(layers.map((l) => l.id)),
  );
  const [lockedLayers, setLockedLayers] = useState<Set<string>>(new Set());

  return (
    <div className="w-72 border-r border-border bg-background flex flex-col h-screen editor-left-panel">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <File className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {fileName}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground ml-auto">
            Drafts
          </span>
        </div>
        <div className="text-xs text-muted-foreground">Free</div>
      </div>

      {/* Pages Section */}
      <div className="p-4 border-b border-border flex-1 overflow-auto">
        <div className="space-y-4">
          {/* Pages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Pages
              </span>
              <button className="p-1 hover:bg-secondary rounded transition-colors">
                <Plus className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="space-y-1">
              {pages.map((page) => (
                <div key={page.id}>
                  <button className="w-full text-left px-2 py-1.5 rounded text-sm text-foreground hover:bg-secondary transition-colors flex items-center justify-between group">
                    <span>{page.name}</span>
                    <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Layers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Layers ({layers.length})
              </span>
            </div>
            {layers.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-4">
                No elements yet
              </div>
            ) : (
              <div className="space-y-1">
                {layers.map((layer) => {
                  const isVisible = visibleLayers.has(layer.id);
                  const isLocked = lockedLayers.has(layer.id);
                  const isSelected = selectedElementId === layer.id;

                  return (
                    <div
                      key={layer.id}
                      className={`group flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                      onClick={() => onSelectElement?.(layer.id)}
                    >
                      <Layers className="w-3 h-3 flex-shrink-0" />
                      <span className="flex-1 truncate">{layer.name}</span>

                      {/* Visibility Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newVisibleLayers = new Set(visibleLayers);
                          if (newVisibleLayers.has(layer.id)) {
                            newVisibleLayers.delete(layer.id);
                          } else {
                            newVisibleLayers.add(layer.id);
                          }
                          setVisibleLayers(newVisibleLayers);
                        }}
                        className="p-1 rounded hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                        title={isVisible ? "Hide" : "Show"}
                      >
                        {isVisible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3 opacity-50" />
                        )}
                      </button>

                      {/* Lock Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newLockedLayers = new Set(lockedLayers);
                          if (newLockedLayers.has(layer.id)) {
                            newLockedLayers.delete(layer.id);
                          } else {
                            newLockedLayers.add(layer.id);
                          }
                          setLockedLayers(newLockedLayers);
                        }}
                        className="p-1 rounded hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                        title={isLocked ? "Unlock" : "Lock"}
                      >
                        {isLocked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Unlock className="w-3 h-3 opacity-50" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
