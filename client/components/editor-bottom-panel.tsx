import { Layer } from "@shared/types";
import { MessageCircle, Eye, Lock } from "lucide-react";
import { useState, useCallback } from "react";

interface EditorBottomPanelProps {
  selectedElement: Layer | undefined;
  elementsCount: number;
}

export function EditorBottomPanel({ selectedElement, elementsCount }: EditorBottomPanelProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; text: string; author: string; timestamp: Date }>>([]);
  const [newComment, setNewComment] = useState("");

  const handleToggleComments = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setShowComments(!showComments);
    },
    [showComments]
  );

  const handleAddComment = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (newComment.trim() && selectedElement) {
        setComments([
          ...comments,
          {
            id: `comment-${Date.now()}`,
            text: newComment,
            author: "You",
            timestamp: new Date(),
          },
        ]);
        setNewComment("");
      }
    },
    [newComment, selectedElement, comments]
  );

  const handleDeleteComment = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setComments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Default view when nothing selected
  if (!selectedElement || !selectedElement.properties) {
    return (
      <div className="border-t border-border bg-background/50 px-6 py-3 text-xs text-muted-foreground flex items-center justify-between">
        <span>{elementsCount} element{elementsCount !== 1 ? "s" : ""} on canvas</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground/60">No element selected • Press V to select</span>
        </div>
      </div>
    );
  }

  const { properties } = selectedElement;
  const { x, y, width, height, style = {} } = properties;

  return (
    <div className="border-t border-border bg-background/50">
      {/* Main Status Row */}
      <div className="px-6 py-3 flex items-center justify-between text-xs border-b border-border/50">
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
              onClick={handleToggleComments}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-1 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground pointer-events-auto"
              title={`Comments (${comments.length})`}
              type="button"
            >
              <MessageCircle size={14} />
              {comments.length > 0 && (
                <span className="ml-1 text-xs text-foreground">{comments.length}</span>
              )}
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-1 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground pointer-events-auto"
              title="Visibility"
              type="button"
            >
              <Eye size={14} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-1 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground pointer-events-auto"
              title="Lock"
              type="button"
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

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 py-3 border-t border-border/50 bg-secondary/20 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">Comments ({comments.length})</span>
          </div>

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {comments.map((comment) => (
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
                    <p className="text-foreground/80 mt-1">{comment.text}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Delete comment"
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
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
              className="flex-1 px-2 py-1 text-xs rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-muted-foreground/50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
