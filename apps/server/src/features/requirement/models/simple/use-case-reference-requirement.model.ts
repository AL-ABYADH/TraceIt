import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  SimpleRequirementAttributes,
  SimpleRequirementModel,
  SimpleRequirementRelationships,
} from "../simple-requirement.model";
import { UseCaseAttributes } from "../../../use-case/models/use-case.model";

export type UseCaseReferenceRequirementAttributes = SimpleRequirementAttributes & {};

export interface UseCaseReferenceRequirementRelationships extends SimpleRequirementRelationships {
  referencedUseCase: UseCaseAttributes;
}

export type UseCaseReferenceRequirementModelType = NeogmaModel<
  UseCaseReferenceRequirementAttributes,
  UseCaseReferenceRequirementRelationships
>;

export const UseCaseReferenceRequirementModel: ModelFactoryDefinition<
  UseCaseReferenceRequirementAttributes,
  UseCaseReferenceRequirementRelationships
> = defineModelFactory<
  UseCaseReferenceRequirementAttributes,
  UseCaseReferenceRequirementRelationships
>({
  name: "UseCaseReferenceRequirement",
  label: [...SimpleRequirementModel.parameters.label, "UseCaseReferenceRequirement"],
  schema: {
    ...SimpleRequirementModel.parameters.schema,
  },
  relationships: {
    ...SimpleRequirementModel.parameters.relationships,
    referencedUseCase: {
      model: "UseCase",
      direction: "out",
      name: "REFERENCES",
      cardinality: "one",
    },
  },
});
