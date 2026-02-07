import { Layer } from "@shared/types";
import { MessageCircle, Eye, Lock } from "lucide-react";
import { useState, useCallback } from "react";

interface EditorBottomPanelProps {
  selectedElement: Layer | undefined;
  elementsCount: number;
}

export function EditorBottomPanel({ selectedElement, elementsCount }: EditorBottomPanelProps) {
  const [showComments, setShowComments] = useState(false);
  const [elementComments, setElementComments] = useState<
    Record<string, Array<{ id: string; text: string; author: string; timestamp: Date }>>
  >({});
  const [newComment, setNewComment] = useState("");

  const currentElementId = selectedElement?.id;
  const currentComments = currentElementId ? (elementComments[currentElementId] || []) : [];

  // Prevent any event from reaching canvas
  const preventPropagation = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleCommentButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    preventPropagation(e);
    setShowComments((prev) => !prev);
  }, [preventPropagation]);

  const handleAddComment = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
      preventPropagation(e);
      
      if (!currentElementId || !newComment.trim()) return;

      setElementComments((prev) => ({
        ...prev,
        [currentElementId]: [
          ...(prev[currentElementId] || []),
          {
            id: `comment-${Date.now()}`,
            text: newComment,
            author: "You",
            timestamp: new Date(),
          },
        ],
      }));
      setNewComment("");
    },
    [currentElementId, newComment, preventPropagation]
  );

  const handleDeleteComment = useCallback(
    (commentId: string, e: React.MouseEvent<HTMLButtonElement>) => {
      preventPropagation(e);
      
      if (!currentElementId) return;

      setElementComments((prev) => ({
        ...prev,
        [currentElementId]: (prev[currentElementId] || []).filter(
          (c) => c.id !== commentId
        ),
      }));
    },
    [currentElementId, preventPropagation]
  );

  // No element selected - show basic info
  if (!selectedElement || !selectedElement.properties) {
    return (
      <div className="border-t border-border bg-background/50 px-6 py-3 text-xs text-muted-foreground flex items-center justify-between select-none">
        <span>{elementsCount} element{elementsCount !== 1 ? "s" : ""} on canvas</span>
        <span className="text-xs text-muted-foreground/60">No element selected • Press V to select</span>
      </div>
    );
  }

  const { properties } = selectedElement;
  const { x, y, width, height, style = {} } = properties;

  return (
    <div
      className="border-t border-border bg-background/50 select-none"
      onMouseDown={preventPropagation}
      onClick={preventPropagation}
    >
      {/* Main Status Row */}
      <div className="px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-8 flex-1">
          {/* Element Info */}
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Selected:</span>
            <span className="font-medium text-foreground">{selectedElement.name}</span>
            <span className="text-muted-foreground/70 text-xs">({selectedElement.type})</span>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border/30" />

          {/* Position & Size */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Position:</span>
              <span className="font-mono text-foreground">
                {Math.round(x)}, {Math.round(y)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-mono text-foreground">
                {Math.round(width)} × {Math.round(height)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border/30" />

          {/* Style Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Fill:</span>
              {style.fill ? (
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded border border-border"
                    style={{ backgroundColor: style.fill }}
                  />
                  <span className="font-mono text-foreground text-xs">{style.fill}</span>
                </div>
              ) : (
                <span className="text-muted-foreground/70 text-xs">None</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Opacity:</span>
              <span className="font-mono text-foreground">{Math.round((style.opacity ?? 1) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Right Side - Actions & Counter */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-px bg-border/30" />

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCommentButtonClick}
              className="p-1 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              title={`Comments (${currentComments.length})`}
              type="button"
            >
              <MessageCircle size={14} />
              {currentComments.length > 0 && (
                <span className="ml-1 text-xs text-foreground">{currentComments.length}</span>
              )}
            </button>
            <button
              className="p-1 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              title="Visibility"
              type="button"
              onClick={preventPropagation}
            >
              <Eye size={14} />
            </button>
            <button
              className="p-1 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              title="Lock"
              type="button"
              onClick={preventPropagation}
            >
              <Lock size={14} />
            </button>
          </div>

          <div className="h-4 w-px bg-border/30" />

          {/* Total Elements Counter */}
          <div className="text-muted-foreground text-xs">
            {elementsCount} layer{elementsCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Comments Section - Only show if toggled AND element is selected */}
      {showComments && currentElementId && (
        <div className="px-6 py-3 border-t border-border/50 bg-secondary/20 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              Comments ({currentComments.length})
            </span>
          </div>

          {/* Comments List */}
          {currentComments.length > 0 && (
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {currentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-2 p-2 bg-background rounded border border-border/50 text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{comment.author}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(comment.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-foreground/80 mt-1 break-words">{comment.text}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteComment(comment.id, e)}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 cursor-pointer"
                    title="Delete comment"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => {
                preventPropagation(e as any);
                setNewComment(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddComment(e);
                }
              }}
              className="flex-1 px-2 py-1 text-xs rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-muted-foreground/50 disabled:cursor-not-allowed transition-colors flex-shrink-0 cursor-pointer"
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
