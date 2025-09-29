import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

interface FinalNodeProps {
  selected?: boolean;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function FinalNode({
  selected = false,
  size = 40,
  fillColor = "#000",
  strokeColor = "#000", // Changed to black border
  strokeWidth = 2,
  className,
  style,
  onClick,
}: FinalNodeProps) {
  const [hovered, setHovered] = useState(false);
  const center = size / 2;
  const outerRadius = (size - strokeWidth) / 2;
  const innerRadius = outerRadius - 4; // Inner circle is smaller to create the ring effect

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
      {/* TOP HANDLE - Only target since final node only has incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{
          top: handlesVisible ? -5 : 0,
          left: size / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
        }}
      />

      {/* SVG for final node - white background with black circles */}
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
        {/* White background circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="white" // White background
          stroke={strokeColor} // Black border
          strokeWidth={strokeWidth}
        />
        {/* Inner black circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill={fillColor} // Black inner circle
          stroke="none" // No stroke on inner circle
        />
      </svg>
    </div>
  );
}
