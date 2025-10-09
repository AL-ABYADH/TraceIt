import React, { useMemo } from "react";

interface UseCaseShapeProps {
  name: string;
  selected?: boolean;
  isDeleted?: boolean;
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

export function UseCaseShape({
  name,
  selected = false,
  isDeleted = false,
  maxWidth = 200,
  minWidth = 100,
  paddingX = 28,
  paddingY = 14,
  fontSize = 14,
  lineHeight = 20,
  fillColor = "#000",
  strokeColor = selected ? "var(--primary)" : isDeleted ? "#ff4444" : "#fff",
  strokeWidth = isDeleted ? 3 : 2,
  textColor = "#fff",
  className,
  style,
  onClick,
}: UseCaseShapeProps) {
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

    // Calculate height based on number of lines
    const height = lines * lineHeight + paddingY * 2;

    return {
      svgWidth: width,
      svgHeight: height,
    };
  }, [name, maxWidth, minWidth, paddingX, paddingY, lineHeight, fontSize]);

  const rx = svgWidth / 2;
  const ry = svgHeight / 2;
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;

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
      {/* SVG ellipse */}
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
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx - 1}
          ry={ry - 1}
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
          lineHeight: `${lineHeight}px`,
          whiteSpace: "normal",
          overflow: "hidden",
          wordBreak: "break-word",
          pointerEvents: "auto",
        }}
      >
        <div style={{ maxWidth: svgWidth - paddingX * 2 }}>{name}</div>
      </div>
    </div>
  );
}
