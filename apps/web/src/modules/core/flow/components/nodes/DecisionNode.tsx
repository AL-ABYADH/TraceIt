import type { NodeProps } from "@xyflow/react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { DecisionShape } from "@/modules/features/activity-diagram/components/DecisionShape";
import {
  DecisionNodeData,
  isRequirementExceptionDto,
  isRequirementListDto,
  getDecisionNodeName,
} from "@/types/decision-node-types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { route } from "nextjs-routes";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUpdateRequirementStale } from "@/modules/features/requirement/hooks/useUpdateRequirementStale";
import { useUpdateRequirementLabels } from "@/modules/features/requirement/hooks/useUpdateRequirementLabels";

export default function DecisionNode({ data, selected }: NodeProps<any>) {
  const params = useParams<"/projects/[project-id]/activity-diagrams">();
  const projectId = params["project-id"];
  const searchParams = useSearchParams();
  const useCaseId = searchParams.get("useCaseId");
  const router = useRouter();

  const [hovered, setHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState("");
  const [minEditingWidth, setMinEditingWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const updateStaleMutation = useUpdateRequirementStale(data?.id, data?.useCaseId, {
    onSuccess: () => console.log("Condition stale status updated successfully"),
    onError: (error) => console.error("Failed to update condition stale status:", error),
  });

  const updateRequirementLabelsMutation = useUpdateRequirementLabels(data?.id, data?.useCaseId, {
    onSuccess: () => {
      console.log("Condition label updated successfully");
      setIsEditing(false);
      setMinEditingWidth(0);
    },
    onError: (error) => {
      console.error("Failed to update condition label:", error);
      setEditedLabel(name);
    },
  });

  const BASE_WIDTH = 40;
  const BASE_HEIGHT = 40;

  // Enhanced data processing with proper deletion detection for both conditions and exceptions
  const { isException, isDeleted, name, selectedColor, isStale } = useMemo(() => {
    let isException = false;
    let isDeleted = false;
    let isStale = false;
    let displayName = "Condition";

    if (data) {
      try {
        const nodeData = data as DecisionNodeData;

        // Enhanced debug logging
        console.log("DecisionNode - Processing data:", {
          data,
          isRequirementListDto: isRequirementListDto(nodeData),
          isRequirementExceptionDto: isRequirementExceptionDto(nodeData),
          hasOperation: "operation" in nodeData,
          hasName: "name" in nodeData,
          // Check for deletion markers that might be added during data loading
          isRequirementDeleted: (nodeData as any)._isRequirementDeleted,
          isMarkedDeleted: (nodeData as any)._isDeleted,
          nodeId: data?.id,
        });

        // Use the type guards with enhanced deletion detection
        if (isRequirementListDto(nodeData)) {
          // Condition node - check if operation exists
          isException = false;
          isDeleted = !nodeData.operation || (nodeData as any)._isDeleted === true;
          isStale = nodeData.isConditionStale || false;
          displayName = isDeleted ? "Condition was deleted" : getDecisionNodeName(nodeData);
          console.log("DecisionNode - Identified as CONDITION:", {
            isDeleted,
            displayName,
            hasOperation: !!nodeData.operation,
            markedDeleted: (nodeData as any)._isDeleted,
          });
        } else if (isRequirementExceptionDto(nodeData)) {
          // Exception node - enhanced deletion detection
          isException = true;

          // Multiple indicators for exception deletion:
          // 1. Direct name deletion
          // 2. Marked as deleted in data
          // 3. Marked as requirement deleted (if requirement was deleted)
          const isDirectDeleted = !nodeData.name;
          const isMarkedDeleted = (nodeData as any)._isDeleted === true;
          const isRequirementDeleted = (nodeData as any)._isRequirementDeleted === true;

          isDeleted = isDirectDeleted || isMarkedDeleted || isRequirementDeleted;
          isStale = false; // Exceptions don't have stale status

          displayName = isDeleted ? "Exception was deleted" : getDecisionNodeName(nodeData);
          console.log("DecisionNode - Identified as EXCEPTION:", {
            isDeleted,
            displayName,
            hasName: !!nodeData.name,
            markedDeleted: isMarkedDeleted,
            requirementDeleted: isRequirementDeleted,
          });
        } else {
          // Fallback for unknown node types
          console.log("DecisionNode - Unknown node type, checking properties:", {
            dataKeys: Object.keys(data),
            dataValues: data,
          });

          // Try to determine type by properties as last resort
          if ("name" in data && data.name && !("operation" in data)) {
            // This looks like an exception
            isException = true;
            isDeleted =
              !data.name ||
              (data as any)._isDeleted === true ||
              (data as any)._isRequirementDeleted === true;
            displayName = isDeleted ? "Exception was deleted" : data.name;
            console.log("DecisionNode - Fallback: Identified as EXCEPTION by properties");
          } else if ("operation" in data && data.operation) {
            // This looks like a condition
            isException = false;
            isDeleted = !data.operation || (data as any)._isDeleted === true;
            isStale = (data as any).isConditionStale || false;
            displayName = isDeleted
              ? "Condition was deleted"
              : getDecisionNodeName(data as DecisionNodeData);
            console.log("DecisionNode - Fallback: Identified as CONDITION by properties");
          } else {
            // Unknown type - treat as deleted
            isDeleted = true;
            displayName = "Node was deleted";
            console.log("DecisionNode - Fallback: Unknown node type - marking as deleted");
          }
        }
      } catch (error) {
        console.warn("Failed to process decision node data:", error);
        isDeleted = true;
        displayName = "Node was deleted";
      }
    } else {
      // If no data at all, consider it deleted
      isDeleted = true;
      displayName = "Node was deleted";
      console.log("DecisionNode - No data available");
    }

    const selectedColor = isException ? "#FF681F" : "#28a745";
    return { isException, isDeleted, name: displayName, selectedColor, isStale };
  }, [data]);

  // Guarded editing starter — use this instead of calling setIsEditing(true) directly
  const startEditing = useCallback(() => {
    if (!isDeleted && !isException) {
      setIsEditing(true);
    } else {
      console.debug("Editing blocked: exception or deleted node", { isException, isDeleted });
    }
  }, [isDeleted, isException]);

  // If node unexpectedly becomes an exception or deleted while editing, cancel editing
  useEffect(() => {
    if ((isException || isDeleted) && isEditing) {
      setIsEditing(false);
    }
  }, [isException, isDeleted, isEditing]);

  // Original width/height logic for normal view (with max limit)
  const { svgWidth: normalWidth, svgHeight: normalHeight } = useMemo(() => {
    const paddingX = 16;
    const fontSize = 11;
    const avgCharWidth = fontSize * 0.6;

    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, BASE_WIDTH);
    const width = Math.max(40, textWidth);
    const height = BASE_HEIGHT;

    return { svgWidth: width, svgHeight: height };
  }, [name]);

  // Calculate the initial editing width based on current text (NO MAX LIMIT during editing)
  const initialEditingWidth = useMemo(() => {
    const paddingX = 16;
    const fontSize = 11;
    const avgCharWidth = fontSize * 0.6;
    const minWidth = 40;

    const textWidth = name.length * avgCharWidth + paddingX * 2;
    return Math.max(minWidth, textWidth);
  }, [name]);

  // Dynamic width calculation ONLY for editing mode - NO MAX LIMIT
  const { svgWidth: editingWidth, svgHeight: editingHeight } = useMemo(() => {
    if (!isEditing) {
      return { svgWidth: normalWidth, svgHeight: normalHeight };
    }
    const paddingX = 16;
    const fontSize = 11;
    const avgCharWidth = fontSize * 0.6;
    const minWidth = 40;

    const requiredWidth = editedLabel.length * avgCharWidth + paddingX * 2;
    const minRequiredWidth = Math.max(minWidth, requiredWidth);
    const currentMinWidth = Math.max(minEditingWidth || initialEditingWidth, minRequiredWidth);

    return { svgWidth: currentMinWidth, svgHeight: BASE_HEIGHT };
  }, [isEditing, editedLabel, normalWidth, normalHeight, minEditingWidth, initialEditingWidth]);

  const currentWidth = isEditing ? editingWidth : normalWidth;
  const currentHeight = isEditing ? editingHeight : normalHeight;

  // Initialize edited label and set minimum editing width when editing starts
  useEffect(() => {
    if (isEditing) {
      setEditedLabel(name);
      setMinEditingWidth(initialEditingWidth);
    } else {
      setMinEditingWidth(0);
    }
  }, [isEditing, name, initialEditingWidth]);

  // Update minimum editing width if user types longer text
  useEffect(() => {
    if (isEditing) {
      const paddingX = 16;
      const fontSize = 11;
      const avgCharWidth = fontSize * 0.6;
      const requiredWidth = editedLabel.length * avgCharWidth + paddingX * 2;
      const minRequiredWidth = Math.max(40, requiredWidth);

      if (minRequiredWidth > minEditingWidth) {
        setMinEditingWidth(minRequiredWidth);
      }
    }
  }, [isEditing, editedLabel, minEditingWidth]);

  // Focus input when editing starts - place cursor at end
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      try {
        inputRef.current.setSelectionRange(editedLabel.length, editedLabel.length);
      } catch {
        /* ignore if not supported */
      }
    }
  }, [isEditing, editedLabel.length]);

  // Force edge reconnection when node size changes
  useEffect(() => {
    if (data?.id) {
      updateNodeInternals(data.id);
    }
  }, [currentWidth, currentHeight, data?.id, updateNodeInternals]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuPosition(null);

  const handleResolveStale = () => {
    if (data?.id && !isException) {
      updateStaleMutation.mutate({ isConditionStale: false });
    }
    closeMenu();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use guarded starter
    startEditing();
  };

  const handleLabelSave = () => {
    if (editedLabel.trim() && editedLabel !== name) {
      updateRequirementLabelsMutation.mutate({ conditionLabel: editedLabel.trim() });
    } else {
      setEditedLabel(name);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLabelSave();
    else if (e.key === "Escape") {
      setEditedLabel(name);
      setIsEditing(false);
    }
  };

  const handleInputBlur = () => {
    handleLabelSave();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedLabel(e.target.value);
  };

  const handlesVisible = (hovered || selected) && !isDeleted;

  // Consistent handle positioning that works with dynamic widths
  const handleOffset = handlesVisible ? -6 : 0;

  const handleStyle = {
    background: "white" as const,
    border: "2px solid #94a3b8",
    opacity: handlesVisible ? 1 : 0,
    pointerEvents: handlesVisible ? ("all" as const) : ("none" as const),
    width: 12,
    height: 12,
    transition: "all 0.2s ease",
  };

  // Editing mode view (only possible when not exception / not deleted due to guards)
  if (isEditing && !isDeleted && !isException) {
    return (
      <div
        style={{
          position: "relative",
          width: `${currentWidth}px`,
          height: `${currentHeight}px`,
          minHeight: `${currentHeight}px`,
          pointerEvents: "all",
          transition: "width 0.12s linear",
        }}
      >
        <DecisionShape
          name=""
          selected={selected}
          isDeleted={false}
          isUpdated={false}
          isCanvasMode={true}
          selectedColor={selectedColor}
          width={currentWidth}
          height={currentHeight}
        />
        <input
          ref={inputRef}
          type="text"
          value={editedLabel}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          disabled={updateRequirementLabelsMutation.isPending}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `calc(100% - 32px)`,
            background: "transparent",
            border: "none",
            outline: "none",
            textAlign: "center",
            fontSize: "11px",
            fontFamily: "inherit",
            color: "inherit",
          }}
          placeholder="Enter condition label..."
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
          width: `${currentWidth}px`,
          height: `${currentHeight}px`,
          minHeight: `${currentHeight}px`,
          transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: isDeleted ? "none" : "all",
          cursor: !isDeleted && !isException ? "text" : "default",
        }}
        onMouseEnter={() => !isDeleted && setHovered(true)}
        onMouseLeave={() => !isDeleted && setHovered(false)}
        onContextMenu={handleContextMenu}
        // attach double-click handler only when editing allowed (guarded again)
        onDoubleClick={!isDeleted && !isException ? handleDoubleClick : undefined}
        data-id={data?.id ?? undefined}
        title={isException ? "Exceptions cannot be edited" : name}
      >
        {/* Stale bubble */}
        {isStale && !isException && (hovered || selected) && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: -28,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
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
                whiteSpace: "nowrap",
              }}
            >
              Associated requirement has been updated
            </div>
          </div>
        )}

        {/* FIXED: Handles with consistent positioning */}
        {/* LEFT HANDLES */}
        <Handle
          type="target"
          position={Position.Left}
          id="left-target"
          style={{
            ...handleStyle,
            left: handleOffset,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          isConnectable={!isDeleted}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left-source"
          style={{
            ...handleStyle,
            left: handleOffset,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          isConnectable={!isDeleted}
        />

        {/* RIGHT HANDLES */}
        <Handle
          type="target"
          position={Position.Right}
          id="right-target"
          style={{
            ...handleStyle,
            right: handleOffset,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          isConnectable={!isDeleted}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          style={{
            ...handleStyle,
            right: handleOffset,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          isConnectable={!isDeleted}
        />

        {/* TOP HANDLES */}
        <Handle
          type="target"
          position={Position.Top}
          id="top-target"
          style={{
            ...handleStyle,
            top: handleOffset,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          isConnectable={!isDeleted}
        />
        <Handle
          type="source"
          position={Position.Top}
          id="top-source"
          style={{
            ...handleStyle,
            top: handleOffset,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          isConnectable={!isDeleted}
        />

        <DecisionShape
          name={name}
          selected={selected}
          isDeleted={isDeleted}
          isUpdated={isStale && !isException}
          isCanvasMode={true}
          selectedColor={selectedColor}
          width={currentWidth}
          height={currentHeight}
        />
      </div>

      {/* Context menu for both condition nodes AND exception nodes */}
      {menuPosition && !isDeleted && (
        <DropdownMenu open onOpenChange={(open) => !open && closeMenu()}>
          <DropdownMenuContent
            sideOffset={0}
            className="min-w-48 bg-card text-popover-foreground border border-border shadow-lg rounded-xl p-1"
            style={{ position: "fixed", top: menuPosition.y, left: menuPosition.x }}
          >
            {/* Navigate to Requirement option - available for both conditions and exceptions */}
            <DropdownMenuItem
              onSelect={() => {
                router.push(
                  route({
                    pathname: "/projects/[project-id]/requirements",
                    query: {
                      "project-id": projectId,
                      useCaseId: useCaseId!,
                      requirementId: isException ? undefined : data.id,
                      exceptionId: isException ? data.id : undefined,
                    },
                  }),
                );
                closeMenu();
              }}
            >
              Navigate to {isException ? "Exception" : "Requirement"}
            </DropdownMenuItem>

            {/* Edit Condition Label - only for condition nodes */}
            {!isException && (
              <DropdownMenuItem
                onSelect={() => {
                  startEditing(); // uses guarded starter
                  closeMenu();
                }}
              >
                Edit Condition Label
              </DropdownMenuItem>
            )}

            {/* Resolve Stale - only for condition nodes */}
            {!isException && isStale && (
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
