import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useMemo, useState } from "react";
import { DecisionShape } from "@/modules/features/activity-diagram/components/DecisionShape";

export default function DecisionNode({ data, selected }: NodeProps<any>) {
  const name = data?.name ?? "Condition";

  // hover state (controls handle visibility)
  const [hovered, setHovered] = useState(false);

  // Calculate dimensions to position handles correctly
  const { svgWidth, svgHeight } = useMemo(() => {
    const maxWidth = 160; // Slightly smaller for elegance
    const minWidth = 100;
    const paddingX = 24;
    const paddingY = 16;
    const fontSize = 13;
    const lineHeight = 18;

    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const width = Math.max(minWidth, textWidth);
    const height = Math.max(80, lines * lineHeight + paddingY * 2); // Taller for better proportions

    return { svgWidth: width, svgHeight: height };
  }, [name]);

  // handles are visible only when hovered
  const handlesVisible = hovered || selected;

  return (
    <div
      style={{
        position: "relative",
        width: svgWidth,
        height: svgHeight,
        // filter: selected ? "drop-shadow(0 8px 24px rgba(59, 130, 246, 0.25))" : "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-id={data?.id ?? undefined}
      title={name}
    >
      {/* LEFT HANDLES */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{
          left: handlesVisible ? -6 : 0,
          top: svgHeight / 2,
          background: "white",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          left: handlesVisible ? -6 : 0,
          top: svgHeight / 2,
          background: "white",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />

      {/* RIGHT HANDLES */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          right: handlesVisible ? -6 : 0,
          top: svgHeight / 2,
          background: "white",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          right: handlesVisible ? -6 : 0,
          top: svgHeight / 2,
          background: "white",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />

      {/* TOP HANDLES */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{
          top: handlesVisible ? -6 : 0,
          left: svgWidth / 2,
          background: "white",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          top: handlesVisible ? -6 : 0,
          left: svgWidth / 2,
          background: "white",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />

      {/* BOTTOM HANDLES */}
      {/* <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={{
          bottom: handlesVisible ? -6 : 0,
          left: svgWidth / 2,
          background: "white",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          bottom: handlesVisible ? -6 : 0,
          left: svgWidth / 2,
          background: "white",
          border: "2px solid #94a3b8",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
          width: 12,
          height: 12,
          transition: "all 0.2s ease",
        }}
      /> */}

      <DecisionShape name={name} selected={selected} />
    </div>
  );
}
