import type { NodeProps } from "@xyflow/react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo, useState, useEffect } from "react";
import { DecisionShape } from "@/modules/features/activity-diagram/components/DecisionShape";
import { DecisionNodeData, isRequirementExceptionDto } from "@/types/decision-node-types";

export default function DecisionNode({ data, selected }: NodeProps<any>) {
  const [hovered, setHovered] = useState(false);
  const updateNodeInternals = useUpdateNodeInternals();

  // ✅ You can hardcode or change these directly
  const BASE_WIDTH = 40;
  const BASE_HEIGHT = 40;

  // Determine node type, deletion status, and name
  const { isException, isDeleted, name, selectedColor } = useMemo(() => {
    let isException = false;
    let isDeleted = false;
    let displayName = "Condition";

    if (data) {
      try {
        const nodeData = data as DecisionNodeData;
        isException = isRequirementExceptionDto(nodeData);

        // Check if the node is deleted (no name)
        isDeleted = !data.name;

        // Set appropriate display name based on type and deletion status
        if (isDeleted) {
          displayName = isException ? "Exception was deleted" : "Condition was deleted";
        } else {
          displayName = data.name;
        }
      } catch (error) {
        console.warn("Failed to process decision node data:", error);
        // If data processing fails, consider it deleted
        isDeleted = true;
        displayName = "Node was deleted";
      }
    } else {
      // If no data at all, consider it deleted
      isDeleted = true;
      displayName = "Node was deleted";
    }

    const selectedColor = isException ? "#dc3545" : "#28a745";
    return { isException, isDeleted, name: displayName, selectedColor };
  }, [data]);

  // ✅ Adjustable width/height logic
  const { svgWidth, svgHeight } = useMemo(() => {
    const paddingX = 16;
    const fontSize = 11;
    const avgCharWidth = fontSize * 0.6;

    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, BASE_WIDTH);

    const width = Math.max(40, textWidth);
    const height = BASE_HEIGHT; // 👈 you can control this freely now

    return { svgWidth: width, svgHeight: height };
  }, [name]);

  // Ensure React Flow recalculates the node layout when height changes
  useEffect(() => {
    if (data?.id) updateNodeInternals(data.id);
  }, [svgHeight, data?.id, updateNodeInternals]);

  // handles are visible only when hovered, selected, AND not deleted
  const handlesVisible = (hovered || selected) && !isDeleted;

  const handleStyle = {
    background: "white" as const,
    border: "2px solid #94a3b8",
    opacity: handlesVisible ? 1 : 0,
    pointerEvents: handlesVisible ? ("all" as const) : ("none" as const),
    width: 12,
    height: 12,
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${svgWidth}px`,
        height: `${svgHeight}px`,
        minHeight: `${svgHeight}px`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isDeleted ? "none" : "all", // Disable all interactions when deleted
      }}
      onMouseEnter={() => !isDeleted && setHovered(true)} // Only set hover if not deleted
      onMouseLeave={() => !isDeleted && setHovered(false)} // Only set hover if not deleted
      data-id={data?.id ?? undefined}
      title={name}
    >
      {/* LEFT HANDLES */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{
          ...handleStyle,
          left: handlesVisible ? -6 : 0,
          top: svgHeight / 2,
          transform: "translateY(-50%)",
        }}
        isConnectable={!isDeleted} // Disable connections when deleted
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          ...handleStyle,
          left: handlesVisible ? -6 : 0,
          top: svgHeight / 2,
          transform: "translateY(-50%)",
        }}
        isConnectable={!isDeleted} // Disable connections when deleted
      />

      {/* RIGHT HANDLES */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          ...handleStyle,
          right: handlesVisible ? -6 : 0,
          top: svgHeight / 2,
          transform: "translateY(-50%)",
        }}
        isConnectable={!isDeleted} // Disable connections when deleted
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          ...handleStyle,
          right: handlesVisible ? -6 : 0,
          top: svgHeight / 2,
          transform: "translateY(-50%)",
        }}
        isConnectable={!isDeleted} // Disable connections when deleted
      />

      {/* TOP HANDLES */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{
          ...handleStyle,
          top: handlesVisible ? -6 : 0,
          left: svgWidth / 2,
          transform: "translateX(-50%)",
        }}
        isConnectable={!isDeleted} // Disable connections when deleted
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          ...handleStyle,
          top: handlesVisible ? -6 : 0,
          left: svgWidth / 2,
          transform: "translateX(-50%)",
        }}
        isConnectable={!isDeleted} // Disable connections when deleted
      />

      <DecisionShape
        name={name}
        selected={selected}
        isDeleted={isDeleted}
        isCanvasMode={true} // hide label in canvas
        selectedColor={selectedColor}
        width={svgWidth}
        height={svgHeight}
      />
    </div>
  );
}
