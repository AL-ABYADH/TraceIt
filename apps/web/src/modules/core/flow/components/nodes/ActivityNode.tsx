import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useMemo, useState } from "react";
import { ActivityShape } from "@/modules/features/activity-diagram/components/ActivityShape";

export default function ActivityNode({ data, selected }: NodeProps<any>) {
  const name = data?.name ?? "Activity";

  // hover state (controls handle visibility)
  const [hovered, setHovered] = useState(false);

  // Calculate dimensions to position handles correctly (same logic as ActivityShape)
  const { svgWidth, svgHeight } = useMemo(() => {
    const maxWidth = 200;
    const minWidth = 120;
    const paddingX = 32;
    const paddingY = 20;
    const fontSize = 14;
    const lineHeight = 20;

    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const width = Math.max(minWidth, textWidth);
    const height = Math.max(60, lines * lineHeight + paddingY * 2); // Minimum height for activity node

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
          left: handlesVisible ? -5 : 0,
          top: svgHeight / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          left: handlesVisible ? -5 : 0,
          top: svgHeight / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
        }}
      />

      {/* RIGHT HANDLES */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          right: handlesVisible ? -5 : 0,
          top: svgHeight / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          right: handlesVisible ? -5 : 0,
          top: svgHeight / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateY(-50%)",
        }}
      />

      {/* TOP HANDLES */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{
          top: handlesVisible ? -5 : 0,
          left: svgWidth / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          top: handlesVisible ? -5 : 0,
          left: svgWidth / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
        }}
      />

      {/* BOTTOM HANDLES */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={{
          bottom: handlesVisible ? -5 : 0,
          left: svgWidth / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          bottom: handlesVisible ? -5 : 0,
          left: svgWidth / 2,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: "translateX(-50%)",
        }}
      />

      <ActivityShape name={name} selected={selected} />
    </div>
  );
}
