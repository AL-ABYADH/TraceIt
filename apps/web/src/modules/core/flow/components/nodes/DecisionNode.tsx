import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useMemo, useState } from "react";
import { DecisionShape } from "@/modules/features/activity-diagram/components/DecisionShape";
import {
  DecisionNodeData,
  getDecisionNodeName,
  isConditionNode,
  isRequirementExceptionDto,
} from "@/types/decision-node-types";

export default function DecisionNode({ data, selected }: NodeProps<any>) {
  const name = data?.name ?? "Condition";
  const [hovered, setHovered] = useState(false);

  // Determine node type and colors
  const { isCondition, isException, selectedColor } = useMemo(() => {
    let isCondition = true;
    let isException = false;

    if (data) {
      try {
        const nodeData = data as DecisionNodeData;
        isException = isRequirementExceptionDto(nodeData);
        isCondition = isConditionNode(nodeData) || !isException;
      } catch (error) {
        console.warn("Failed to process decision node data:", error);
        // Fallback to condition type
        isCondition = true;
        isException = false;
      }
    }

    // Selected colors: green for condition, red for exception
    const selectedColor = isException ? "#dc3545" : "#28a745";

    return { isCondition, isException, selectedColor };
  }, [data]);

  // Calculate dimensions to position handles correctly
  const { svgWidth, svgHeight } = useMemo(() => {
    const maxWidth = 140;
    const minWidth = 90;
    const paddingX = 16;
    const paddingY = 12;
    const fontSize = 11;
    const lineHeight = 16;

    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const width = Math.max(minWidth, textWidth);
    const height = Math.max(56, lines * lineHeight + paddingY * 2);

    return { svgWidth: width, svgHeight: height };
  }, [name]);

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
        width: svgWidth,
        height: svgHeight,
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

      {/* BOTTOM HANDLES - commented out as in original */}
      {/* <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={{
          ...handleStyle,
          bottom: handlesVisible ? -6 : 0,
          left: svgWidth / 2,
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          ...handleStyle,
          bottom: handlesVisible ? -6 : 0,
          left: svgWidth / 2,
          transform: "translateX(-50%)",
        }}
      /> */}

      <DecisionShape
        name={name}
        selected={selected}
        selectedColor={selectedColor}
        showLabel={false}
        width={svgWidth}
        height={svgHeight}
      />
    </div>
  );
}
