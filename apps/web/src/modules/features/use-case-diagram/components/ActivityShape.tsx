"use client";

import React, { useLayoutEffect, useState } from "react";

export interface ActivityShapeProps {
  name: string;
  selected?: boolean;
  minWidth?: number;
  minHeight?: number;
  cornerRadius?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
  labelFontSize?: number;
  labelFontWeight?: number | string;
  labelColor?: string;
  padding?: number;
  lineHeight?: number;
}

export default function ActivityShape({
  name,
  selected = false,
  minWidth = 120,
  minHeight = 60,
  cornerRadius = 8,
  stroke = selected ? "var(--primary)" : "#fff",
  strokeWidth = 2,
  fill = "transparent",
  className,
  style,
  labelFontSize = 12,
  labelFontWeight = 700,
  labelColor = "#fff",
  padding = 16,
  lineHeight = 1.2,
}: ActivityShapeProps) {
  const [dimensions, setDimensions] = useState({
    width: minWidth,
    height: minHeight,
  });

  useLayoutEffect(() => {
    // Create a temporary span to measure text
    const tempSpan = document.createElement("span");
    tempSpan.style.fontSize = `${labelFontSize}px`;
    tempSpan.style.fontWeight =
      typeof labelFontWeight === "number" ? labelFontWeight.toString() : labelFontWeight;
    tempSpan.style.fontFamily = "system-ui, -apple-system, sans-serif";
    tempSpan.style.position = "absolute";
    tempSpan.style.whiteSpace = "nowrap"; // Single line, no wrapping
    tempSpan.style.visibility = "hidden";
    tempSpan.style.left = "-9999px"; // Move off-screen
    tempSpan.textContent = name;

    document.body.appendChild(tempSpan);

    // Get text dimensions
    const textWidth = tempSpan.offsetWidth;
    const textHeight = tempSpan.offsetHeight;

    // Calculate required dimensions - no ellipsis, show full text
    const requiredWidth = Math.max(minWidth, textWidth + padding * 2);
    const requiredHeight = Math.max(minHeight, textHeight + padding * 2);

    setDimensions({
      width: requiredWidth,
      height: requiredHeight,
    });

    // Clean up
    document.body.removeChild(tempSpan);
  }, [name, minWidth, minHeight, padding, labelFontSize, labelFontWeight]);

  const { width, height } = dimensions;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        boxSizing: "content-box",
        userSelect: "none",
        cursor: "default",
        width: width,
        height: height,
        minWidth: minWidth,
        minHeight: minHeight,
        ...style,
      }}
      title={name}
      aria-label={name}
    >
      {/* Activity rectangle SVG */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          display: "block",
          overflow: "visible",
          pointerEvents: "none",
        }}
        aria-hidden
        focusable={false}
      >
        {/* Rounded rectangle for activity */}
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={width - strokeWidth}
          height={height - strokeWidth}
          rx={cornerRadius}
          ry={cornerRadius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Text label - positioned absolutely over the SVG */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `calc(100% - ${padding * 2}px)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          pointerEvents: "none",
          textAlign: "center",
          padding: `${padding}px`,
        }}
      >
        <span
          style={{
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
            color: labelColor,
            lineHeight: lineHeight,
            whiteSpace: "nowrap", // Single line, no wrapping
            overflow: "visible", // Show all text
            textOverflow: "clip", // No ellipsis
            maxWidth: "none", // No max width constraint
            display: "block",
          }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
