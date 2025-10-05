import React from "react";

interface InitialShapeProps {
  selected?: boolean;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function InitialShape({
  selected = false,
  size = 40,
  fillColor = "#000",
  strokeColor = selected ? "var(--primary)" : "#fff",
  strokeWidth = 2,
  className,
  style,
  onClick,
}: InitialShapeProps) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

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
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  );
}
