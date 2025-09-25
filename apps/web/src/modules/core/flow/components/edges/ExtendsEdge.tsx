"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";

export default function ExtendsEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style = {} } = props;

  const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  const markerId = `extend-arrow-${id}`;

  return (
    <g className="react-flow__edge">
      <defs>
        <marker
          id={markerId}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          {/* Hollow arrowhead, stroke white */}
          <path d="M 0 0 L 10 6 L 0 12" fill="none" stroke="white" strokeWidth={1.5} />
        </marker>
      </defs>

      <path
        id={id}
        d={d}
        fill="none"
        stroke="white" // white line
        strokeWidth={1.2}
        strokeDasharray="6,4"
        markerEnd={`url(#${markerId})`}
        style={style}
      />

      <text
        x={midX}
        y={midY - 8}
        textAnchor="middle"
        fontSize={11}
        fontFamily="sans-serif"
        fill="white" // white text
        pointerEvents="none"
        style={{ userSelect: "none" }}
      >
        {"«extend»"}
      </text>
    </g>
  );
}
