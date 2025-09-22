import { z } from "../zod-openapi-init";
import {
  nameFieldDoc,
  dateISOFieldDoc,
  DiagramTypeFieldDoc,
  dataFieldDoc,
  NodeTypeFieldDoc,
  positionFieldDoc,
  dimensionFieldDoc,
  zIndexFieldDoc,
  booleanFieldDoc,
  EdgeTypeFieldDoc,
  nodeIdFieldDoc,
  handleFieldDoc,
  nodesArrayFieldDoc,
  edgesArrayFieldDoc,
} from "./openapi-fields";
import {
  atLeastOneOfSchema,
  projectIdFieldDoc,
  projectSchema,
  uuidFieldDoc,
} from "../common"; // Assuming you have project schema

// ----------------------
// Base Entity Schemas (Attributes Only)
// ----------------------

export const diagramAttributesSchema = z
  .object({
    id: uuidFieldDoc,
    name: nameFieldDoc,
    type: DiagramTypeFieldDoc,
    createdAt: dateISOFieldDoc,
    updatedAt: dateISOFieldDoc.optional(),
  })
  .openapi({ title: "DiagramAttributes" });

export const nodeAttributesSchema = z
  .object({
    id: uuidFieldDoc,
    type: NodeTypeFieldDoc,
    x: positionFieldDoc,
    y: positionFieldDoc,
    width: dimensionFieldDoc,
    height: dimensionFieldDoc,
    draggable: booleanFieldDoc.optional().default(true),
    connectable: booleanFieldDoc.optional().default(true),
    selectable: booleanFieldDoc.optional().default(true),
    deletable: booleanFieldDoc.optional().default(true),
    dragging: booleanFieldDoc.optional().default(false),
    selected: booleanFieldDoc.optional().default(false),
    zIndex: zIndexFieldDoc.optional().default(0),
    data: dataFieldDoc,
    createdAt: dateISOFieldDoc,
    updatedAt: dateISOFieldDoc.optional(),
  })
  .openapi({ title: "NodeAttributes" });

export const edgeAttributesSchema = z
  .object({
    id: uuidFieldDoc,
    type: EdgeTypeFieldDoc,
    source: nodeIdFieldDoc,
    target: nodeIdFieldDoc,
    sourceHandle: handleFieldDoc,
    targetHandle: handleFieldDoc,
    reconnectable: booleanFieldDoc.optional().default(true),
    deletable: booleanFieldDoc.optional().default(true),
    selectable: booleanFieldDoc.optional().default(true),
    selected: booleanFieldDoc.optional().default(false),
    zIndex: zIndexFieldDoc.optional().default(0),
    data: dataFieldDoc,
    createdAt: dateISOFieldDoc,
    updatedAt: dateISOFieldDoc.optional(),
  })
  .openapi({ title: "EdgeAttributes" });

// ----------------------
// List Schemas (Attributes Only)
// ----------------------

export const diagramListSchema = z.array(diagramAttributesSchema);
export const nodeListSchema = z.array(nodeAttributesSchema);
export const edgeListSchema = z.array(edgeAttributesSchema);

// ----------------------
// Detailed Schemas (Attributes + Relationships)
// ----------------------

export const diagramRelationshipsSchema = z
  .object({
    project: projectSchema.optional(),
    nodes: nodeListSchema.optional(),
    edges: edgeListSchema.optional(),
  })
  .openapi({ title: "DiagramRelationships" });

export const diagramDetailSchema = diagramAttributesSchema
  .merge(diagramRelationshipsSchema)
  .openapi({
    title: "DiagramDetailDto",
    description:
      "Detailed view of a diagram including its attributes and relationships",
  });

export const nodeRelationshipsSchema = z
  .object({
    diagram: diagramAttributesSchema.optional(),
  })
  .openapi({ title: "NodeRelationships" });

export const nodeDetailSchema = nodeAttributesSchema
  .merge(nodeRelationshipsSchema)
  .openapi({
    title: "NodeDetailDto",
    description:
      "Detailed view of a node including its attributes and diagram relationship",
  });

export const edgeRelationshipsSchema = z
  .object({
    diagram: diagramAttributesSchema.optional(),
    sourceNode: nodeAttributesSchema.optional(),
    targetNode: nodeAttributesSchema.optional(),
  })
  .openapi({ title: "EdgeRelationships" });

export const edgeDetailSchema = edgeAttributesSchema
  .merge(edgeRelationshipsSchema)
  .openapi({
    title: "EdgeDetailDto",
    description:
      "Detailed view of an edge including its attributes and relationships",
  });

// ----------------------
// Create/Update Schemas
// ----------------------

export const createDiagramSchema = z
  .object({
    projectId: projectIdFieldDoc.describe(
      "ID of the project this diagram belongs to",
    ),
    name: nameFieldDoc,
    type: DiagramTypeFieldDoc,
  })
  .openapi({ title: "CreateDiagramDto" });

export const updateDiagramSchema = atLeastOneOfSchema(
  {
    name: nameFieldDoc.optional(),
    nodes: nodesArrayFieldDoc.optional(),
    edges: edgesArrayFieldDoc.optional(),
  },
  ["name", "nodes", "edges"],
).openapi({ title: "UpdateDiagramDto" });

export const createNodeSchema = z
  .object({
    diagramId: uuidFieldDoc.describe("ID of the diagram this node belongs to"),
    type: NodeTypeFieldDoc,
    x: positionFieldDoc,
    y: positionFieldDoc,
    width: dimensionFieldDoc.default(150),
    height: dimensionFieldDoc.default(50),
    draggable: booleanFieldDoc.optional().default(true),
    connectable: booleanFieldDoc.optional().default(true),
    selectable: booleanFieldDoc.optional().default(true),
    deletable: booleanFieldDoc.optional().default(true),
    zIndex: zIndexFieldDoc.optional().default(0),
    data: dataFieldDoc.default("{}"),
  })
  .openapi({ title: "CreateNodeDto" });

export const updateNodeSchema = z
  .object({
    type: NodeTypeFieldDoc.optional(),
    x: positionFieldDoc.optional(),
    y: positionFieldDoc.optional(),
    width: dimensionFieldDoc.optional(),
    height: dimensionFieldDoc.optional(),
    draggable: booleanFieldDoc.optional(),
    connectable: booleanFieldDoc.optional(),
    selectable: booleanFieldDoc.optional(),
    deletable: booleanFieldDoc.optional(),
    dragging: booleanFieldDoc.optional(),
    selected: booleanFieldDoc.optional(),
    zIndex: zIndexFieldDoc.optional(),
    data: dataFieldDoc.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  )
  .openapi({ title: "UpdateNodeDto" });

export const createEdgeSchema = z
  .object({
    diagramId: uuidFieldDoc.describe("ID of the diagram this edge belongs to"),
    type: EdgeTypeFieldDoc,
    source: nodeIdFieldDoc,
    target: nodeIdFieldDoc,
    sourceHandle: handleFieldDoc,
    targetHandle: handleFieldDoc,
    reconnectable: booleanFieldDoc.optional().default(true),
    deletable: booleanFieldDoc.optional().default(true),
    selectable: booleanFieldDoc.optional().default(true),
    zIndex: zIndexFieldDoc.optional().default(0),
    data: dataFieldDoc.default("{}"),
  })
  .openapi({ title: "CreateEdgeDto" });

export const updateEdgeSchema = z
  .object({
    type: EdgeTypeFieldDoc.optional(),
    source: nodeIdFieldDoc.optional(),
    target: nodeIdFieldDoc.optional(),
    sourceHandle: handleFieldDoc.optional(),
    targetHandle: handleFieldDoc.optional(),
    reconnectable: booleanFieldDoc.optional(),
    deletable: booleanFieldDoc.optional(),
    selectable: booleanFieldDoc.optional(),
    selected: booleanFieldDoc.optional(),
    zIndex: zIndexFieldDoc.optional(),
    data: dataFieldDoc.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  )
  .openapi({ title: "UpdateEdgeDto" });

// ----------------------
// Parameter Schemas
// ----------------------

export const nodeIdSchema = z
  .object({
    nodeId: uuidFieldDoc,
  })
  .openapi({ title: "NodeIdDto" });

export const edgeIdSchema = z
  .object({
    edgeId: uuidFieldDoc,
  })
  .openapi({ title: "EdgeIdDto" });

export const diagramIdSchema = z
  .object({
    diagramId: uuidFieldDoc,
  })
  .openapi({ title: "DiagramIdDto" });
