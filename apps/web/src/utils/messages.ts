import { NodeType, DiagramType, EdgeType } from "@repo/shared-schemas";

const nodeLabels: Record<NodeType, string> = {
  [NodeType.ACTOR]: "Actor",
  [NodeType.USE_CASE]: "Use case",
  [NodeType.ACTIVITY]: "Activity",
  [NodeType.DECISION_NODE]: "Decision node",
  [NodeType.INITIAL_NODE]: "Initial node",
  [NodeType.FINAL_NODE]: "Final node",
  [NodeType.FORK_NODE]: "Fork node",
  [NodeType.MERGE_NODE]: "Merge node",
  [NodeType.JOIN_NODE]: "Join node",
  [NodeType.FLOW_FINAL_NODE]: "Flow final node",
};

const diagramLabels: Record<DiagramType, string> = {
  [DiagramType.USE_CASE]: "Use case diagram",
  [DiagramType.ACTIVITY]: "Activity diagram",
  [DiagramType.SEQUENCE]: "Sequence diagram",
  [DiagramType.CLASS]: "Class diagram",
  [DiagramType.STATE]: "State diagram",
};

const edgeLabels: Record<EdgeType, string> = {
  [EdgeType.CONTROL_FLOW]: "Control flow",
  [EdgeType.EXTENDS]: "Extends relation",
  [EdgeType.INCLUDES]: "Includes relation",
  [EdgeType.TRUE]: "True branch",
  [EdgeType.FALSE]: "False branch",
  [EdgeType.ASSOCIATION]: "Association",
  [EdgeType.ACTIVITY_FLOW]: "Activity flow",
};

export function getCreationMessage(
  type: NodeType | DiagramType | EdgeType,
  name?: string,
): string | null {
  // Return null for cases where we don't want to show a message (adding existing nodes)
  if (!name) {
    return null;
  }

  const label =
    nodeLabels[type as NodeType] ??
    diagramLabels[type as DiagramType] ??
    edgeLabels[type as EdgeType] ??
    "Item";

  return `${label} "${name}" created successfully!`;
}
