import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { DiagramAttributes } from "./diagram.model";
import { NodeType } from "@repo/shared-schemas";

export type NodeAttributes = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;

  draggable?: boolean;
  connectable?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  dragging?: boolean;
  selected?: boolean;
  zIndex?: number;
  data: string;
  createdAt: string;
  updatedAt?: string;
};

export interface NodeRelationships {
  diagram: DiagramAttributes;
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
      // Position attributes
      x: {
        type: "number",
        required: true,
        message: "X position is required and must be a number",
      },
      y: {
        type: "number",
        required: true,
        message: "Y position is required and must be a number",
      },
      width: {
        type: "number",
        minimum: 0,
        message: "Width must be a positive number",
      },
      height: {
        type: "number",
        minimum: 0,
        message: "Height must be a positive number",
      },

      selected: {
        type: "boolean",
        message: "Selected must be a boolean value",
      },
      dragging: {
        type: "boolean",
        message: "Dragging must be a boolean value",
      },
      selectable: {
        type: "boolean",
        message: "Selectable must be a boolean value",
      },
      connectable: {
        type: "boolean",
        message: "Connectable must be a boolean value",
      },
      deletable: {
        type: "boolean",
        message: "Deletable must be a boolean value",
      },
      data: {
        type: "string",
      },
    },
    relationships: {
      diagram: {
        model: "Diagram",
        direction: "out",
        name: "BELONGS_TO_DIAGRAM",
        cardinality: "one",
      },
    },
  });
