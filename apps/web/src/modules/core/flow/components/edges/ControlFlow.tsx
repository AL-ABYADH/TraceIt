"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";
import { BaseEdge, getBezierPath } from "@xyflow/react";

export default function ControlFlow(props: EdgeProps) {
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

  const stroke = selected ? "#60a5fa" : "#fff";
  const strokeWidth = 2.5;

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
        markerEnd={"url(#arrowhead-activity-default)"}
      />

      {/* Arrowhead definitions */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <marker
            id="arrowhead-activity-default"
            markerUnits="strokeWidth"
            orient="auto"
            refX={7}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            viewBox="0 0 10 10"
          >
            {/* Outer arrow (fill follows currentColor, slight outline for contrast) */}
            <path
              d="M1,1 L9,5 L1,9 L3,5 Z"
              fill="currentColor"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="0.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* small inner highlight to give a subtle 3D feel (optional) */}
            <path d="M2.2,4.6 L6.2,5 L2.2,5.4 L3.2,5 Z" fill="rgba(255,255,255,0.12)" />
          </marker>
        </defs>
      </svg>
    </>
  );
}
