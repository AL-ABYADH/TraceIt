"use client";

import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  danger?: boolean;
  hint?: string;
}

interface EllipsisMenuProps {
  actions: MenuAction[];
  className?: string;
}

export default function EllipsisMenu({ actions, className }: EllipsisMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <button
          type="button"
          title="Actions"
          aria-label="Actions"
          className="p-2 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-48 bg-card text-popover-foreground border border-border shadow-lg rounded-xl p-1"
      >
        {actions.map((action, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`cursor-pointer rounded-lg flex items-center gap-2 px-3 py-2 focus:bg-accent ${
              action.danger ? "text-destructive" : ""
            }`}
          >
            {action.icon && <span className="shrink-0">{action.icon}</span>}
            <span className="flex-1 text-sm">{action.label}</span>
            {action.hint && (
              <span className="text-xs text-muted-foreground ml-4">{action.hint}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
