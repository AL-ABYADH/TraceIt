import { createEnumField, createField, uuidField } from "../common";
export { uuidField };
const NAME_DESC_REGEX = /^(?! )[A-Za-z0-9 _-]*(?<! )$/;
const DATA_FIELD_REGEX = /^[\s\S]*$/;

// Base fields (reuse from common if available, otherwise define)

export const dateISOField = createField("string", {
  regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/,
  message: "Invalid ISO date format",
});

export const nameField = createField("string", {
  min: 1,
  max: 100,
  regex: NAME_DESC_REGEX,
  message:
    "Name is not valid. Allowed: letters, numbers, spaces, underscores, hyphens.",
});

export const positiveNumberField = createField("number", {
  min: 0,
  message: "Value must be a positive number",
});

export const booleanField = createField("boolean");

export const dataField = createField("string", {
  regex: DATA_FIELD_REGEX,
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
