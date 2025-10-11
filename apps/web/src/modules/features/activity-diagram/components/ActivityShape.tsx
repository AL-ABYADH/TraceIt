import React, { useMemo } from "react";

interface ActivityShapeProps {
  name: string;
  selected?: boolean;
  isDeleted?: boolean;
  isUpdated?: boolean;
  // Optional explicit dimensions to keep canvas container and shape perfectly aligned
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
  // Add this prop to prevent independent size calculation
  isCanvasMode?: boolean;
}

export function ActivityShape({
  name,
  selected = false,
  isDeleted = false,
  isUpdated = false,
  width,
  height,
  maxWidth = 200,
  minWidth = 120,
  paddingX = 32,
  paddingY = 20,
  fontSize = 11,
  lineHeight = 16,
  fillColor = "#000",
  strokeColor, // Allow override
  strokeWidth = isDeleted ? 3 : 2,
  textColor = "#fff",
  className,
  style,
  onClick,
  isCanvasMode = false, // New prop to indicate we're in canvas mode
}: ActivityShapeProps) {
  // FIX: When in canvas mode and explicit dimensions are provided, use them directly
  // without recalculating based on text content
  const { svgWidth, svgHeight } = useMemo(() => {
    // If explicit dimensions are provided (especially in canvas mode), use them directly
    if (typeof width === "number" && typeof height === "number") {
      return { svgWidth: width, svgHeight: height };
    }

    // Only calculate dimensions based on text if no explicit dimensions are provided
    // Rough character width estimation for the font size
    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);

    // Estimate number of lines needed
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));

    // Calculate width needed (but don't exceed maxWidth)
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const computedWidth = Math.max(minWidth, textWidth);

    // Calculate height based on number of lines with minimum height
    const calculatedHeight = lines * lineHeight + paddingY * 2;
    const computedHeight = Math.max(60, calculatedHeight);

    return {
      svgWidth: computedWidth,
      svgHeight: computedHeight,
    };
  }, [name, width, height, maxWidth, minWidth, paddingX, paddingY, lineHeight, fontSize]);

  // Calculate stadium/oval-like border radius (pill shape)
  const stadiumBorderRadius = useMemo(() => {
    // For stadium shape, use half of the height for both X and Y radius
    // This creates the oval/pill shape characteristic of certain activity nodes
    return svgHeight / 2;
  }, [svgHeight]);

  // Fix the stroke color logic - priority: deleted > updated > selected > default
  const computedStrokeColor =
    strokeColor ||
    (isDeleted
      ? "var(--destructive)"
      : isUpdated
        ? "#fbbf24" // Use a better yellow color
        : selected
          ? "var(--primary)"
          : "#fff");

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
          stroke={computedStrokeColor}
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
