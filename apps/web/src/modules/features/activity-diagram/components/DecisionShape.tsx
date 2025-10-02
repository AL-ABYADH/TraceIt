import React, { useMemo } from "react";

interface DecisionShapeProps {
  name: string;
  selected?: boolean;
  maxWidth?: number;
  minWidth?: number;
  paddingX?: number;
  paddingY?: number;
  fontSize?: number;
  lineHeight?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function DecisionShape({
  name,
  selected = false,
  maxWidth = 160,
  minWidth = 100,
  paddingX = 24,
  paddingY = 16,
  fontSize = 13,
  lineHeight = 18,
  fillColor = "#000",
  strokeColor = selected ? "var(--primary)" : "#fff",
  strokeWidth = 2,
  textColor = "#fff",
  className,
  style,
  onClick,
}: DecisionShapeProps) {
  // Calculate dimensions based on text content
  const { svgWidth, svgHeight } = useMemo(() => {
    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const width = Math.max(minWidth, textWidth);
    const height = Math.max(80, lines * lineHeight + paddingY * 2);

    return {
      svgWidth: width,
      svgHeight: height,
    };
  }, [name, maxWidth, minWidth, paddingX, paddingY, lineHeight, fontSize]);

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
      {/* SVG diamond shape */}
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

      {/* Label wrapper */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: svgWidth,
          height: svgHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: `${paddingY}px ${paddingX}px`,
          boxSizing: "border-box",
          color: textColor,
          fontSize: fontSize,
          fontWeight: "500",
          lineHeight: `${lineHeight}px`,
          whiteSpace: "normal",
          overflow: "hidden",
          wordBreak: "break-word",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            maxWidth: svgWidth - paddingX * 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
