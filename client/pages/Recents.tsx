import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, List, ChevronDown } from "lucide-react";
import { RecentsSidebar } from "@/components/recents-sidebar";
import { mockFiles, formatDate, mockOrganizations } from "@shared/mock-data";

export default function Recents() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [activeTab, setActiveTab] = useState<
    "recent" | "shared-files" | "shared-projects"
  >("recent");
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  const filteredFiles =
    selectedOrg === "all"
      ? mockFiles
      : mockFiles.filter((f) => f.organization === selectedOrg);

  const handleFileClick = (fileId: string) => {
    navigate(`/editor/${fileId}`);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <RecentsSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Create Banner */}
        <div className="border-b border-border bg-secondary/30 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-light text-foreground mb-4">
              Recents
            </h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Describe your idea and make it come to life..."
                className="flex-1 px-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              <button className="px-6 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                Make it
              </button>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="border-b border-border bg-background/50 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              {/* Tabs */}
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`text-sm pb-2 border-b-2 transition-colors ${
                    activeTab === "recent"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Recently viewed
                </button>
                <button
                  onClick={() => setActiveTab("shared-files")}
                  className={`text-sm pb-2 border-b-2 transition-colors ${
                    activeTab === "shared-files"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Shared files
                </button>
                <button
                  onClick={() => setActiveTab("shared-projects")}
                  className={`text-sm pb-2 border-b-2 transition-colors ${
                    activeTab === "shared-projects"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Shared projects
                </button>
              </div>

              {/* Filters & View Mode */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2"
                  >
                    Organization
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showOrgDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 rounded-lg bg-card border border-border shadow-soft z-10">
                      <div
                        onClick={() => {
                          setSelectedOrg("all");
                          setShowOrgDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-secondary cursor-pointer"
                      >
                        All Organizations
                      </div>
                      {mockOrganizations.map((org) => (
                        <div
                          key={org.id}
                          onClick={() => {
                            setSelectedOrg(org.name);
                            setShowOrgDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-secondary cursor-pointer"
                        >
                          {org.icon} {org.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-1 border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Layout className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleFileClick(file.id)}
                  className="group rounded-xl overflow-hidden border border-border hover:border-foreground bg-secondary hover:bg-secondary/80 transition-all duration-300 hover:shadow-soft-lg"
                >
                  {/* Thumbnail */}
                  <div
                    className="aspect-video flex items-center justify-center text-5xl group-hover:scale-105 transition-transform"
                    style={
                      file.preview?.type === "color"
                        ? { background: file.preview.content }
                        : {
                            background:
                              "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 100%)",
                          }
                    }
                  >
                    {!file.preview && file.thumbnail}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                      {file.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(file.lastEdited)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleFileClick(file.id)}
                  className="w-full p-4 rounded-lg border border-border hover:border-foreground bg-secondary hover:bg-secondary/80 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{file.thumbnail}</div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        {file.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {file.organization} • {formatDate(file.lastEdited)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground group-hover:bg-foreground/10">
                    {file.type === "file" ? "File" : "Project"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
