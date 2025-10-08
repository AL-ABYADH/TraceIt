import type { NodeProps } from "@xyflow/react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo, useState, useEffect } from "react";
import { DecisionShape } from "@/modules/features/activity-diagram/components/DecisionShape";
import {
  DecisionNodeData,
  isConditionNode,
  isRequirementExceptionDto,
} from "@/types/decision-node-types";

export default function DecisionNode({ data, selected }: NodeProps<any>) {
  const name = data?.name ?? "Condition";
  const [hovered, setHovered] = useState(false);
  const updateNodeInternals = useUpdateNodeInternals();

  // ✅ You can hardcode or change these directly
  const BASE_WIDTH = 40;
  const BASE_HEIGHT = 40;

  // Determine node type and colors
  const { isException, selectedColor } = useMemo(() => {
    let isException = false;

    if (data) {
      try {
        const nodeData = data as DecisionNodeData;
        isException = isRequirementExceptionDto(nodeData);
      } catch (error) {
        console.warn("Failed to process decision node data:", error);
      }
    }

    const selectedColor = isException ? "#dc3545" : "#28a745";
    return { isException, selectedColor };
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

  const handlesVisible = hovered || selected;

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
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
      />

      <DecisionShape
        name={name}
        selected={selected}
        isCanvasMode={true} // hide label in canvas
        selectedColor={selectedColor}
        width={svgWidth}
        height={svgHeight}
      />
    </div>
  );
}
