import { useRef, useState, useEffect } from "react";
import { Layer } from "@shared/types";
import { cn } from "@/lib/utils";
import { ElementContextMenu } from "./element-context-menu";

interface CanvasElementProps {
  element: Layer;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  zoom: number;
}

export function CanvasElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  zoom,
}: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  if (!element.properties) {
    return null;
  }

  const { x, y, width, height, style, content } = element.properties;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("resize-handle")) {
      return;
    }

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - x * zoom,
      y: e.clientY - y * zoom,
    });
    onSelect();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    handle: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width,
      height,
    });
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = (e.clientX - dragStart.x) / zoom;
        const newY = (e.clientY - dragStart.y) / zoom;
        onUpdate({ x: Math.round(newX), y: Math.round(newY) });
      } else if (isResizing) {
        const deltaX = (e.clientX - resizeStart.x) / zoom;
        const deltaY = (e.clientY - resizeStart.y) / zoom;
        const newWidth = Math.max(50, resizeStart.width + deltaX);
        const newHeight = Math.max(50, resizeStart.height + deltaY);
        onUpdate({ width: Math.round(newWidth), height: Math.round(newHeight) });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, onUpdate, zoom]);

  const borderRadius = style.borderRadius || 0;
  const backgroundColor = style.fill ? style.fill : "transparent";
  const opacity = style.opacity ?? 1;

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute select-none transition-shadow",
        isSelected && "shadow-lg",
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        opacity,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {/* Element Box */}
      <div
        className={cn(
          "w-full h-full transition-all",
          isSelected && "ring-2 ring-foreground ring-offset-2",
        )}
        style={{
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          border:
            style.stroke && style.stroke !== null
              ? `${style.strokeWidth || 1}px solid ${style.stroke}`
              : !style.fill && element.type !== "text"
              ? "2px dashed #9ca3af"
              : "none",
        }}
      >
        {/* Text Content */}
        {element.type === "text" && (
          <div
            className="w-full h-full flex items-center justify-center p-2 overflow-hidden"
            style={{
              fontSize: `${style.fontSize || 14}px`,
              fontWeight: style.fontWeight || "400",
              color: style.fill && style.fill !== null ? "#f3f4f6" : "#6b7280",
              textAlign: (style.textAlign as any) || "center",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {content || "Text"}
          </div>
        )}
      </div>

      {/* Selection Handles */}
      {isSelected && (
        <>
          {/* Resize Handles */}
          {[
            { pos: "nw", cursor: "nwse-resize", top: "-4px", left: "-4px" },
            { pos: "ne", cursor: "nesw-resize", top: "-4px", right: "-4px" },
            { pos: "sw", cursor: "nesw-resize", bottom: "-4px", left: "-4px" },
            { pos: "se", cursor: "nwse-resize", bottom: "-4px", right: "-4px" },
          ].map((handle) => (
            <div
              key={handle.pos}
              className="resize-handle absolute w-2 h-2 bg-foreground rounded-full"
              style={{
                ...(handle.top && { top: handle.top }),
                ...(handle.bottom && { bottom: handle.bottom }),
                ...(handle.left && { left: handle.left }),
                ...(handle.right && { right: handle.right }),
                cursor: handle.cursor,
              }}
              onMouseDown={(e) => handleResizeStart(e, handle.pos)}
            />
          ))}

          {/* Edge Resize Handles */}
          {[
            { pos: "n", cursor: "ns-resize", top: "-4px", left: "50%", translate: "-50% 0" },
            { pos: "s", cursor: "ns-resize", bottom: "-4px", left: "50%", translate: "-50% 0" },
            { pos: "e", cursor: "ew-resize", right: "-4px", top: "50%", translate: "0 -50%" },
            { pos: "w", cursor: "ew-resize", left: "-4px", top: "50%", translate: "0 -50%" },
          ].map((handle) => (
            <div
              key={handle.pos}
              className="resize-handle absolute w-2 h-2 bg-foreground rounded-full"
              style={{
                ...(handle.top && { top: handle.top }),
                ...(handle.bottom && { bottom: handle.bottom }),
                ...(handle.left && { left: handle.left }),
                ...(handle.right && { right: handle.right }),
                ...(handle.translate && { transform: handle.translate }),
                cursor: handle.cursor,
              }}
              onMouseDown={(e) => handleResizeStart(e, handle.pos)}
            />
          ))}
        </>
      )}
    </div>
  );
}
