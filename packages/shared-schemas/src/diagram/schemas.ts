import { z } from "../zod-openapi-init";
import {
  DiagramTypeFieldDoc,
  dimensionFieldDoc,
  EdgeTypeFieldDoc,
  handleFieldDoc,
  nodeIdFieldDoc,
  NodeTypeFieldDoc,
  useCaseDiagramIdDoc,
  zIndexFieldDoc,
} from "./openapi-fields";
import {
  atLeastOneOfSchema,
  dateISOFieldDoc,
  nameFieldDoc,
  projectIdFieldDoc,
  uuidFieldDoc,
} from "../common";

// ----------------------
// Misc
// ----------------------

export const positionSchema = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
  })
  .openapi({ title: "PositionDto" });

// ----------------------
// Base Entity Schemas (Attributes Only)
// ----------------------

export const diagramListSchema = z
  .object({
    id: uuidFieldDoc,
    name: nameFieldDoc.optional(),
    type: DiagramTypeFieldDoc,
    createdAt: dateISOFieldDoc,
    updatedAt: dateISOFieldDoc.optional(),
  })
  .openapi({ title: "DiagramListDto" });

export const nodeSchema = z.object({
  id: uuidFieldDoc,
  type: NodeTypeFieldDoc,
  position: positionSchema,
  width: dimensionFieldDoc.optional(),
  height: dimensionFieldDoc.optional(),
  zIndex: zIndexFieldDoc.default(0).optional(),
  data: z
    .object({
      id: uuidFieldDoc,
    })
    .catchall(z.any())
    .optional(),
});

export const nodeInputSchema = nodeSchema
  .transform((node) => {
    const position = node.position;
    return {
      ...node,
      position: JSON.stringify(position),
    };
  })
  .openapi({ title: "NodeDto" });

export const nodeOutputSchema = nodeSchema
  .extend({
    position: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    }, positionSchema),
  })
  .openapi({ title: "NodeDto" });

export const edgeSchema = z
  .object({
    id: uuidFieldDoc,
    type: EdgeTypeFieldDoc,
    source: nodeIdFieldDoc,
    target: nodeIdFieldDoc,
    sourceHandle: handleFieldDoc,
    targetHandle: handleFieldDoc,
    zIndex: zIndexFieldDoc.default(0).optional(),
    data: z
      .object({
        id: uuidFieldDoc,
      })
      .catchall(z.any())
      .optional(),
  })
  .openapi({ title: "EdgeDto" });

export const createDiagramSchema = z
  .object({
    projectId: projectIdFieldDoc.describe(
      "ID of the project this diagram belongs to",
    ),
    name: nameFieldDoc.optional(),
    type: DiagramTypeFieldDoc,
  })
  .openapi({ title: "CreateDiagramDto" });

export const updateDiagramSchema = atLeastOneOfSchema(
  {
    name: nameFieldDoc.optional(),
    nodes: z.array(nodeInputSchema),
    edges: z.array(edgeSchema),
  },
  ["name", "nodes", "edges"],
).openapi({ title: "UpdateDiagramDto" });

// ----------------------
// Relationship Schemas
// ----------------------

export const diagramRelationshipsSchema = z.object({
  nodes: z.array(nodeOutputSchema).optional(),
  edges: z.array(edgeSchema).optional(),
});

export const diagramDetailSchema = diagramListSchema
  .merge(diagramRelationshipsSchema)
  .openapi({ title: "DiagramDetailDto" });

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
