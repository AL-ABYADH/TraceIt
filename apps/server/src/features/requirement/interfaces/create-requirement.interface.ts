import { ActorSubtype } from "../../actor/enums/actor-subtype.enum";

// Base interface for requirement creation
export interface CreateRequirementInterface {
  useCaseId: string;
  projectId: string;
  depth: number;
}

// System Requirement
export interface CreateSystemRequirementInterface extends CreateRequirementInterface {
  operation: string;
}

// Event System Requirement
export interface CreateEventSystemRequirementInterface extends CreateRequirementInterface {
  operation: string;
  eventActorId: string;
}

// Actor Requirement
export interface CreateActorRequirementInterface extends CreateRequirementInterface {
  operation: string;
  actorIds: string[];
}

// System Actor Communication Requirement
export interface CreateSystemActorCommunicationRequirementInterface
  extends CreateRequirementInterface {
  communicationInfo: string;
  communicationFacility: string;
  actorIds: string[]; // Human actors only
}

// Conditional Requirement
export interface CreateConditionalRequirementInterface extends CreateRequirementInterface {
  condition: string;
  requirementId: string;
}

// Recursive Requirement
export interface CreateRecursiveRequirementInterface extends CreateRequirementInterface {
  requirementId: string;
}

// Use Case Reference Requirement
export interface CreateUseCaseReferenceRequirementInterface extends CreateRequirementInterface {
  referencedUseCaseId: string;
}

// Logical Group Requirement
export interface CreateLogicalGroupRequirementInterface extends CreateRequirementInterface {
  mainRequirementId: string;
  detailRequirementIds: string[];
}

// Conditional Group Requirement
export interface CreateConditionalGroupRequirementInterface extends CreateRequirementInterface {
  conditionalValue: string;
  primaryConditionId: string;
  alternativeConditionIds: string[];
  fallbackConditionId?: string;
}

// Simultaneous Requirement
export interface CreateSimultaneousRequirementInterface extends CreateRequirementInterface {
  simpleRequirementIds: string[];
}

// Exceptional Requirement
export interface CreateExceptionalRequirementInterface extends CreateRequirementInterface {
  exception: string;
  requirementIds: string[];
}
