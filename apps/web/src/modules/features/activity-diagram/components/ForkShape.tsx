import React from "react";

interface ForkShapeProps {
  selected?: boolean;
  width?: number;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  overlay?: boolean; // when true, used inside nodes to overlay at (0,0)
}

export function ForkShape({
  selected = false,
  width = 140,
  height = 40,
  fillColor = "#000",
  strokeColor = selected ? "var(--primary)" : "#fff",
  strokeWidth = 2,
  className,
  style,
  onClick,
  overlay = false,
}: ForkShapeProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const barWidth = Math.round(width * 0.7);
  const barHeight = Math.max(6, Math.round(height * 0.45));

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        width,
        height,
        position: overlay ? "absolute" : "relative",
        left: overlay ? 0 : undefined,
        top: overlay ? 0 : undefined,
        boxSizing: "content-box",
        userSelect: "none",
        cursor: onClick ? "pointer" : "default",
        background: "transparent",
        pointerEvents: overlay ? "none" : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block", position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        aria-hidden
        focusable={false}
      >
        <rect
          x={centerX - barWidth / 2}
          y={centerY - barHeight / 2}
          width={barWidth}
          height={barHeight}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          rx={2}
          ry={2}
        />
      </svg>
    </div>
  );
}
