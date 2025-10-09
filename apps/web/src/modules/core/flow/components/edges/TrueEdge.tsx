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

  // Determine label based on source node data
  let label = "TRUE";
  let isDeleted = false;

  if (sourceNode?.data) {
    try {
      const nodeData = sourceNode.data as DecisionNodeData;

      // Check if the node is deleted (no name)
      isDeleted = !sourceNode.data.name;

      if (isDeleted) {
        // Set appropriate deletion message based on node type
        if (isRequirementExceptionDto(nodeData)) {
          label = "Exception was deleted";
        } else if (isConditionDto(nodeData)) {
          label = "Condition was deleted";
        } else {
          label = "Decision was deleted";
        }
      } else {
        label = getDecisionNodeName(nodeData); // Gets the actual condition/exception text
      }
    } catch (error) {
      console.warn("Failed to process decision node data:", error);
      // If data processing fails, consider it deleted
      isDeleted = true;
      label = "Node was deleted";
    }
  } else {
    // If no data at all, consider it deleted
    isDeleted = true;
    label = "Node was deleted";
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

  // All edges are white with consistent stroke width
  const stroke = "#ffffff";
  const strokeWidth = 2;

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
            {/* White arrowhead */}
            <path
              d="M1,1 L9,5 L1,9 L3,5 Z"
              fill="#ffffff"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="0.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
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
              border: isDeleted ? "1px solid #dc3545" : "1px solid #ffffff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
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
