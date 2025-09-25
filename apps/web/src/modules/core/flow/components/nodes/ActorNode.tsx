"use client";

import React, { useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import ActorShape from "@/modules/features/use-case-diagram/components/ActorShape";

export default function ActorNode({ data }: NodeProps<any>) {
  const name = data?.name ?? "Actor";

  // hover state for handles
  const [hovered, setHovered] = useState(false);
  const handlesVisible = hovered;

  const transition = "opacity 180ms ease, transform 180ms cubic-bezier(.2,.8,.2,1)";
  const handleTop = 32;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        boxSizing: "content-box",
        userSelect: "none",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))",
        paddingTop: 0,
      }}
      data-id={data?.name ?? undefined}
      title={name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{
          left: 2,
          top: handleTop,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: handlesVisible ? "translateX(-8px)" : "translateX(0)",
          transition,
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          left: 2,
          top: handleTop,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: handlesVisible ? "translateX(-8px)" : "translateX(0)",
          transition,
        }}
      />

      {/* Right handles */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          right: 2,
          top: handleTop,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: handlesVisible ? "translateX(8px)" : "translateX(0)",
          transition,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          right: 2,
          top: handleTop,
          background: "white",
          border: "none",
          opacity: handlesVisible ? 1 : 0,
          pointerEvents: handlesVisible ? "auto" : "none",
          transform: handlesVisible ? "translateX(8px)" : "translateX(0)",
          transition,
        }}
      />

      <ActorShape name={name} />
    </div>
  );
}
