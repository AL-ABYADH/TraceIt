import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { DiagramAttributes } from "./diagram.model";
import { EdgeType } from "@repo/shared-schemas";

export type EdgeAttributes = {
  id: string;
  type: EdgeType;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  reconnectable?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  zIndex?: number;
  createdAt: string;
  updatedAt?: string;
};

export interface EdgeRelationships {
  diagram: DiagramAttributes;
  data?: any;
}

export type EdgeModelType = NeogmaModel<EdgeAttributes, EdgeRelationships>;

export const EdgeModel: ModelFactoryDefinition<EdgeAttributes, EdgeRelationships> =
  defineModelFactory<EdgeAttributes, EdgeRelationships>({
    name: "Edge",
    label: ["Edge"],
    schema: {
      type: {
        type: "string",
        required: true,
        enum: Object.values(EdgeType),
        message: "Edge type must be a valid type",
      },
      // Connection attributes
      source: {
        type: "string",
        required: true,
        message: "Source ID is required and must not be empty",
      },
      target: {
        type: "string",
        required: true,
        message: "Target ID is required and must not be empty",
      },
      sourceHandle: {
        type: "string",
        message: "Source handle must be a string",
        required: true,
      },
      targetHandle: {
        type: "string",
        message: "Target handle must be a string",
        required: true,
      },
      deletable: {
        type: "boolean",
        message: "Deletable must be a boolean value",
        required: false,
      },
      selectable: {
        type: "boolean",
        message: "Selectable must be a boolean value",
        required: false,
      },
      selected: {
        type: "boolean",
        message: "Selected must be a boolean value",
        required: false,
      },
      // Interaction attributes
      zIndex: {
        type: "number",
        message: "Z-index must be a number",
        required: false,
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
