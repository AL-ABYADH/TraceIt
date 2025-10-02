"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";
import { BaseEdge, getBezierPath } from "@xyflow/react";

export default function ActivityFlowEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    selected,
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const stroke = selected ? "#60a5fa" : "#93c5fd"; // Light blue when selected, even lighter when not
  const strokeWidth = selected ? 3 : 2.5;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke,
          strokeWidth,
          strokeLinecap: "round",
        }}
        markerEnd={
          selected ? "url(#arrowhead-activity-selected)" : "url(#arrowhead-activity-default)"
        }
      />

      {/* Arrowhead definitions */}
      {/* <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <marker
            id="arrowhead-activity-default"
            markerWidth="12"
            markerHeight="8"
            refX="10"
            refY="4"
            orient="auto"
          >
            <polygon
              points="0 0, 12 4, 0 8"
              fill="#93c5fd" // Light blue arrowhead
              stroke="#93c5fd"
              strokeWidth="0.5"
            />
          </marker>
          <marker
            id="arrowhead-activity-selected"
            markerWidth="12"
            markerHeight="8"
            refX="10"
            refY="4"
            orient="auto"
          >
            <polygon
              points="0 0, 12 4, 0 8"
              fill="#60a5fa" // Slightly darker blue when selected
              stroke="#60a5fa"
              strokeWidth="0.5"
            />
          </marker>
        </defs>
      </svg> */}
    </>
  );
}
