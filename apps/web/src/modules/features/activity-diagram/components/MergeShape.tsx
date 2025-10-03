import React, { useMemo } from "react";

interface MergeShapeProps {
  selected?: boolean;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function MergeShape({
  selected = false,
  size = 100,
  fillColor = "#000",
  strokeColor = selected ? "var(--primary)" : "#fff",
  strokeWidth = 2,
  className,
  style,
  onClick,
}: MergeShapeProps) {
  const { svgWidth, svgHeight } = useMemo(() => {
    const width = Math.max(80, size);
    const height = Math.max(80, size);
    return { svgWidth: width, svgHeight: height };
  }, [size]);

  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        width: svgWidth,
        height: svgHeight,
        position: "relative",
        boxSizing: "content-box",
        userSelect: "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ display: "block", position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        aria-hidden
        focusable={false}
      >
        <polygon
          points={`
            ${centerX},${strokeWidth / 2}
            ${svgWidth - strokeWidth / 2},${centerY}
            ${centerX},${svgHeight - strokeWidth / 2}
            ${strokeWidth / 2},${centerY}
          `}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  );
}
