import { UseCaseShape } from "@/modules/features/use-case-diagram/components/UseCaseShape";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useMemo, useState } from "react";

export default function UseCaseNode({ data, selected }: NodeProps<any>) {
  const name = data.name ?? "UseCase was deleted";
  const isDeleted = !data.name;

  // hover state (controls handle visibility)
  const [hovered, setHovered] = useState(false);

  // Calculate dimensions to position handles correctly (same logic as UseCase component)
  const { svgWidth, svgHeight } = useMemo(() => {
    const maxWidth = 200;
    const minWidth = 100;
    const paddingX = 28;
    const paddingY = 14;
    const fontSize = 14;
    const lineHeight = 20;

    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const width = Math.max(minWidth, textWidth);
    const height = lines * lineHeight + paddingY * 2;

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
        id="left-use-case-target"
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
        id="left-use-case-source"
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
        id="right-use-case-target"
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
        id="right-use-case-source"
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

      <UseCaseShape name={name} selected={selected} isDeleted={isDeleted} />
    </div>
  );
}
