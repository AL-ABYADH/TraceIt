import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

interface JoinNodeProps {
  selected?: boolean;
  /** overall width of the node (px) */
  size?: number;
  /** color of the join bar (will follow ConditionShape colors) */
  fillColor?: string;
  /** color of the bar outline / handle contrast (will follow ConditionShape colors) */
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function JoinNode({
  selected = false,
  size = 200,
  fillColor = "#000", // Black background
  strokeColor = selected ? "#3b82f6" : "#fff", // Blue when selected, white when not
  strokeWidth = 2,
  className,
  style,
  onClick,
}: JoinNodeProps) {
  const [hovered, setHovered] = useState(false);

  // logical width and height
  const width = Math.max(80, size);
  const height = Math.max(28, Math.round(size * 0.25));

  const centerX = width / 2;
  const centerY = height / 2;

  // bar dimensions (horizontal join bar)
  const barWidth = Math.round(width * 0.7);
  const barHeight = Math.max(6, Math.round(height * 0.45));

  const handlesVisible = hovered || selected;

  // handle appearance - matching ActorShape style
  const handleSize = 10;
  const handleOffset = 4;

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        width,
        height,
        position: "relative",
        boxSizing: "border-box",
        userSelect: "none",
        cursor: onClick ? "pointer" : "default",
        background: "transparent",
        borderRadius: 6,
        padding: 6,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* TOP HANDLES - two incoming (targets) - positioned close to the bar */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target-left"
        style={{
          top: handleOffset,
          left: Math.round(width * 0.33),
          transform: "translateX(-50%)",
          background: "#fff", // White handle like ActorShape
          border: "none",
          width: handleSize,
          height: handleSize,
          borderRadius: 999,
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
        }}
      />

      <Handle
        type="target"
        position={Position.Top}
        id="top-target-right"
        style={{
          top: handleOffset,
          left: Math.round(width * 0.66),
          transform: "translateX(-50%)",
          background: "#fff", // White handle like ActorShape
          border: "none",
          width: handleSize,
          height: handleSize,
          borderRadius: 999,
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
        }}
      />

      {/* BOTTOM HANDLE - single outgoing (source) - positioned close to the bar */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          bottom: handleOffset,
          left: centerX,
          transform: "translateX(-50%)",
          background: "#fff", // White handle like ActorShape
          border: "none",
          width: handleSize,
          height: handleSize,
          borderRadius: 999,
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
        }}
      />

      {/* SVG horizontal bar (join) - EXACTLY SAME AS FORK NODE */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
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
        <rect
          x={centerX - barWidth / 2}
          y={centerY - barHeight / 2}
          width={barWidth}
          height={barHeight}
          fill={fillColor} // Black background
          stroke={strokeColor} // Blue border when selected, white when not
          strokeWidth={strokeWidth}
          rx={2}
          ry={2}
        />
      </svg>
    </div>
  );
}
