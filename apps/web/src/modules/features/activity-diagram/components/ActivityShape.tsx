import React, { useMemo } from "react";

interface ActivityShapeProps {
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

export function ActivityShape({
  name,
  selected = false,
  maxWidth = 200,
  minWidth = 120,
  paddingX = 32,
  paddingY = 20,
  fontSize = 14,
  lineHeight = 20,
  fillColor = "#000",
  strokeColor = selected ? "var(--primary)" : "#fff",
  strokeWidth = 2,
  textColor = "#fff",
  className,
  style,
  onClick,
}: ActivityShapeProps) {
  // Calculate dimensions based on text content
  const { svgWidth, svgHeight } = useMemo(() => {
    // Rough character width estimation for the font size
    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);

    // Estimate number of lines needed
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));

    // Calculate width needed (but don't exceed maxWidth)
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const width = Math.max(minWidth, textWidth);

    // Calculate height based on number of lines with minimum height
    const calculatedHeight = lines * lineHeight + paddingY * 2;
    const height = Math.max(60, calculatedHeight);

    return {
      svgWidth: width,
      svgHeight: height,
    };
  }, [name, maxWidth, minWidth, paddingX, paddingY, lineHeight, fontSize]);

  // Calculate stadium/oval-like border radius (pill shape)
  const stadiumBorderRadius = useMemo(() => {
    // For stadium shape, use half of the height for both X and Y radius
    // This creates the oval/pill shape characteristic of certain activity nodes
    return svgHeight / 2;
  }, [svgHeight]);

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
      {/* SVG stadium/oval shape (pill shape) */}
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
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={svgWidth - strokeWidth}
          height={svgHeight - strokeWidth}
          rx={stadiumBorderRadius}
          ry={stadiumBorderRadius}
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
