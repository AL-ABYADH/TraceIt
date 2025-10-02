import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { DiagramAttributes } from "./diagram.model";
import { NodeType } from "@repo/shared-schemas";

export type NodeAttributes = {
  id: string;
  type: NodeType;
  position: string;
  width?: number;
  height?: number;
  zIndex?: number;
  createdAt: string;
  updatedAt?: string;
};

export interface NodeRelationships {
  diagram: DiagramAttributes;
  data?: any;
}

export type NodeModelType = NeogmaModel<NodeAttributes, NodeRelationships>;

export const NodeModel: ModelFactoryDefinition<NodeAttributes, NodeRelationships> =
  defineModelFactory<NodeAttributes, NodeRelationships>({
    name: "Node",
    label: ["Node"],
    schema: {
      type: {
        type: "string",
        required: true,
        enum: Object.values(NodeType),
        message: "Node type must be a valid type",
      },
      position: {
        type: "string",
        required: true,
      },
      zIndex: {
        type: "number",
        required: false,
        message: "Z position must be a number",
      },
      width: {
        type: "number",
        minimum: 0,
        required: false,
        message: "Width must be a positive number",
      },
      height: {
        type: "number",
        minimum: 0,
        required: false,
        message: "Height must be a positive number",
      },
    },
    relationships: {
      diagram: {
        model: "Diagram",
        direction: "out",
        name: "PART_OF",
        cardinality: "one",
      },
    },
  });
