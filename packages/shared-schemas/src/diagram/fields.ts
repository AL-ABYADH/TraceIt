import { createEnumField, createField, uuidField } from "../common";

export const dataField = createField("string", {
  regex: /^[\s\S]*$/,
  message: "Data field must be a valid string",
});

// Array fields for relationships
export const nodesArrayField = createField("array", {
  elementType: uuidField,
  description: "Array of node IDs",
});

export const edgesArrayField = createField("array", {
  elementType: uuidField,
  description: "Array of edge IDs",
});

export enum DiagramType {
  USE_CASE = "USE_CASE",
  ACTIVITY = "ACTIVITY",
  SEQUENCE = "SEQUENCE",
  CLASS = "CLASS",
  STATE = "STATE",
}

export enum NodeType {
  ACTOR = "ACTOR",
  USE_CASE = "USE_CASE",
  ACTIVITY = "ACTIVITY",
  CONDITION_NODE = "CONDITION_NODE",
  FORK_NODE = "FORK_NODE",
  MERGE_NODE = "MERGE_NODE",
}

export enum EdgeType {
  CONTROL_FLOW = "CONTROL_FLOW",
  EXTENDS = "EXTENDS",
  INCLUDES = "INCLUDES",
  ASSOCIATION = "ASSOCIATION",
}

// Diagram-specific fields
export const DiagramTypeField = createEnumField(DiagramType, {
  message: "must be a valid diagram type",
});

export const NodeTypeField = createEnumField(NodeType, {
  message: "Node type must be a valid type",
});

export const EdgeTypeField = createEnumField(EdgeType, {
  message: "Edge type must be a valid type",
});

export const positionField = createField("number", {
  message: "Position must be a number",
});

export const dimensionField = createField("number", {
  min: 0,
  message: "Dimension must be a positive number",
});

export const zIndexField = createField("number", {
  message: "Z-index must be a number",
});

export const nodeIdField = createField("string", {
  min: 1,
  message: "Node ID must not be empty",
});

export const handleField = createField("string", {
  min: 1,
  message: "Handle must not be empty",
});
