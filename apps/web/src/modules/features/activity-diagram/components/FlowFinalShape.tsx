import React from "react";

interface FlowFinalShapeProps {
  selected?: boolean;
  size?: number;
  fillColor?: string; // X color
  strokeColor?: string; // circle ring color
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function FlowFinalShape({
  selected = false,
  size = 40,
  fillColor = "#000",
  strokeColor = selected ? "#000" : "#000", // Keep black ring
  strokeWidth = 2,
  className,
  style,
  onClick,
}: FlowFinalShapeProps) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const crossSize = radius * 0.6;

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
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: "block", position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        aria-hidden
        focusable={false}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="#fff"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
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
