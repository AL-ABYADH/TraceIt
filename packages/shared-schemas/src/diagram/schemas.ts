import { z } from "../zod-openapi-init";
import {
  dataFieldDoc,
  DiagramTypeFieldDoc,
  dimensionFieldDoc,
  EdgeTypeFieldDoc,
  handleFieldDoc,
  nodeIdFieldDoc,
  NodeTypeFieldDoc,
  positionFieldDoc,
  zIndexFieldDoc,
} from "./openapi-fields";
import {
  atLeastOneOfSchema,
  booleanFieldDoc,
  dateISOFieldDoc,
  nameFieldDoc,
  projectIdFieldDoc,
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
    nodes: z
      .array(
        nodeAttributesSchema.omit({
          createdAt: true,
          updatedAt: true,
        }),
      )
      .optional(),
    edges: z
      .array(
        edgeAttributesSchema.omit({
          createdAt: true,
          updatedAt: true,
        }),
      )
      .optional(),
  },
  ["name", "nodes", "edges"],
).openapi({ title: "UpdateDiagramDto" });

// ----------------------
// Parameter Schemas
// ----------------------

export const diagramIdSchema = z
  .object({
    diagramId: uuidFieldDoc,
  })
  .openapi({ title: "DiagramIdDto" });

export const typeDiagramSchema = z.object({
  type: DiagramTypeFieldDoc,
});
