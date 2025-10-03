import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { RequirementAttributes } from "src/features/requirement/models/requirement.model";

export type ActivityAttributes = {
  name: string;
};

export interface ActivityRelationships {
  requirement: RequirementAttributes;
}

export type ActivityModelType = NeogmaModel<ActivityAttributes, ActivityRelationships>;

export const ActivityModel: ModelFactoryDefinition<ActivityAttributes, ActivityRelationships> =
  defineModelFactory<ActivityAttributes, ActivityRelationships>({
    name: "Activity",
    label: ["Activity"],
    schema: {
      name: {
        type: "string",
        required: true,
        minLength: 1,
        maxLength: 100,
        allowEmpty: false,
        message: "Activity name must be between 1 and 100 characters",
      },
    },
    relationships: {
      requirement: {
        model: "Requirement",
        direction: "out",
        name: "RELATED_TO",
        cardinality: "one",
      },
    },
  });
