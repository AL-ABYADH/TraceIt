"use client";

import React, { useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import ActorShape from "@/modules/features/use-case-diagram/components/ActorShape";
import { useParams, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { route } from "nextjs-routes";

export default function ActorNode({ data, selected }: NodeProps<any>) {
  const name = data.name ?? "Actor was deleted";
  const isDeleted = !data.name;

  const params = useParams<"/projects/[project-id]/use-case-diagram">();
  const projectId = params["project-id"];
  const router = useRouter();

  // hover state for handles
  const [hovered, setHovered] = useState(false);
  const handlesVisible = hovered || selected;

  // Right-click context menu
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };
  const closeMenu = () => setMenuPosition(null);

  const transition = "opacity 180ms ease, transform 180ms cubic-bezier(.2,.8,.2,1)";
  const handleTop = 32;

  return (
    <>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          boxSizing: "content-box",
          userSelect: "none",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))",
          paddingTop: 0,
        }}
        data-id={data?.name ?? undefined}
        title={name}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onContextMenu={handleContextMenu}
      >
        {/* Left handles */}
        <Handle
          type="target"
          position={Position.Left}
          id="left-actor-target"
          style={{
            left: 2,
            top: handleTop,
            background: "white",
            border: "none",
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: handlesVisible ? "translateX(-8px)" : "translateX(0)",
            transition,
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left-actor-source"
          style={{
            left: 2,
            top: handleTop,
            background: "white",
            border: "none",
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: handlesVisible ? "translateX(-8px)" : "translateX(0)",
            transition,
          }}
        />

        {/* Right handles */}
        <Handle
          type="target"
          position={Position.Right}
          id="right-actor-target"
          style={{
            right: 2,
            top: handleTop,
            background: "white",
            border: "none",
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: handlesVisible ? "translateX(8px)" : "translateX(0)",
            transition,
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right-actor-source"
          style={{
            right: 2,
            top: handleTop,
            background: "white",
            border: "none",
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: handlesVisible ? "translateX(8px)" : "translateX(0)",
            transition,
          }}
        />

        <ActorShape name={name} selected={selected} isDeleted={isDeleted} />
      </div>

      {/* Context Menu */}
      {menuPosition && !isDeleted && (
        <DropdownMenu open onOpenChange={(open) => !open && closeMenu()}>
          <DropdownMenuContent
            sideOffset={0}
            className="min-w-48 bg-card text-popover-foreground border border-border shadow-lg rounded-xl p-1"
            style={{ position: "fixed", top: menuPosition.y, left: menuPosition.x }}
          >
            <DropdownMenuItem
              onSelect={() => {
                router.push(
                  route({
                    pathname: "/projects/[project-id]/actors",
                    query: {
                      "project-id": projectId,
                      actorId: data.id,
                    },
                  }),
                );
                closeMenu();
              }}
            >
              Navigate to Actor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
