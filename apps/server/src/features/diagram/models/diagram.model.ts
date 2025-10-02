import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { ProjectAttributes } from "../../project/models/project.model";
import { DiagramType } from "@repo/shared-schemas";
import { EdgeAttributes } from "./edge.model";
import { NodeAttributes } from "./node.model";

export type DiagramAttributes = {
  id: string;
  name?: string;
  type: DiagramType;
  createdAt: string;
  updatedAt?: string;
};

export interface DiagramRelationships {
  project: ProjectAttributes;
  edges: EdgeAttributes[];
  nodes: NodeAttributes[];
}

export type DiagramModelType = NeogmaModel<DiagramAttributes, DiagramRelationships>;

export const DiagramModel: ModelFactoryDefinition<DiagramAttributes, DiagramRelationships> =
  defineModelFactory<DiagramAttributes, DiagramRelationships>({
    name: "Diagram",
    label: ["Diagram"],
    schema: {
      name: {
        type: "string",
        required: false,
        minLength: 1,
        maxLength: 100,
        allowEmpty: false,
        message: "Diagram name must be between 1 and 100 characters",
      },
      type: {
        type: "string",
        required: true,
        enum: Object.values(DiagramType),
        message: "must be a valid diagram type",
      },
    },
    relationships: {
      project: {
        model: "Project",
        direction: "out",
        name: "BELONGS_TO",
        cardinality: "one",
      },
      nodes: {
        model: "Node",
        direction: "in",
        name: "PART_OF",
        cardinality: "many",
      },
      edges: {
        model: "Edge",
        direction: "in",
        name: "PART_OF",
        cardinality: "many",
      },
    },
  });
