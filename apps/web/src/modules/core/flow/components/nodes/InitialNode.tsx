import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { InitialShape } from "@/modules/features/activity-diagram/components/InitialShape";

interface InitialNodeProps {
  selected?: boolean;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function InitialNode({
  selected = false,
  size = 40,
  fillColor = "#000",
  strokeColor = selected ? "#3b82f6" : "#64748b",
  strokeWidth = 2,
  className,
  style,
  onClick,
}: InitialNodeProps) {
  const [hovered, setHovered] = useState(false);
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

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
      {/* BOTTOM HANDLE - Only source since initial node only has outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          bottom: handlesVisible ? -5 : 0,
          left: size / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
        }}
      />

      <InitialShape
        selected={selected}
        size={size}
        fillColor={fillColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}
