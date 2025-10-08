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
    source,
  } = props;

  const { getNode } = useReactFlow();
  const sourceNode = getNode(source);

  // Determine color mapping for FALSE edge
  let baseColor = "#ffc107"; // CONDITION FALSE -> yellow
  if (sourceNode?.data) {
    try {
      const nodeData = sourceNode.data as DecisionNodeData;
      if (isRequirementExceptionDto(nodeData)) {
        baseColor = "#28a745"; // EXCEPTION FALSE -> green
      } else if (isConditionDto(nodeData)) {
        baseColor = "#ffc107"; // CONDITION FALSE -> yellow
      }
    } catch (e) {
      // ignore and use default
    }
  }

  // Calculate edge path
  const [edgePath, pathLabelX, pathLabelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Position FALSE label along FALSE edge path (30% from source)
  const edgeProgress = 0.3;
  const labelX = sourceX + (pathLabelX - sourceX) * edgeProgress;
  const labelY = sourceY + (pathLabelY - sourceY) * edgeProgress - 15; // 15px above the path

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
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-100%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 500,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
              // color: "#1a1a1a",
              // background: "#ffffff",
              color: "#ffffff",
              background: "#000000",
              padding: "1px 6px",
              borderRadius: "3px",
              border: "1px solid #d0d0d0",
              boxShadow: selected
                ? "0 2px 8px rgba(59, 130, 246, 0.3), 0 0 0 2px rgba(59, 130, 246, 0.2)"
                : "0 1px 3px rgba(0, 0, 0, 0.12)",
              display: "inline-block",
              maxWidth: "200px",
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "default",
              userSelect: "none",
              transition: "all 0.15s ease",
            }}
            title="FALSE"
          >
            [FALSE]
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
