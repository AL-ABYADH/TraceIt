import { z } from "../zod-openapi-init";
import {
  createDiagramsSchema,
  diagramAttributesSchema,
  diagramIdSchema,
  edgeAttributesSchema,
  edgeTypeSchema,
  nodeAttributesSchema,
  nodeTypeSchema,
  typeDiagramSchema,
  updateDiagramsSchema,
  useCaseDiagramIdSchema,
} from "./schemas";

// ----------------------
// Type Exports
// ----------------------

export type DiagramIdDto = z.infer<typeof diagramIdSchema>;

// Diagram Types
export type DiagramAttributes = z.infer<typeof diagramAttributesSchema>;
export type CreateDiagramsDto = z.infer<typeof createDiagramsSchema>;
export type UpdateDiagramsDto = z.infer<typeof updateDiagramsSchema>;

// Node Types
export type NodeAttributes = z.infer<typeof nodeAttributesSchema>;

// Edge Types
export type EdgeAttributes = z.infer<typeof edgeAttributesSchema>;
export type TypeDiagramDto = z.infer<typeof typeDiagramSchema>;

export type DiagramTypeDto = z.infer<typeof edgeTypeSchema>;
export type EdgeTypeDto = z.infer<typeof edgeTypeSchema>;

export type UseCaseDiagramIdDto = z.infer<typeof useCaseDiagramIdSchema>;

export type NodeTypeDto = z.infer<typeof nodeTypeSchema>;
