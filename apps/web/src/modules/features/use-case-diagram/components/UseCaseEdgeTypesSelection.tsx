"use client";

import Dialog from "@/components/Dialog";
import { EdgeType } from "@repo/shared-schemas";

export type UseCaseEdgeType = EdgeType.EXTENDS | EdgeType.INCLUDES;

interface UseCaseEdgeTypesSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onUseCaseEdgeTypesClick: (type: UseCaseEdgeType) => void;
}

export default function UseCaseEdgeTypesSelection({
  isOpen,
  onClose,
  onUseCaseEdgeTypesClick,
}: UseCaseEdgeTypesSelectionProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Select Use Case Relationship Type"
      className="max-w-lg mb-2"
    >
      <div className="space-y-3 p-1 " style={{ marginTop: "1rem" }}>
        {/* INCLUDE Path */}
        <button
          onClick={() => {
            onUseCaseEdgeTypesClick(EdgeType.INCLUDES);
            onClose();
          }}
          className={`w-full flex flex-col items-center justify-center p-6 border border-border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-green-50 hover:text-green-700 focus:ring-green-500`}
        >
          <div className="text-center">
            <div className={`font-medium text-sm`}>{EdgeType.INCLUDES}</div>
          </div>
        </button>

        {/* EXTEND Path */}
        <button
          onClick={() => {
            onUseCaseEdgeTypesClick(EdgeType.EXTENDS);
            onClose();
          }}
          className={`w-full flex flex-col items-center justify-center p-6 border border-border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500`}
        >
          <div className="text-center">
            <div className={`font-medium text-sm text-blue-600`}>{EdgeType.EXTENDS}</div>
          </div>
        </button>
      </div>
    </Dialog>
  );
}
