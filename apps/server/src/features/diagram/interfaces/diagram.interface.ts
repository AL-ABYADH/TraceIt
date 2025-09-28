import { DiagramType, EdgeType, NodeType } from "@repo/shared-schemas";

export interface Position {
  x: number;
  y: number;
}

export interface DiagramInterface {
  projectId: string;
  name: string;
  type: DiagramType;
}

export interface EdgeInterface {
  id: string;
  type: EdgeType;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  reconnectable?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  zIndex?: number;
  data?: any;
}

export interface NodeInterface {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  position?: Position; // Added for client convenience

  draggable?: boolean;
  connectable?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  dragging?: boolean;
  selected?: boolean;
  zIndex?: number;
  data?: any;
}

export interface UpdateDiagramInterface {
  name?: string;
  nodes?: NodeInterface[];
  edges?: EdgeInterface[];
}
