import { z } from "../zod-openapi-init";
import {
  DiagramTypeFieldDoc,
  dimensionFieldDoc,
  EdgeTypeFieldDoc,
  handleFieldDoc,
  nodeIdFieldDoc,
  NodeTypeFieldDoc,
  positionFieldDoc,
  useCaseDiagramIdDoc,
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

export const diagramSchema = z
  .object({
    id: uuidFieldDoc,
    name: nameFieldDoc,
    type: DiagramTypeFieldDoc,
    createdAt: dateISOFieldDoc,
    updatedAt: dateISOFieldDoc.optional(),
  })
  .openapi({ title: "DiagramAttributes" });

export const nodeSchema = z
  .object({
    id: uuidFieldDoc,
    type: NodeTypeFieldDoc,
    position: z
      .object({
        x: positionFieldDoc,
        y: positionFieldDoc,
      })
      .transform(({ x, y }) => ({ x, y })),
    width: dimensionFieldDoc,
    height: dimensionFieldDoc,
    draggable: booleanFieldDoc.optional().default(true),
    connectable: booleanFieldDoc.optional().default(true),
    selectable: booleanFieldDoc.optional().default(true),
    deletable: booleanFieldDoc.optional().default(true),
    dragging: booleanFieldDoc.optional().default(false),
    selected: booleanFieldDoc.optional().default(false),
    zIndex: zIndexFieldDoc.optional().default(0),
    data: z
      .object({
        id: uuidFieldDoc,
      })
      .catchall(z.any())
      .optional(),
    createdAt: dateISOFieldDoc,
    updatedAt: dateISOFieldDoc.optional(),
  })
  .transform(({ position, createdAt, updatedAt, ...rest }) => ({
    ...rest,
    ...position,
  }))
  .openapi({ title: "NodeAttributes" });

export const edgeSchema = z
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
    data: z
      .object({
        id: uuidFieldDoc,
      })
      .catchall(z.any())
      .optional(),
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
    nodes: z.array(nodeSchema).optional(),
    edges: z
      .array(
        edgeSchema.omit({
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

export const diagramTypeSchema = DiagramTypeFieldDoc.openapi({
  title: "DiagramTypeDto",
});
export const edgeTypeSchema = EdgeTypeFieldDoc.openapi({
  title: "EdgeTypeDto",
});
export const nodeTypeSchema = NodeTypeFieldDoc.openapi({
  title: "NodeTypeDto",
});

export const useCaseDiagramIdSchema = z
  .object({
    useCaseDiagramId: useCaseDiagramIdDoc,
  })
  .openapi({ title: "ProjectIdDto" });
