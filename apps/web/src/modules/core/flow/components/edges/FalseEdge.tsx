"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "@xyflow/react";
import {
  DecisionNodeData,
  isConditionDto,
  isRequirementExceptionDto,
} from "@/types/decision-node-types";

export default function FalseEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
  } = props;

  const { getNodes } = useReactFlow();
  const sourceNode = props.source ? getNodes().find((n) => n.id === props.source) : undefined;

  // Determine color mapping for FALSE edge
  // Defaults: treat as condition
  let baseColor = "#ffc107"; // CONDITION FALSE -> yellow
  if (sourceNode?.data) {
    try {
      const nodeData = sourceNode.data as DecisionNodeData;
      if (isRequirementExceptionDto(nodeData)) {
        // EXCEPTION FALSE -> green
        baseColor = "#28a745";
      } else if (isConditionDto(nodeData)) {
        // CONDITION FALSE -> yellow
        baseColor = "#ffc107";
      }
    } catch (e) {
      // ignore and use default
    }
  }

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const stroke = selected ? "#3b82f6" : baseColor;
  const strokeWidth = selected ? 2.5 : 2;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke,
          strokeWidth,
          // Removed strokeDasharray to make it a straight solid line
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 11,
            fontWeight: 500,
            fontFamily: "system-ui, sans-serif",
            color: "#fff", // White text
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <div
            style={{
              background: "#000", // Black background
              padding: "1px 6px",
              borderRadius: "4px",
              border: `1px solid #fff`, // White border
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            FALSE
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
