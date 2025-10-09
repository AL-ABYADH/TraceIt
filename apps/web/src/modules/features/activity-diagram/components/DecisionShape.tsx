import React, { useMemo } from "react";

interface DecisionShapeProps {
  name: string;
  selected?: boolean;
  isDeleted?: boolean;
  showLabel?: boolean; // if true, always show label; canvas will override to false
  // Optional explicit dimensions to avoid re-computation mismatch with canvas node container
  selectedColor?: string; // Add this
  isCanvasMode?: boolean; // hide label in canvas
  width?: number;
  height?: number;
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
  showLabel = true,
  isDeleted,
  isCanvasMode,
  width,
  height,
  selectedColor,
  maxWidth = 140,
  minWidth = 100,
  paddingX = 16,
  paddingY = 12,
  fontSize = 11,
  lineHeight = 16,
  fillColor = "#000",
  strokeColor = selected ? "var(--primary)" : isDeleted ? "var(--destructive)" : "#fff",
  strokeWidth = isDeleted ? 3 : 2, // ← Add this line to make border thicker when deleted
  textColor = "#fff",
  className,
  style,
  onClick,
}: DecisionShapeProps) {
  // Calculate dimensions based on text content unless explicit width/height provided
  const { svgWidth, svgHeight } = useMemo(() => {
    if (typeof width === "number" && typeof height === "number") {
      return { svgWidth: width, svgHeight: height };
    }
    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const computedWidth = Math.max(minWidth, textWidth);
    const computedHeight = Math.max(56, lines * lineHeight + paddingY * 4); //2

    return {
      svgWidth: computedWidth,
      svgHeight: computedHeight,
    };
  }, [name, width, height, maxWidth, minWidth, paddingX, paddingY, lineHeight, fontSize]);

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
      {!isCanvasMode && (
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
            // color: textColor,
            color: selectedColor,
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
      )}
    </div>
  );
}
