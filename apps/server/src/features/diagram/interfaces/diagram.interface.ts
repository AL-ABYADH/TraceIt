import { DiagramType, EdgeType, NodeType } from "@repo/shared-schemas";

export interface DiagramInterface {
  projectId: string;
  name?: string;
  type: DiagramType;
}

export interface EdgeInterface {
  id: string;
  type: EdgeType;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  zIndex?: number;
  data?: any;
}

export interface NodeInterface {
  id: string;
  type: NodeType;
  position: string;
  width?: number;
  height?: number;
  zIndex?: number;
  data?: any;
}

export interface UpdateDiagramInterface {
  name?: string;
  nodes?: NodeInterface[];
  edges?: EdgeInterface[];
}
