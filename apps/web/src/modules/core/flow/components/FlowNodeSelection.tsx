"use client";

import type { ComponentType } from "react";
import Dialog from "@/components/Dialog";
import { DiagramType, NodeType } from "@repo/shared-schemas";
import UseCaseDiagramNodeTypes from "../../../features/use-case-diagram/components/UseCaseDiagramNodeTypes";
import ActivityDiagramNodeTypes from "@/modules/features/activity-diagram/components/ActivityDiagramNodeTypes";

interface FlowNodeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  type: DiagramType;
  onClick: (nodeType: NodeType) => void;
}

type NodeSelectionComponentProps = {
  onClose: () => void;
  onClick: (nodeType: NodeType) => void;
};

/**
 * Map diagram type -> React component that renders options for that diagram.
 * Use Partial<> if not all DiagramType values have a component yet.
 */
const diagramNodesMap: Partial<Record<DiagramType, ComponentType<NodeSelectionComponentProps>>> = {
  [DiagramType.USE_CASE]: UseCaseDiagramNodeTypes,
  [DiagramType.ACTIVITY]: ActivityDiagramNodeTypes,
};

export default function FlowNodeSelection({
  isOpen,
  onClose,
  type,
  onClick,
}: FlowNodeSelectionProps) {
  const Component = diagramNodesMap[type]!;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Diagram Object" className="max-w-lg">
      <Component onClose={onClose} onClick={onClick} />
    </Dialog>
  );
}
