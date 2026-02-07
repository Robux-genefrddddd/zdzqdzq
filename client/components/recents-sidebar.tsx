import { Bell, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

export function RecentsSidebar() {
  return (
    <div className="w-64 border-r border-border bg-background flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-sm text-foreground">Personal</div>
          <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-9 h-9 text-sm bg-secondary border-0"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 border-b border-border">
        <nav className="space-y-1">
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground bg-secondary">
            Recents
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            Community
          </button>
        </nav>
      </div>

      {/* Team/Workspace */}
      <div className="p-3 border-b border-border">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
          Your teams
        </div>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors flex items-center justify-between">
          <span>Personal</span>
          <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">Free</span>
        </button>
      </div>

      {/* Menu Items */}
      <div className="p-3 border-b border-border flex-1">
        <div className="space-y-1">
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            Drafts
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            All projects
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            Resources
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            Trash
          </button>
        </div>
      </div>

      {/* Upgrade Promo */}
      <div className="p-3 border-b border-border">
        <div className="bg-secondary rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-foreground mb-1">Get more power</div>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock more features with our Pro plan
          </p>
          <button className="w-full px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity">
            Upgrade
          </button>
        </div>
      </div>

      {/* Starred */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-muted-foreground" />
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Starred
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center py-4">
          No starred files yet
        </div>
      </div>
    </div>
  );
}
