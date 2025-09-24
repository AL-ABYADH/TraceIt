import { uuidField } from "../common";
import {
  dataField,
  DiagramType,
  DiagramTypeField,
  dimensionField,
  edgesArrayField,
  EdgeType,
  EdgeTypeField,
  handleField,
  nodeIdField,
  nodesArrayField,
  NodeType,
  NodeTypeField,
  positionField,
  zIndexField,
} from "./fields";

export const dataFieldDoc = dataField.openapi({
  example: '{"label": "Node 1", "color": "#ff0000"}',
  description: "Custom data stored as JSON string",
});

export const DiagramTypeFieldDoc = DiagramTypeField.openapi({
  example: DiagramType.CLASS,
  description: "Type of diagram",
});

export const NodeTypeFieldDoc = NodeTypeField.openapi({
  example: NodeType.ACTIVITY,
  description: "Type of node",
});

export const EdgeTypeFieldDoc = EdgeTypeField.openapi({
  example: EdgeType.EXTENDS,
  description: "Type of edge",
});

export const positionFieldDoc = positionField.openapi({
  example: 100,
  description: "X or Y coordinate position",
});

export const dimensionFieldDoc = dimensionField.openapi({
  example: 200,
  description: "Width or height dimension",
});

export const zIndexFieldDoc = zIndexField.openapi({
  example: 1,
  description: "Z-index for layering",
});

export const nodeIdFieldDoc = nodeIdField.openapi({
  example: "node-123",
  description: "Source or target node ID",
});

export const handleFieldDoc = handleField.openapi({
  example: "handle-top",
  description: "Source or target handle identifier",
});

export const nodesArrayFieldDoc = nodesArrayField.openapi({
  example: ["node-1", "node-2", "node-3"],
  description: "Array of node IDs belonging to the diagram",
});

export const edgesArrayFieldDoc = edgesArrayField.openapi({
  example: ["edge-1", "edge-2"],
  description: "Array of edge IDs belonging to the diagram",
});

export const useCaseDiagramIdDoc = uuidField.openapi({
  description:
    "The unique identifier of the project that contains this use case",
  example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
});
