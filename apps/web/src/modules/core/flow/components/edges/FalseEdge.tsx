// // "use client";

// // import React from "react";
// // import type { EdgeProps } from "@xyflow/react";

// // export default function FalseEdge(props: EdgeProps) {
// //   const { id, selected, sourceX, sourceY, targetX, targetY, style = {} } = props;

// //   const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
// //   const midX = (sourceX + targetX) / 2;
// //   const midY = (sourceY + targetY) / 2;

// //   const markerId = `false-arrow-${id}`;
// //   const stroke = selected ? "#dc2626" : "#ef4444"; // Red colors

// //   return (
// //     <g className="react-flow__edge">
// //       <defs>
// //         <marker
// //           id={markerId}
// //           markerWidth="12"
// //           markerHeight="12"
// //           refX="10"
// //           refY="6"
// //           orient="auto"
// //           markerUnits="strokeWidth"
// //         >
// //           <path d="M 0 0 L 10 6 L 0 12" fill="none" stroke={stroke} strokeWidth={1.5} />
// //         </marker>
// //       </defs>

// //       <path
// //         id={id}
// //         d={d}
// //         fill="none"
// //         stroke={stroke}
// //         strokeWidth={1.5}
// //         strokeDasharray="4,2"
// //         markerEnd={`url(#${markerId})`}
// //         style={style}
// //       />

// //       <text
// //         x={midX}
// //         y={midY - 8}
// //         textAnchor="middle"
// //         fontSize={11}
// //         fontFamily="sans-serif"
// //         fill={stroke}
// //         fontWeight="500"
// //         pointerEvents="none"
// //         style={{ userSelect: "none" }}
// //       >
// //         FALSE
// //       </text>
// //     </g>
// //   );
// // }

// "use client";

// import React from "react";
// import type { EdgeProps } from "@xyflow/react";
// import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";

// export default function FalseEdge(props: EdgeProps) {
//   const {
//     id,
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     sourcePosition,
//     targetPosition,
//     style = {},
//     markerEnd,
//     selected,
//   } = props;

//   const [edgePath, labelX, labelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   });

//   const stroke = selected ? "#dc2626" : "#ef4444";

//   return (
//     <>
//       <BaseEdge
//         id={id}
//         path={edgePath}
//         markerEnd={markerEnd}
//         style={{
//           ...style,
//           stroke,
//           strokeWidth: 2,
//           strokeDasharray: "4,2",
//         }}
//       />
//       <EdgeLabelRenderer>
//         <div
//           style={{
//             position: "absolute",
//             transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
//             fontSize: 12,
//             fontWeight: 600,
//             fontFamily: "sans-serif",
//             color: stroke,
//             pointerEvents: "all",
//           }}
//           className="nodrag nopan"
//         >
//           <div
//             style={{
//               background: "white",
//               padding: "2px 6px",
//               borderRadius: "4px",
//               border: `1px solid ${stroke}`,
//               boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//             }}
//           >
//             FALSE
//           </div>
//         </div>
//       </EdgeLabelRenderer>
//     </>
//   );
// }
"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";

export default function FalseEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
  } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const stroke = selected ? "#dc2626" : "#ef4444";
  const strokeWidth = selected ? 2.5 : 2;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke,
          strokeWidth,
          // Removed strokeDasharray to make it a straight solid line
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "system-ui, sans-serif",
            color: "#fff", // White text
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <div
            style={{
              background: "#000", // Black background
              padding: "2px 8px",
              borderRadius: "4px",
              border: `1px solid #fff`, // White border
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            FALSE
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
