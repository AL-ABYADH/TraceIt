import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useMemo, useState, useRef, useEffect } from "react";
import { ActivityShape } from "@/modules/features/activity-diagram/components/ActivityShape";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { route } from "nextjs-routes";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUpdateRequirementStale } from "@/modules/features/requirement/hooks/useUpdateRequirementStale";
import { useUpdateRequirementLabels } from "@/modules/features/requirement/hooks/useUpdateRequirementLabels"; // Updated import

export default function ActivityNode({ data, selected }: NodeProps<any>) {
  const params = useParams<"/projects/[project-id]/activity-diagrams">();
  const projectId = params["project-id"];
  const searchParams = useSearchParams();
  const useCaseId = searchParams.get("useCaseId");
  const router = useRouter();

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Get name from requirement data - use activityLabel if available, otherwise operation
  const name = data?.activityLabel || data?.operation || "Activity was deleted";
  const isDeleted = !data?.operation; // Check if the requirement operation exists
  const isStale = data?.isActivityStale; // Check if the requirement has been updated

  // hover state (controls handle visibility and overlay)
  const [hovered, setHovered] = useState(false);

  // Right-click context menu state
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  // Use the update stale hook
  const updateStaleMutation = useUpdateRequirementStale(data?.id, data?.useCaseId, {
    onSuccess: () => {
      console.log("Requirement stale status updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update requirement stale status:", error);
    },
  });

  // Use the update requirement LABELS hook for activity label
  const updateRequirementLabelsMutation = useUpdateRequirementLabels(data?.id, data?.useCaseId, {
    onSuccess: () => {
      console.log("Activity label updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Failed to update activity label:", error);
      // Revert to original name on error
      setEditedLabel(name);
    },
  });

  // Initialize edited label when name changes or editing starts
  useEffect(() => {
    if (isEditing) {
      setEditedLabel(name);
    }
  }, [isEditing, name]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuPosition(null);

  const handleResolveStale = () => {
    if (data?.id) {
      updateStaleMutation.mutate({
        isActivityStale: false, // Set to false to resolve the stale status
      });
    }
    closeMenu();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleted) {
      setIsEditing(true);
    }
  };

  const handleLabelSave = () => {
    if (editedLabel.trim() && editedLabel !== name) {
      updateRequirementLabelsMutation.mutate({
        activityLabel: editedLabel.trim(),
      });
    } else {
      // If no changes or empty, just cancel editing
      setEditedLabel(name);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLabelSave();
    } else if (e.key === "Escape") {
      setEditedLabel(name);
      setIsEditing(false);
    }
  };

  const handleInputBlur = () => {
    handleLabelSave();
  };

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
  const showRequirementBubble = isStale && (hovered || selected);

  // If editing, show input field
  if (isEditing && !isDeleted) {
    return (
      <div
        style={{
          position: "relative",
          width: svgWidth,
          height: svgHeight,
          boxSizing: "content-box",
        }}
      >
        <ActivityShape
          name="" // Empty name since we're showing input
          selected={selected}
          width={svgWidth}
          height={svgHeight}
          paddingX={PADDING_X}
          paddingY={PADDING_Y}
          isDeleted={false}
          isUpdated={false}
        />
        <input
          ref={inputRef}
          type="text"
          value={editedLabel}
          onChange={(e) => setEditedLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          disabled={updateRequirementLabelsMutation.isPending}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `calc(100% - ${PADDING_X * 2}px)`,
            background: "transparent",
            border: "none",
            outline: "none",
            textAlign: "center",
            fontSize: "11px",
            fontFamily: "inherit",
            color: "inherit",
            zIndex: 10,
          }}
          placeholder="Enter activity label..."
        />
        {updateRequirementLabelsMutation.isPending && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "10px",
              color: "#666",
              marginTop: "4px",
            }}
          >
            Saving...
          </div>
        )}
      </div>
    );
  }

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
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        data-id={data?.id ?? undefined}
        title={name}
      >
        {/* Requirement update bubble (appears on hover if requirement is stale) */}
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
              Associated requirement has been updated
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
          width={svgWidth}
          height={svgHeight}
          paddingX={PADDING_X}
          paddingY={PADDING_Y}
          isDeleted={isDeleted}
          isUpdated={isStale}
        />
      </div>

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
                    pathname: "/projects/[project-id]/requirements",
                    query: {
                      "project-id": projectId,
                      useCaseId: useCaseId!,
                      requirementId: data.id,
                    },
                  }),
                );
                closeMenu();
              }}
            >
              Navigate to Requirement
            </DropdownMenuItem>

            {/* Edit Activity Label option */}
            <DropdownMenuItem
              onSelect={() => {
                setIsEditing(true);
                closeMenu();
              }}
            >
              Edit Activity Label
            </DropdownMenuItem>

            {/* Add Resolve option when the activity is stale */}
            {isStale && (
              <DropdownMenuItem
                onSelect={handleResolveStale}
                disabled={updateStaleMutation.isPending}
              >
                {updateStaleMutation.isPending ? "Resolving..." : "Resolve"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
