import type React from "react";
import type { NodeProps, EdgeProps, NodeTypes, EdgeTypes } from "@xyflow/react";
import UseCaseNode from "./components/nodes/UseCaseNode";
import IncludesEdge from "./components/edges/IncludesEdge";
import ExtendsEdge from "./components/edges/ExtendsEdge";
import { EdgeType, NodeType } from "@repo/shared-schemas";
import { register } from "module";
import ActorNode from "./components/nodes/ActorNode";
import AssociationEdge from "./components/edges/AssociationEdge";

export type NodeComponent = React.ComponentType<NodeProps<any>>;
export type EdgeComponent = React.ComponentType<EdgeProps<any>>;

const nodeMap = new Map<NodeType, NodeComponent>();
const edgeMap = new Map<EdgeType, EdgeComponent>();

export function registerNode(type: NodeType, comp: NodeComponent) {
  nodeMap.set(type, comp);
}

export function registerEdge(type: EdgeType, comp: EdgeComponent) {
  edgeMap.set(type, comp);
}

/**
 * Build and return the NodeTypes object expected by React Flow.
 * We create a fresh object and assert it to NodeTypes. This avoids the
 * incompatible index-signature error while still preserving type-safety
 * at registration time.
 */
export function getNodeTypesForReactFlow(): NodeTypes {
  const out = {} as NodeTypes;

  for (const [k, v] of nodeMap.entries()) {
    // NodeTypes uses string keys; enums may be numeric/string — force string
    out[String(k)] = v as unknown as NodeTypes[string];
  }

  return out;
}

export function getEdgeTypesForReactFlow(): EdgeTypes {
  const out = {} as EdgeTypes;

  for (const [k, v] of edgeMap.entries()) {
    out[String(k)] = v as unknown as EdgeTypes[string];
  }

  return out;
}

// Nodes
registerNode(NodeType.USE_CASE, UseCaseNode);
registerNode(NodeType.ACTOR, ActorNode);

// Edges
registerEdge(EdgeType.EXTENDS, ExtendsEdge);
registerEdge(EdgeType.INCLUDES, IncludesEdge);
registerEdge(EdgeType.ASSOCIATION, AssociationEdge);
