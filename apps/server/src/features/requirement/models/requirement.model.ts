import {
  AbstractModelFactoryDefinition,
  AbstractNeogmaModel,
  defineAbstractModelFactory,
} from "@repo/custom-neogma";
import { UseCaseAttributes } from "../../use-case/models/use-case.model";
import { ProjectAttributes } from "../../project/models/project.model";

export type RequirementAttributes = {
  id: string;
  depth: number;
  createdAt: string;
  updatedAt?: string;
};

export interface RequirementRelationships {
  useCase: UseCaseAttributes;
  project: ProjectAttributes;
}

export type RequirementModelType = AbstractNeogmaModel<
  RequirementAttributes,
  RequirementRelationships
>;

export const RequirementModel: AbstractModelFactoryDefinition<
  RequirementAttributes,
  RequirementRelationships
> = defineAbstractModelFactory<RequirementAttributes, RequirementRelationships>({
  name: "Requirement",
  label: ["Requirement"],
  schema: {
    depth: {
      type: "number",
      required: true,
      minimum: 0,
    },
  },
  relationships: {
    useCase: {
      model: "UseCase",
      direction: "out",
      name: "BELONGS_TO",
      cardinality: "one",
    },
    project: {
      model: "Project",
      direction: "out",
      name: "BELONGS_TO",
      cardinality: "one",
    },
  },
});
