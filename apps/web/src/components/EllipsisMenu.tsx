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
}

interface EllipsisMenuProps {
  actions: MenuAction[];
  className?: string;
}

export default function EllipsisMenu({ actions, className }: EllipsisMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <button type="button" className="p-2 rounded-full hover:bg-muted transition-colors">
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-40 bg-card border border-border shadow-md"
      >
        {actions.map((action, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={action.onClick}
            disabled={action.disabled}
            className="cursor-pointer"
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
