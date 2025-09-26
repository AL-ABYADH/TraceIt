import { z } from "../zod-openapi-init";
import {
  createDiagramSchema,
  diagramSchema,
  diagramIdSchema,
  edgeSchema,
  edgeTypeSchema,
  nodeSchema,
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
export type DiagramDto = z.infer<typeof diagramSchema>;
export type CreateDiagramDto = z.infer<typeof createDiagramSchema>;
export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;

// Node Types
export type NodeDto = z.infer<typeof nodeSchema>;

// Edge Types
export type EdgeDto = z.infer<typeof edgeSchema>;
export type TypeDiagramDto = z.infer<typeof typeDiagramSchema>;

export type DiagramTypeDto = z.infer<typeof edgeTypeSchema>;
export type EdgeTypeDto = z.infer<typeof edgeTypeSchema>;

export type UseCaseDiagramIdDto = z.infer<typeof useCaseDiagramIdSchema>;

export type NodeTypeDto = z.infer<typeof nodeTypeSchema>;
