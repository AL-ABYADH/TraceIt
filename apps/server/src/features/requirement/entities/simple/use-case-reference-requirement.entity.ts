import {
  UseCaseReferenceRequirementAttributes,
  UseCaseReferenceRequirementRelationships,
} from "../../models/simple/use-case-reference-requirement.model";

export type UseCaseReferenceRequirement = UseCaseReferenceRequirementAttributes &
  Partial<UseCaseReferenceRequirementRelationships>;
