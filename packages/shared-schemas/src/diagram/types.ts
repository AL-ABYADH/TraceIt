import { z } from "../zod-openapi-init";
import {
  diagramAttributesSchema,
  createDiagramSchema,
  updateDiagramSchema,
  nodeAttributesSchema,
  createNodeSchema,
  updateNodeSchema,
  edgeAttributesSchema,
  createEdgeSchema,
  updateEdgeSchema,
  diagramDetailSchema,
  nodeDetailSchema,
  edgeDetailSchema,
  diagramListSchema,
  nodeListSchema,
  edgeListSchema,
  diagramIdSchema,
  nodeIdSchema,
  edgeIdSchema,
} from "./schemas";

// ----------------------
// Type Exports
// ----------------------

export type DiagramIdDto = z.infer<typeof diagramIdSchema>;

// Diagram Types
export type DiagramAttributes = z.infer<typeof diagramAttributesSchema>;
export type DiagramDetailDto = z.infer<typeof diagramDetailSchema>;
export type CreateDiagramDto = z.infer<typeof createDiagramSchema>;
export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;
export type DiagramListDto = z.infer<typeof diagramListSchema>;

// Node Types
export type NodeAttributes = z.infer<typeof nodeAttributesSchema>;
export type NodeDetailDto = z.infer<typeof nodeDetailSchema>;
export type CreateNodeDto = z.infer<typeof createNodeSchema>;
export type UpdateNodeDto = z.infer<typeof updateNodeSchema>;
export type NodeIdDto = z.infer<typeof nodeIdSchema>;
export type NodeListDto = z.infer<typeof nodeListSchema>;

// Edge Types
export type EdgeAttributes = z.infer<typeof edgeAttributesSchema>;
export type EdgeDetailDto = z.infer<typeof edgeDetailSchema>;
export type CreateEdgeDto = z.infer<typeof createEdgeSchema>;
export type UpdateEdgeDto = z.infer<typeof updateEdgeSchema>;
export type EdgeIdDto = z.infer<typeof edgeIdSchema>;
export type EdgeListDto = z.infer<typeof edgeListSchema>;

// Enum exports
export { DiagramType, NodeType, EdgeType } from "./fields";
