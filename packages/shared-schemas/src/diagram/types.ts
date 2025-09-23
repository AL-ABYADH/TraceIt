import { z } from "../zod-openapi-init";
import {
  createDiagramSchema,
  diagramAttributesSchema,
  diagramIdSchema,
  diagramListSchema,
  edgeAttributesSchema,
  edgeDetailSchema,
  edgeIdSchema,
  edgeListSchema,
  nodeAttributesSchema,
  nodeDetailSchema,
  nodeIdSchema,
  nodeListSchema,
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
export type DiagramListDto = z.infer<typeof diagramListSchema>;

// Node Types
export type NodeAttributes = z.infer<typeof nodeAttributesSchema>;
export type NodeDetailDto = z.infer<typeof nodeDetailSchema>;
export type NodeIdDto = z.infer<typeof nodeIdSchema>;
export type NodeListDto = z.infer<typeof nodeListSchema>;

// Edge Types
export type EdgeAttributes = z.infer<typeof edgeAttributesSchema>;
export type EdgeDetailDto = z.infer<typeof edgeDetailSchema>;
export type EdgeIdDto = z.infer<typeof edgeIdSchema>;
export type EdgeListDto = z.infer<typeof edgeListSchema>;
export type TypeDiagramDto = z.infer<typeof typeDiagramSchema>;

// Enum exports
export { DiagramType, NodeType, EdgeType } from "./fields";
