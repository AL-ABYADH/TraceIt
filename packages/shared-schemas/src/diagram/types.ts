import { z } from "../zod-openapi-init";
import {
  createDiagramSchema,
  diagramIdSchema,
  edgeSchema,
  edgeTypeSchema,
  nodeSchema,
  nodeTypeSchema,
  typeDiagramSchema,
  updateDiagramSchema,
  useCaseDiagramIdSchema,
  diagramListSchema,
  diagramDetailSchema,
  positionSchema,
  diagramRelationshipsSchema,
} from "./schemas";

// ----------------------
// Type Exports
// ----------------------

export type DiagramIdDto = z.infer<typeof diagramIdSchema>;

// Diagram Types
export type DiagramListDto = z.infer<typeof diagramListSchema>;
export type DiagramDetailDto = z.infer<typeof diagramDetailSchema>;
export type CreateDiagramDto = z.infer<typeof createDiagramSchema>;
export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;
export type DiagramElementsDto = z.infer<typeof diagramRelationshipsSchema>;

// Node Types
export type NodeDto = z.infer<typeof nodeSchema>;
export type Position = z.infer<typeof positionSchema>;

// Edge Types
export type EdgeDto = z.infer<typeof edgeSchema>;
export type TypeDiagramDto = z.infer<typeof typeDiagramSchema>;

export type DiagramTypeDto = z.infer<typeof edgeTypeSchema>;
export type EdgeTypeDto = z.infer<typeof edgeTypeSchema>;

export type UseCaseDiagramIdDto = z.infer<typeof useCaseDiagramIdSchema>;

export type NodeTypeDto = z.infer<typeof nodeTypeSchema>;
