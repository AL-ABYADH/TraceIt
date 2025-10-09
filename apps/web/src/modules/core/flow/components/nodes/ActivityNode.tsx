import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useMemo, useState } from "react";
import { ActivityShape } from "@/modules/features/activity-diagram/components/ActivityShape";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Changed import
import { route } from "nextjs-routes";
import { useParams, useRouter } from "next/navigation";

export default function ActivityNode({ data, selected }: NodeProps<any>) {
  const params = useParams<"/projects/[project-id]/activity-diagrams">();
  const projectId = params["project-id"];
  const router = useRouter();

  const name = data.name ?? "Activity was deleted";
  const isDeleted = !data.name;

  // hover state (controls handle visibility and overlay)
  const [hovered, setHovered] = useState(false);

  // Right-click context menu state
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuPosition(null);

  // Tighter padding for more compact activity text (keep in sync with ActivityShape usage)
  const PADDING_X = 16;
  const PADDING_Y = 10;

  const { svgWidth, svgHeight } = useMemo(() => {
    const maxWidth = 200;
    const minWidth = 120;
    const fontSize = 11;
    const lineHeight = 16;

    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - PADDING_X * 2) / avgCharWidth);
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));
    const textWidth = Math.min(name.length * avgCharWidth + PADDING_X * 2, maxWidth);
    const width = Math.max(minWidth, textWidth);
    const height = Math.max(52, lines * lineHeight + PADDING_Y * 2);

    return { svgWidth: width, svgHeight: height };
  }, [name]);

  // handles are visible only when hovered or node selected
  const handlesVisible = hovered || selected;

  // Styling geometry for handles (match DecisionNode approach so connectors snap to visible border)
  const HANDLE_SIZE = 12;
  const HANDLE_VIS_OFFSET = -6; // same value DecisionNode uses (-6 when visible), centers handle on border
  const HANDLE_STYLE_BASE: React.CSSProperties = {
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    background: "white",
    border: "2px solid #94a3b8",
    borderRadius: "50%",
    transition: "all 0.2s ease",
  };

  // whether to show the "Associated requirement has been updated" bubble
  const showRequirementBubble =
    (!!data.requirementDeleted || !!data?.requirementUpdated) && (hovered || selected);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: svgWidth,
          height: svgHeight,
          boxSizing: "content-box",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onContextMenu={handleContextMenu} // Added context menu handler
        data-id={data?.id ?? undefined}
        title={name}
      >
        {/* Requirement update bubble (appears on hover if data.requirementUpdated) */}
        {showRequirementBubble && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: -28, // raise above the activity
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none", // don't block pointer events
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                fontSize: 12,
                background: "rgba(0,0,0,0.75)",
                color: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                opacity: 1,
                transform: "translateY(0)",
                transition: "opacity 150ms ease, transform 150ms ease",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              Associated requirement has been {!data.requirement ? "deleted" : "updated"}
            </div>
          </div>
        )}

        {/* LEFT HANDLES */}
        <Handle
          type="target"
          position={Position.Left}
          id="left-target"
          style={{
            left: handlesVisible ? HANDLE_VIS_OFFSET : 0,
            top: svgHeight / 2,
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateY(-50%)",
            ...HANDLE_STYLE_BASE,
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left-source"
          style={{
            left: handlesVisible ? HANDLE_VIS_OFFSET : 0,
            top: svgHeight / 2,
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateY(-50%)",
            ...HANDLE_STYLE_BASE,
          }}
        />

        {/* RIGHT HANDLES */}
        <Handle
          type="target"
          position={Position.Right}
          id="right-target"
          style={{
            right: handlesVisible ? HANDLE_VIS_OFFSET : 0,
            top: svgHeight / 2,
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateY(-50%)",
            ...HANDLE_STYLE_BASE,
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          style={{
            right: handlesVisible ? HANDLE_VIS_OFFSET : 0,
            top: svgHeight / 2,
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateY(-50%)",
            ...HANDLE_STYLE_BASE,
          }}
        />

        {/* TOP HANDLES */}
        <Handle
          type="target"
          position={Position.Top}
          id="top-target"
          style={{
            top: handlesVisible ? HANDLE_VIS_OFFSET : 0,
            left: svgWidth / 2,
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateX(-50%)",
            ...HANDLE_STYLE_BASE,
          }}
        />
        <Handle
          type="source"
          position={Position.Top}
          id="top-source"
          style={{
            top: handlesVisible ? HANDLE_VIS_OFFSET : 0,
            left: svgWidth / 2,
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateX(-50%)",
            ...HANDLE_STYLE_BASE,
          }}
        />

        {/* BOTTOM HANDLES */}
        <Handle
          type="target"
          position={Position.Bottom}
          id="bottom-target"
          style={{
            bottom: handlesVisible ? HANDLE_VIS_OFFSET : 0,
            left: svgWidth / 2,
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateX(-50%)",
            ...HANDLE_STYLE_BASE,
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom-source"
          style={{
            bottom: handlesVisible ? HANDLE_VIS_OFFSET : 0,
            left: svgWidth / 2,
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateX(-50%)",
            ...HANDLE_STYLE_BASE,
          }}
        />

        <ActivityShape
        name={name}
        selected={selected}
        // width={svgWidth}
        // height={svgHeight}
        paddingX={PADDING_X}
        paddingY={PADDING_Y}
        isDeleted={isDeleted}
          strokeColor={
            data?.requirementDeleted ? "red" : data?.requirementUpdated ? "yellow" : undefined
          }
        />
      </div>

      {menuPosition && (
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
                    pathname: "/projects/[project-id]/requirements",
                    query: {
                      "project-id": projectId,
                      useCaseId: data.useCaseId,
                      requirementId: data.requirementId,
                    },
                  }),
                );
                closeMenu();
              }}
            >
              Navigate to Requirement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
