import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

interface FlowFinalNodeProps {
  selected?: boolean;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function FlowFinalNode({
  selected = false,
  size = 40,
  fillColor = "#000",
  strokeColor = "#000", // Changed to black border
  strokeWidth = 2,
  className,
  style,
  onClick,
}: FlowFinalNodeProps) {
  const [hovered, setHovered] = useState(false);
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const crossSize = radius * 0.6; // Size of the X

  const handlesVisible = hovered || selected;

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        position: "relative",
        boxSizing: "content-box",
        userSelect: "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* TOP HANDLE - Only target since flow final node only has incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{
          top: handlesVisible ? -5 : 0,
          left: size / 2,
          background: "#fff",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
        }}
      />

      {/* SVG for flow final node - circle with X inside */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: "block",
          position: "absolute",
          left: 0,
          top: 0,
          pointerEvents: "none",
        }}
        aria-hidden
        focusable={false}
      >
        {/* Outer circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="white"
          stroke={strokeColor} // Now black border
          strokeWidth={strokeWidth}
        />
        {/* X symbol */}
        <line
          x1={center - crossSize}
          y1={center - crossSize}
          x2={center + crossSize}
          y2={center + crossSize}
          stroke={fillColor}
          strokeWidth={strokeWidth * 1.5}
          strokeLinecap="round"
        />
        <line
          x1={center + crossSize}
          y1={center - crossSize}
          x2={center - crossSize}
          y2={center + crossSize}
          stroke={fillColor}
          strokeWidth={strokeWidth * 1.5}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
