import { Copy, Trash2, Zap, Eye, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  return (
    <DropdownMenu>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
      </div>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{element.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {onDuplicate && (
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
          )}
          {onBringToFront && (
            <DropdownMenuItem onClick={onBringToFront}>
              <Zap className="w-4 h-4 mr-2" />
              Bring to Front
            </DropdownMenuItem>
          )}
          {onSendToBack && (
            <DropdownMenuItem onClick={onSendToBack}>
              <Zap className="w-4 h-4 mr-2 rotate-180" />
              Send to Back
            </DropdownMenuItem>
          )}
          {onToggleVisibility && (
            <DropdownMenuItem onClick={onToggleVisibility}>
              <Eye className="w-4 h-4 mr-2" />
              Toggle Visibility
            </DropdownMenuItem>
          )}
          {onToggleLock && (
            <DropdownMenuItem onClick={onToggleLock}>
              <Lock className="w-4 h-4 mr-2" />
              Lock/Unlock
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onDelete} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
