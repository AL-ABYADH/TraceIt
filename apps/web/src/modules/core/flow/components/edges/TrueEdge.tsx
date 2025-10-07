"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "@xyflow/react";
import {
  DecisionNodeData,
  getDecisionNodeName,
  isConditionDto,
  isRequirementExceptionDto,
} from "@/types/decision-node-types";

export default function TrueEdge(props: EdgeProps) {
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

  const { getNodes } = useReactFlow();

  // Get the source node to access its data
  const sourceNode = getNodes().find((node) => node.id === source);

  // Determine label and color based on source node data and TRUE mapping
  let label = "TRUE";
  // Defaults in case of missing data: treat as condition
  let baseColor = "#28a745"; // CONDITION TRUE -> green
  let isException = false;

  if (sourceNode?.data) {
    try {
      const nodeData = sourceNode.data as DecisionNodeData;
      label = getDecisionNodeName(nodeData);

      // Color mapping for TRUE edge
      if (isRequirementExceptionDto(nodeData)) {
        // EXCEPTION TRUE -> red
        baseColor = "#dc3545";
        isException = true;
      } else if (isConditionDto(nodeData)) {
        // CONDITION TRUE -> green
        baseColor = "#28a745";
        isException = false;
      }
    } catch (error) {
      // Fallback to default if there's any error processing the node data
      console.warn("Failed to process decision node data:", error);
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
              display: "inline-block",
              maxWidth: "360px",
              textAlign: "left",
              overflow: "visible",
              textOverflow: "clip",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {label}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
