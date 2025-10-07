"use client";

import Dialog from "@/components/Dialog";
import { useSelector } from "react-redux";
import { selectEdges, selectNodes } from "@/modules/core/flow/store/flow-slice";
import { EdgeType } from "@repo/shared-schemas";
import { isRequirementExceptionDto } from "@/types/decision-node-types";

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

  // Determine whether the source node is an exception decision or a condition decision
  const sourceNode = nodes.find((n) => n.id === sourceNodeId);
  const isExceptionDecision = (() => {
    const data = sourceNode?.data as any;
    return data ? isRequirementExceptionDto(data) : false;
  })();

  // Descriptive labels depending on decision type
  const trueLabel = isExceptionDecision ? "Exception occurs" : "Condition met";
  const falseLabel = isExceptionDecision ? "Otherwise" : "Condition not met";
  const dialogTitle = "Select Decision Outcome";
  const trueSubtext = isExceptionDecision
    ? "When the exception applies, follow this path"
    : "When the condition is satisfied, follow this path";
  const falseSubtext = isExceptionDecision
    ? "When the exception does not apply, follow this path"
    : "When the condition is not satisfied, follow this path";

  // Check if TRUE edge already exists from this decision node
  const hasTrueEdge = edges.some(
    (edge) => edge.source === sourceNodeId && edge.type === EdgeType.TRUE,
  );

  // Check if FALSE edge already exists from this decision node
  const hasFalseEdge = edges.some(
    (edge) => edge.source === sourceNodeId && edge.type === EdgeType.FALSE,
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={dialogTitle} className="max-w-md">
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
              {trueLabel} {hasTrueEdge && "(already used)"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {hasTrueEdge ? `${trueLabel} path already exists` : trueSubtext}
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
              {falseLabel} {hasFalseEdge && "(already used)"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {hasFalseEdge ? `${falseLabel} path already exists` : falseSubtext}
            </div>
          </div>
        </button>

        <div className="text-xs text-muted-foreground text-center border-t pt-3">
          {hasTrueEdge &&
            hasFalseEdge &&
            (isExceptionDecision
              ? "Both outcome paths are already defined for this exception"
              : "Both outcome paths are already defined for this condition")}
        </div>
      </div>
    </Dialog>
  );
}
