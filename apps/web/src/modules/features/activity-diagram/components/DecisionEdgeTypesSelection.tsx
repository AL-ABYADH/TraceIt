"use client";

import Dialog from "@/components/Dialog";
import { useSelector } from "react-redux";
import { selectEdges, selectNodes } from "@/modules/core/flow/store/flow-slice";
import { EdgeType, NodeType } from "@repo/shared-schemas";

export type DecisionEdgeType = "TRUE" | "FALSE";

interface ConditionEdgeTypesSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onDecisionEdgeTypesClick: (type: DecisionEdgeType) => void;
  sourceNodeId?: string; // Add source node ID to check existing edges
}

export default function ConditionEdgeTypesSelection({
  isOpen,
  onClose,
  onDecisionEdgeTypesClick,
  sourceNodeId,
}: ConditionEdgeTypesSelectionProps) {
  const edges = useSelector(selectEdges);
  const nodes = useSelector(selectNodes);

  // Check if TRUE edge already exists from this condition node
  const hasTrueEdge = edges.some(
    (edge) => edge.source === sourceNodeId && edge.type === EdgeType.TRUE,
  );

  // Check if FALSE edge already exists from this condition node
  const hasFalseEdge = edges.some(
    (edge) => edge.source === sourceNodeId && edge.type === EdgeType.FALSE,
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Select Condition Outcome" className="max-w-md">
      <div className="space-y-3 p-1">
        <div className="text-sm text-muted-foreground text-center">
          Choose the outcome path for this condition
        </div>

        {/* TRUE Path */}
        <button
          onClick={() => {
            onDecisionEdgeTypesClick("TRUE");
            onClose();
          }}
          disabled={hasTrueEdge}
          className={`w-full flex flex-col items-center justify-center p-6 border border-border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            hasTrueEdge
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-green-50 hover:text-green-700 focus:ring-green-500"
          }`}
        >
          <div className="text-center">
            <div
              className={`font-medium text-sm ${hasTrueEdge ? "text-gray-400" : "text-green-600"}`}
            >
              TRUE {hasTrueEdge && "(Already Used)"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {hasTrueEdge
                ? "TRUE path already exists from this condition"
                : "Condition is met - follow this path"}
            </div>
          </div>
        </button>

        {/* FALSE Path */}
        <button
          onClick={() => {
            onDecisionEdgeTypesClick("FALSE");
            onClose();
          }}
          disabled={hasFalseEdge}
          className={`w-full flex flex-col items-center justify-center p-6 border border-border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            hasFalseEdge
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-red-50 hover:text-red-700 focus:ring-red-500"
          }`}
        >
          <div className="text-center">
            <div
              className={`font-medium text-sm ${hasFalseEdge ? "text-gray-400" : "text-red-600"}`}
            >
              FALSE {hasFalseEdge && "(Already Used)"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {hasFalseEdge
                ? "FALSE path already exists from this condition"
                : "Condition is not met - follow this path"}
            </div>
          </div>
        </button>

        <div className="text-xs text-muted-foreground text-center border-t pt-3">
          {
            hasTrueEdge &&
              hasFalseEdge &&
              "Both TRUE and FALSE paths are already defined for this condition"
            // : "TRUE paths execute when the condition is satisfied, FALSE paths when it's not."
          }
        </div>
      </div>
    </Dialog>
  );
}
