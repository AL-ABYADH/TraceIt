// // // "use client";

// // // import React from "react";
// // // import type { EdgeProps } from "@xyflow/react";

// // // export default function TrueEdge(props: EdgeProps) {
// // //   const { id, selected, sourceX, sourceY, targetX, targetY, style = {} } = props;

// // //   const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
// // //   const midX = (sourceX + targetX) / 2;
// // //   const midY = (sourceY + targetY) / 2;

// // //   const markerId = `true-arrow-${id}`;
// // //   const stroke = selected ? "#16a34a" : "#22c55e"; // Green colors

// // //   return (
// // //     <g className="react-flow__edge">
// // //       <defs>
// // //         <marker
// // //           id={markerId}
// // //           markerWidth="12"
// // //           markerHeight="12"
// // //           refX="10"
// // //           refY="6"
// // //           orient="auto"
// // //           markerUnits="strokeWidth"
// // //         >
// // //           <path d="M 0 0 L 10 6 L 0 12" fill="none" stroke={stroke} strokeWidth={1.5} />
// // //         </marker>
// // //       </defs>

// // //       <path
// // //         id={id}
// // //         d={d}
// // //         fill="none"
// // //         stroke={stroke}
// // //         strokeWidth={1.5}
// // //         markerEnd={`url(#${markerId})`}
// // //         style={style}
// // //       />

// // //       <text
// // //         x={midX}
// // //         y={midY - 8}
// // //         textAnchor="middle"
// // //         fontSize={11}
// // //         fontFamily="sans-serif"
// // //         fill={stroke}
// // //         fontWeight="500"
// // //         pointerEvents="none"
// // //         style={{ userSelect: "none" }}
// // //       >
// // //         TRUE
// // //       </text>
// // //     </g>
// // //   );
// // // }

// // "use client";

// // import React from "react";
// // import type { EdgeProps } from "@xyflow/react";
// // import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";

// // export default function TrueEdge(props: EdgeProps) {
// //   const {
// //     id,
// //     sourceX,
// //     sourceY,
// //     targetX,
// //     targetY,
// //     sourcePosition,
// //     targetPosition,
// //     style = {},
// //     markerEnd,
// //     selected,
// //   } = props;

// //   const [edgePath, labelX, labelY] = getBezierPath({
// //     sourceX,
// //     sourceY,
// //     sourcePosition,
// //     targetX,
// //     targetY,
// //     targetPosition,
// //   });

// //   const stroke = selected ? "#16a34a" : "#22c55e";

// //   return (
// //     <>
// //       <BaseEdge
// //         id={id}
// //         path={edgePath}
// //         markerEnd={markerEnd}
// //         style={{
// //           ...style,
// //           stroke,
// //           strokeWidth: 2,
// //         }}
// //       />
// //       <EdgeLabelRenderer>
// //         <div
// //           style={{
// //             position: "absolute",
// //             transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
// //             fontSize: 12,
// //             fontWeight: 600,
// //             fontFamily: "sans-serif",
// //             color: stroke,
// //             pointerEvents: "all",
// //           }}
// //           className="nodrag nopan"
// //         >
// //           <div
// //             style={{
// //               background: "white",
// //               padding: "2px 6px",
// //               borderRadius: "4px",
// //               border: `1px solid ${stroke}`,
// //               boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
// //             }}
// //           >
// //             TRUE
// //           </div>
// //         </div>
// //       </EdgeLabelRenderer>
// //     </>
// //   );
// // }

// "use client";

// import React from "react";
// import type { EdgeProps } from "@xyflow/react";
// import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";

// export default function TrueEdge(props: EdgeProps) {
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

//   // Consistent with project's color scheme - using blue tones like other selected elements
//   const stroke = selected ? "#3b82f6" : "#22c55e"; // Blue when selected, green when not
//   const strokeWidth = selected ? 2.5 : 2;

//   return (
//     <>
//       <BaseEdge
//         id={id}
//         path={edgePath}
//         markerEnd={markerEnd}
//         style={{
//           ...style,
//           stroke,
//           strokeWidth,
//         }}
//       />
//       <EdgeLabelRenderer>
//         <div
//           style={{
//             position: "absolute",
//             transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
//             fontSize: 11,
//             fontWeight: 600,
//             fontFamily: "system-ui, sans-serif",
//             color: stroke,
//             pointerEvents: "all",
//           }}
//           className="nodrag nopan"
//         >
//           <div
//             style={{
//               background: "#fff",
//               padding: "2px 8px",
//               borderRadius: "4px",
//               border: `1px solid ${stroke}`,
//               boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             TRUE
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

export default function TrueEdge(props: EdgeProps) {
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

  const stroke = selected ? "#3b82f6" : "#22c55e";
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
            TRUE
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
