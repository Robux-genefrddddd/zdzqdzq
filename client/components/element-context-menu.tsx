import { useState, useRef, useEffect } from "react";
import { Copy, Trash2, Zap, Eye, Lock } from "lucide-react";
import { Layer } from "@shared/types";

interface ElementContextMenuProps {
  element: Layer;
  children: React.ReactNode;
  onDelete: () => void;
  onDuplicate?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onToggleVisibility?: () => void;
  onToggleLock?: () => void;
}

export function ElementContextMenu({
  element,
  children,
  onDelete,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onToggleVisibility,
  onToggleLock,
}: ElementContextMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = () => setShowMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  const handleMenuClick = (callback?: () => void) => {
    callback?.();
    setShowMenu(false);
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>

      {showMenu && (
        <div
          ref={menuRef}
          className="fixed bg-card border border-border rounded-lg shadow-lg py-1 z-[9999]"
          style={{
            left: `${menuPos.x}px`,
            top: `${menuPos.y}px`,
          }}
        >
          <div className="px-3 py-2 text-xs font-medium text-foreground border-b border-border">
            {element.name}
          </div>

          {onDuplicate && (
            <button
              onClick={() => handleMenuClick(onDuplicate)}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
          )}

          {onBringToFront && (
            <button
              onClick={() => handleMenuClick(onBringToFront)}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Bring to Front
            </button>
          )}

          {onSendToBack && (
            <button
              onClick={() => handleMenuClick(onSendToBack)}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
            >
              <Zap className="w-4 h-4 rotate-180" />
              Send to Back
            </button>
          )}

          {onToggleVisibility && (
            <button
              onClick={() => handleMenuClick(onToggleVisibility)}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Toggle Visibility
            </button>
          )}

          {onToggleLock && (
            <button
              onClick={() => handleMenuClick(onToggleLock)}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Lock/Unlock
            </button>
          )}

          <div className="border-t border-border" />

          <button
            onClick={() => handleMenuClick(onDelete)}
            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-secondary flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </>
  );
}
