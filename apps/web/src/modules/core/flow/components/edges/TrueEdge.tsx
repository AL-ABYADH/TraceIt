// "use client";

// import React from "react";
// import type { EdgeProps } from "@xyflow/react";
// import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "@xyflow/react";
// import {
//   DecisionNodeData,
//   getDecisionNodeName,
//   isConditionDto,
//   isRequirementExceptionDto,
// } from "@/types/decision-node-types";

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
//     source,
//   } = props;

//   const { getNode } = useReactFlow();

//   // Get the source node to access its data
//   const sourceNode = getNode(source);

//   // Determine label and color based on source node data
//   let label = "TRUE";
//   let baseColor = "#28a745"; // CONDITION TRUE -> green

//   if (sourceNode?.data) {
//     try {
//       const nodeData = sourceNode.data as DecisionNodeData;
//       label = getDecisionNodeName(nodeData); // Gets the actual condition/exception text

//       // Color mapping for TRUE edge
//       if (isRequirementExceptionDto(nodeData)) {
//         baseColor = "#dc3545"; // EXCEPTION TRUE -> red
//       } else if (isConditionDto(nodeData)) {
//         baseColor = "#28a745"; // CONDITION TRUE -> green
//       }
//     } catch (error) {
//       console.warn("Failed to process decision node data:", error);
//     }
//   }

//   // Calculate edge path
//   const [edgePath, pathLabelX, pathLabelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   });

//   // Position condition/exception label along TRUE edge path (30% from source)
//   const edgeProgress = 0.3;
//   const labelX = sourceX + (pathLabelX - sourceX) * edgeProgress;
//   const labelY = sourceY + (pathLabelY - sourceY) * edgeProgress - 15; // 15px above the path

//   const stroke = selected ? "#3b82f6" : baseColor;
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
//             transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
//             pointerEvents: "all",
//             zIndex: 1000,
//           }}
//           className="nodrag nopan"
//         >
//           <div
//             style={{
//               fontSize: "9px",
//               fontWeight: 500,
//               fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
//               color: "#ffffff",
//               background: "#000000",
//               padding: "1px 6px",
//               borderRadius: "3px",
//               border: "1px solid #d0d0d0",
//               boxShadow: selected
//                 ? "0 2px 8px rgba(59, 130, 246, 0.3), 0 0 0 2px rgba(59, 130, 246, 0.2)"
//                 : "0 1px 3px rgba(0, 0, 0, 0.12)",
//               display: "inline-block",
//               maxWidth: "200px",
//               textAlign: "left",
//               whiteSpace: "nowrap",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               cursor: "default",
//               userSelect: "none",
//               transition: "all 0.15s ease",
//             }}
//             title={label}
//           >
//             [{label}]
//           </div>
//         </div>
//       </EdgeLabelRenderer>
//     </>
//   );
// }

"use client";

import React from "react";
import type { EdgeProps } from "@xyflow/react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "@xyflow/react";
import {
  DecisionNodeData,
  getDecisionNodeName,
  isConditionDto,
  isRequirementExceptionDto,
} from "@/types/decision-node-types";

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
    source,
  } = props;

  const { getNode } = useReactFlow();

  // Get the source node to access its data
  const sourceNode = getNode(source);

  // Determine label and color based on source node data
  let label = "TRUE";
  let baseColor = "#fff";
  let isDeleted = false;

  if (sourceNode?.data) {
    try {
      const nodeData = sourceNode.data as DecisionNodeData;

      // Color mapping for TRUE edge
      if (isRequirementExceptionDto(nodeData)) {
        baseColor = "#fff"; // EXCEPTION TRUE -> red
      } else if (isConditionDto(nodeData)) {
        baseColor = "#fff"; // CONDITION TRUE -> green
      }
    } catch (error) {
      console.warn("Failed to process decision node data:", error);
      // If data processing fails, consider it deleted
      isDeleted = true;
      label = "Node was deleted";
      baseColor = "#dc3545";
    }
  } else {
    // If no data at all, consider it deleted
    isDeleted = true;
    label = "Node was deleted";
    baseColor = "#dc3545";
  }

  // Calculate edge path
  const [edgePath, pathLabelX, pathLabelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Position condition/exception label along TRUE edge path (30% from source)
  const edgeProgress = 0.3;
  const labelX = sourceX + (pathLabelX - sourceX) * edgeProgress;
  const labelY = sourceY + (pathLabelY - sourceY) * edgeProgress - 15; // 15px above the path

  const stroke = selected ? "#3b82f6" : baseColor;
  const strokeWidth = 2.5;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={"url(#arrowhead-activity-default)"}
        style={{
          ...style,
          stroke,
          strokeWidth,
        }}
      />
      {/* Arrowhead definitions */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <marker
            id="arrowhead-activity-default"
            markerUnits="strokeWidth"
            orient="auto"
            refX={8}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            viewBox="0 0 10 10"
          >
            {/* Outer arrow (fill follows currentColor, slight outline for contrast) */}
            <path
              d="M1,1 L9,5 L1,9 L3,5 Z"
              fill="currentColor"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="0.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* small inner highlight to give a subtle 3D feel (optional) */}
            <path d="M2.2,4.6 L6.2,5 L2.2,5.4 L3.2,5 Z" fill="rgba(255,255,255,0.12)" />
          </marker>
        </defs>
      </svg>
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 500,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
              color: "#ffffff",
              background: isDeleted ? "#dc3545" : "#000000", // Red background for deleted edges
              padding: "1px 6px",
              borderRadius: "3px",
              border: isDeleted ? "1px solid #ff6b6b" : "1px solid #d0d0d0",
              boxShadow: selected
                ? "0 2px 8px rgba(59, 130, 246, 0.3), 0 0 0 2px rgba(59, 130, 246, 0.2)"
                : isDeleted
                  ? "0 1px 3px rgba(220, 53, 69, 0.3)"
                  : "0 1px 3px rgba(0, 0, 0, 0.12)",
              display: "inline-block",
              maxWidth: "200px",
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "default",
              userSelect: "none",
              transition: "all 0.15s ease",
            }}
            title={label}
          >
            [{label}]
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
