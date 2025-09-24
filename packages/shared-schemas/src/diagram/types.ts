import { z } from "../zod-openapi-init";
import {
  createDiagramSchema,
  diagramAttributesSchema,
  diagramIdSchema,
  edgeAttributesSchema,
  edgeTypeSchema,
  nodeAttributesSchema,
  nodeTypeSchema,
  typeDiagramSchema,
  updateDiagramSchema,
  useCaseDiagramIdSchema,
} from "./schemas";

// ----------------------
// Type Exports
// ----------------------

export type DiagramIdDto = z.infer<typeof diagramIdSchema>;

// Diagram Types
export type DiagramAttributes = z.infer<typeof diagramAttributesSchema>;
export type CreateDiagramDto = z.infer<typeof createDiagramSchema>;
export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;

// Node Types
export type NodeAttributes = z.infer<typeof nodeAttributesSchema>;

// Edge Types
export type EdgeAttributes = z.infer<typeof edgeAttributesSchema>;
export type TypeDiagramDto = z.infer<typeof typeDiagramSchema>;

export type DiagramTypeDto = z.infer<typeof edgeTypeSchema>;
export type EdgeTypeDto = z.infer<typeof edgeTypeSchema>;

export type UseCaseDiagramIdDto = z.infer<typeof useCaseDiagramIdSchema>;

export type NodeTypeDto = z.infer<typeof nodeTypeSchema>;
