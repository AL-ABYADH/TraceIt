import React, { useMemo } from "react";

export interface ActorShapeProps {
  name: string;
  selected?: boolean;
  actorBodyWidth?: number;
  actorBodyHeight?: number;
  headR?: number;
  headPaddingTop?: number;
  bodyLength?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  labelFontSize?: number;
  labelFontWeight?: number | string;
  labelColor?: string;
  labelGap?: number;
  labelLineHeight?: number;
}

export default function ActorShape({
  name,
  selected = false,
  actorBodyWidth = 60,
  actorBodyHeight = 86,
  headR = 12,
  headPaddingTop = 6,
  bodyLength = 22,
  stroke = selected ? "var(--primary)" : "#fff",
  strokeWidth = 2,
  className,
  style,
  labelFontSize = 12,
  labelFontWeight = 700,
  labelColor = "#fff",
  labelGap = 6,
  labelLineHeight = 16,
}: ActorShapeProps) {
  // Calculate text height based on how many lines will be needed
  const textHeight = useMemo(() => {
    // Rough character width estimation for the font size
    const avgCharWidth = labelFontSize * 0.6;
    const maxCharsPerLine = Math.floor(actorBodyWidth / avgCharWidth);

    // Estimate number of lines needed
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));

    return lines * labelLineHeight;
  }, [name, actorBodyWidth, labelFontSize, labelLineHeight]);

  const armsY = headPaddingTop + headR * 2 + 6;
  const legYStart = headPaddingTop + headR * 2 + bodyLength;
  const totalHeight = actorBodyHeight + labelGap + textHeight;

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        width: actorBodyWidth,
        height: totalHeight,
        position: "relative",
        boxSizing: "content-box",
        userSelect: "none",
        cursor: "default",
        ...style,
      }}
      title={name}
      aria-label={name}
    >
      {/* Actor body SVG */}
      <svg
        width={actorBodyWidth}
        height={actorBodyHeight}
        viewBox={`0 0 ${actorBodyWidth} ${actorBodyHeight}`}
        style={{
          display: "block",
          position: "absolute",
          left: 0,
          top: 0,
          overflow: "visible",
          pointerEvents: "none",
        }}
        aria-hidden
        focusable={false}
      >
        <g transform={`translate(${actorBodyWidth / 2}, 0)`}>
          {/* Head */}
          <circle
            cx={0}
            cy={headPaddingTop + headR}
            r={headR}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          {/* Body */}
          <line
            x1={0}
            y1={headPaddingTop + headR * 2}
            x2={0}
            y2={headPaddingTop + headR * 2 + bodyLength}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Arms */}
          <line
            x1={-20}
            y1={armsY}
            x2={20}
            y2={armsY}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Legs */}
          <line
            x1={0}
            y1={legYStart}
            x2={-18}
            y2={legYStart + 30}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={0}
            y1={legYStart}
            x2={18}
            y2={legYStart + 30}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Label (under the actor, constrained to actor body width) */}
      <div
        style={{
          position: "absolute",
          top: actorBodyHeight + labelGap,
          left: 0,
          width: actorBodyWidth,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          pointerEvents: "auto",
        }}
      >
        <span
          style={{
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
            color: labelColor,
            lineHeight: `${labelLineHeight}px`,
            textAlign: "center",
            whiteSpace: "normal",
            wordBreak: "break-word",
            width: "100%",
          }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
