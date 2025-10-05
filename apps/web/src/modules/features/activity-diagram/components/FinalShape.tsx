import React from "react";

interface FinalShapeProps {
  selected?: boolean;
  size?: number;
  fillColor?: string; // inner circle color
  strokeColor?: string; // outer ring color
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function FinalShape({
  selected = false,
  size = 40,
  fillColor = "#000",
  strokeColor = selected ? "#000" : "#000", // Keep black ring
  strokeWidth = 2,
  className,
  style,
  onClick,
}: FinalShapeProps) {
  const center = size / 2;
  const outerRadius = (size - strokeWidth) / 2;
  const innerRadius = outerRadius - 4;

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
          r={outerRadius}
          fill="#fff"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <circle cx={center} cy={center} r={innerRadius} fill={fillColor} stroke="none" />
      </svg>
    </div>
  );
}
