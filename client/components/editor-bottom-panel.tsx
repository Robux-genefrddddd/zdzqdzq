import { Layer } from "@shared/types";
import { MessageCircle, X } from "lucide-react";
import { useState, useCallback } from "react";

interface EditorBottomPanelProps {
  selectedElement: Layer | undefined;
  elementsCount: number;
}

export function EditorBottomPanel({
  selectedElement,
  elementsCount,
}: EditorBottomPanelProps) {
  const [showCommentBubble, setShowCommentBubble] = useState(false);
  const [elementComments, setElementComments] = useState<
    Record<string, string[]>
  >({});
  const [newComment, setNewComment] = useState("");

  const currentElementId = selectedElement?.id;
  const currentComments = currentElementId
    ? elementComments[currentElementId] || []
    : [];

  // Simply prevent event from going anywhere
  const stopEvent = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleAddComment = useCallback(() => {
    if (!currentElementId || !newComment.trim()) return;

    setElementComments((prev) => ({
      ...prev,
      [currentElementId]: [
        ...(prev[currentElementId] || []),
        newComment.trim(),
      ],
    }));
    setNewComment("");
  }, [currentElementId, newComment]);

  const handleDeleteComment = useCallback(
    (index: number) => {
      if (!currentElementId) return;

      setElementComments((prev) => ({
        ...prev,
        [currentElementId]: (prev[currentElementId] || []).filter(
          (_, i) => i !== index,
        ),
      }));
    },
    [currentElementId],
  );

  // No element selected
  if (!selectedElement || !selectedElement.properties) {
    return (
      <div className="border-t border-border bg-background/50 px-6 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>
          {elementsCount} element{elementsCount !== 1 ? "s" : ""}
        </span>
      </div>
    );
  }

  const { properties } = selectedElement;
  const { x, y, width, height, style = {} } = properties;

  return (
    <div className="border-t border-border bg-background/50 relative">
      {/* Simple Status Bar */}
      <div className="px-6 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Element name */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {selectedElement.name}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground/70">
              {selectedElement.type}
            </span>
          </div>

          {/* Position */}
          <span className="text-muted-foreground">
            {Math.round(x)}, {Math.round(y)}
          </span>

          {/* Size */}
          <span className="text-muted-foreground">
            {Math.round(width)} × {Math.round(height)}
          </span>

          {/* Fill */}
          {style.fill && (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded border border-border"
                style={{ backgroundColor: style.fill }}
              />
              <span className="text-muted-foreground text-xs">
                {style.fill}
              </span>
            </div>
          )}
        </div>

        {/* Right side - comment button */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              stopEvent(e);
              setShowCommentBubble(!showCommentBubble);
            }}
            onMouseDown={stopEvent}
            className="p-1 hover:bg-foreground/10 rounded transition-colors text-muted-foreground hover:text-foreground relative"
            title="Comments"
            type="button"
          >
            <MessageCircle size={14} />
            {currentComments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {currentComments.length}
              </span>
            )}
          </button>

          <span className="text-muted-foreground text-xs">
            {elementsCount} layer{elementsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Comment Bubble - Floating popup */}
      {showCommentBubble && currentElementId && (
        <div
          className="fixed bottom-16 right-6 w-80 bg-background border border-border rounded-lg shadow-xl z-50"
          onMouseDown={stopEvent}
          onClick={stopEvent}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-foreground" />
              <span className="text-sm font-medium text-foreground">
                Comments
              </span>
            </div>
            <button
              onClick={(e) => {
                stopEvent(e);
                setShowCommentBubble(false);
              }}
              onMouseDown={stopEvent}
              className="text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Comments List */}
          <div className="max-h-48 overflow-y-auto">
            {currentComments.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground text-center">
                No comments yet
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {currentComments.map((comment, index) => (
                  <div
                    key={index}
                    className="bg-secondary/50 rounded p-2 text-xs text-foreground flex items-start gap-2 group"
                  >
                    <span className="flex-1 break-words">{comment}</span>
                    <button
                      onClick={(e) => {
                        stopEvent(e);
                        handleDeleteComment(index);
                      }}
                      onMouseDown={stopEvent}
                      className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-3 space-y-2">
            <input
              type="text"
              placeholder="Add comment..."
              value={newComment}
              onChange={(e) => {
                stopEvent(e as any);
                setNewComment(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
              onMouseDown={stopEvent}
              className="w-full px-2 py-1 text-xs rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={(e) => {
                stopEvent(e);
                handleAddComment();
              }}
              onMouseDown={stopEvent}
              disabled={!newComment.trim()}
              className="w-full px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-muted-foreground/30 transition-colors"
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
