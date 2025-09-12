import {
  SimultaneousRequirementAttributes,
  SimultaneousRequirementRelationships,
} from "../../models/composite/simultaneous-requirement.model";

export type SimultaneousRequirement = SimultaneousRequirementAttributes &
  Partial<SimultaneousRequirementRelationships>;
