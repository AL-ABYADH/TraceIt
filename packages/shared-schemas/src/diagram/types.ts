import { z } from "../zod-openapi-init";
import {
  createDiagramSchema,
  diagramAttributesSchema,
  diagramIdSchema,
  edgeAttributesSchema,
  nodeAttributesSchema,
  typeDiagramSchema,
  updateDiagramSchema,
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

// Enum exports
export { DiagramType, NodeType, EdgeType } from "./fields";
