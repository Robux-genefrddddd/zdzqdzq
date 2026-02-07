import * as React from "react";
import { ChevronRight, File, Folder, Edit2, LogOut } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onEditProfile?: () => void;
  userName: string;
  userUsername: string;
}

// This is sample data.
const data = {
  changes: [
    {
      file: "homepage.tsx",
      state: "M",
    },
    {
      file: "components/ui/button.tsx",
      state: "U",
    },
    {
      file: "global.css",
      state: "M",
    },
  ],
  tree: [
    [
      "client",
      [
        "pages",
        ["Index.tsx", "NotFound.tsx"],
        [
          "components",
          ["ui", "button.tsx", "dialog.tsx", "sidebar.tsx"],
          "app-sidebar.tsx",
        ],
        ["lib", "utils.ts"],
        "global.css",
        "App.tsx",
      ],
    ],
    [
      "server",
      ["routes", "demo.ts"],
      "index.ts",
    ],
    [
      "shared",
      "api.ts",
    ],
    "package.json",
    "tailwind.config.ts",
    "vite.config.ts",
  ],
};

export function AppSidebar({
  onEditProfile,
  userName,
  userUsername,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar {...props} className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Changes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.changes.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton className="text-xs">
                    <File className="h-4 w-4" />
                    <span>{item.file}</span>
                  </SidebarMenuButton>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {item.state}
                  </span>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Project Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.tree.map((item, index) => (
                <Tree key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="border-t border-border px-0 py-4">
        <div className="px-4 space-y-3">
          <button
            onClick={onEditProfile}
            className="w-full group"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-foreground to-muted flex items-center justify-center text-background font-medium text-sm flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium leading-tight text-foreground">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {userUsername}
                </p>
              </div>
              <Edit2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

type TreeItem = string | TreeItem[];

function Tree({ item }: { item: TreeItem }) {
  const [name, ...items] = Array.isArray(item) ? item : [item];

  if (!items.length) {
    return (
      <SidebarMenuButton
        isActive={name === "Index.tsx"}
        className="data-[active=true]:bg-secondary"
        asChild
      >
        <button className="text-xs">
          <File className="h-4 w-4" />
          {name}
        </button>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === "client" || name === "components"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="text-xs">
            <ChevronRight className="transition-transform" />
            <Folder className="h-4 w-4" />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
