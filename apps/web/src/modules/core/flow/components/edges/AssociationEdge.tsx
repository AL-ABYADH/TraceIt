"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";

export default function AssociationEdge(props: EdgeProps) {
  const { id, selected, sourceX, sourceY, targetX, targetY, style = {} } = props;

  const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  const stroke = selected ? "var(--primary)" : "#fff";
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
