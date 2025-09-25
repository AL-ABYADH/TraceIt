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
      className="max-w-lg"
    >
      <button
        onClick={() => {
          onUseCaseEdgeTypesClick(EdgeType.EXTENDS);
          onClose();
        }}
      >
        {EdgeType.EXTENDS}
      </button>
      <button
        onClick={() => {
          onUseCaseEdgeTypesClick(EdgeType.INCLUDES);
          onClose();
        }}
      >
        {EdgeType.INCLUDES}
      </button>
    </Dialog>
  );
}
