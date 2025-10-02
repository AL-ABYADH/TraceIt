import React, { useMemo, useState } from "react";
import { Handle, Position } from "@xyflow/react";

interface MergeNodeProps {
  selected?: boolean;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function MergeNode({
  selected = false,
  size = 100,
  fillColor = "#000",
  strokeColor = selected ? "#3b82f6" : "#fff",
  strokeWidth = 2,
  className,
  style,
  onClick,
}: MergeNodeProps) {
  const [hovered, setHovered] = useState(false);

  // Calculate dimensions for the diamond shape
  const { svgWidth, svgHeight } = useMemo(() => {
    const width = Math.max(80, size);
    const height = Math.max(80, size);
    return { svgWidth: width, svgHeight: height };
  }, [size]);

  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  const handlesVisible = hovered || selected;

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* LEFT HANDLE - target for incoming connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{
          left: handlesVisible ? -6 : 0,
          top: centerY,
          background: "#fff",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />

      {/* RIGHT HANDLE - target for incoming connections */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          right: handlesVisible ? -6 : 0,
          top: centerY,
          background: "#fff",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />

      {/* BOTTOM HANDLE - source for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          bottom: handlesVisible ? -6 : 0,
          left: centerX,
          background: "#fff",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />

      {/* SVG diamond shape for merge node */}
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
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
