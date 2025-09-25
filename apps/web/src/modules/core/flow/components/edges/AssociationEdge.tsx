"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";

export default function AssociationEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style = {} } = props;

  const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  // default stroke if none provided via style
  const stroke = "#FFFFFF";
  const strokeWidth = (style as any).strokeWidth ?? 1.25;

  return (
    <g className="react-flow__edge" data-id={id}>
      <path
        id={id}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={style}
        strokeLinecap="round"
      />
    </g>
  );
}
