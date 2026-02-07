import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Play, Menu, File } from "lucide-react";
import { EditorLeftPanel } from "@/components/editor-left-panel";
import { EditorRightPanel } from "@/components/editor-right-panel";
import { EditorToolbar } from "@/components/editor-toolbar";
import { mockFiles, mockEditorFile } from "@shared/mock-data";

export default function Editor() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  // Get file data
  const file = fileId ? mockFiles.find(f => f.id === fileId) : undefined;
  const editorData = mockEditorFile;

  return (
    <div className="flex h-screen bg-background">
      {/* Left Toolbar - Vertical Icons */}
      <div className="w-14 border-r border-border bg-background flex flex-col items-center py-4 space-y-2">
        <button
          onClick={() => navigate("/recents")}
          className="p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-px bg-border" />
        <button className="p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="File">
          <File className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Assets">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Left Panel */}
      <EditorLeftPanel
        fileName={editorData.title}
        pages={editorData.pages}
        layers={editorData.pages[0]?.layers || []}
      />

      {/* Canvas Center */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-border bg-background/80 backdrop-blur-sm px-6 flex items-center justify-between">
          {/* Left: File Name */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              defaultValue={editorData.title}
              className="text-lg font-light text-foreground bg-transparent border-0 focus:outline-none focus:ring-0 max-w-xs"
            />
            <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors">
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Avatar, Play, Share */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
              <Play className="w-4 h-4" />
              Play
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-foreground to-muted flex items-center justify-center text-background text-sm font-medium">
              A
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-auto flex items-center justify-center">
          {/* Canvas with subtle grid */}
          <div className="w-full h-full relative" style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.02) 25%, rgba(255, 255, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.02) 75%, rgba(255, 255, 255, 0.02) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.02) 25%, rgba(255, 255, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.02) 75%, rgba(255, 255, 255, 0.02) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}>
            {/* Drop Zone */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2">
                <div className="text-6xl opacity-20">📐</div>
                <p className="text-muted-foreground text-sm opacity-50">
                  Drag elements here to start designing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Toolbar */}
        <EditorToolbar />
      </div>

      {/* Right Panel */}
      <EditorRightPanel />
    </div>
  );
}
