// Base interface for requirement updates
export interface UpdateRequirementInterface {
  depth?: number;
}

// System Requirement
export interface UpdateSystemRequirementInterface extends UpdateRequirementInterface {
  operation?: string;
}

// Event System Requirement
export interface UpdateEventSystemRequirementInterface extends UpdateRequirementInterface {
  operation?: string;
  eventActorId?: string;
}

// Actor Requirement
export interface UpdateActorRequirementInterface extends UpdateRequirementInterface {
  operation?: string;
  actorIds?: string[];
}

// System Actor Communication Requirement
export interface UpdateSystemActorCommunicationRequirementInterface
  extends UpdateRequirementInterface {
  communicationInfo?: string;
  communicationFacility?: string;
  actorIds?: string[];
}

// Conditional Requirement
export interface UpdateConditionalRequirementInterface extends UpdateRequirementInterface {
  condition?: string;
  requirementId?: string;
}

// Recursive Requirement
export interface UpdateRecursiveRequirementInterface extends UpdateRequirementInterface {
  requirementId?: string;
}

// Use Case Reference Requirement
export interface UpdateUseCaseReferenceRequirementInterface extends UpdateRequirementInterface {
  referencedUseCaseId?: string;
}

// Logical Group Requirement
export interface UpdateLogicalGroupRequirementInterface extends UpdateRequirementInterface {
  mainRequirementId?: string;
  detailRequirementIds?: string[];
}

// Conditional Group Requirement
export interface UpdateConditionalGroupRequirementInterface extends UpdateRequirementInterface {
  conditionalValue?: string;
  primaryConditionId?: string;
  alternativeConditionIds?: string[];
  fallbackConditionId?: string;
}

// Simultaneous Requirement
export interface UpdateSimultaneousRequirementInterface extends UpdateRequirementInterface {
  simpleRequirementIds?: string[];
}

// Exceptional Requirement
export interface UpdateExceptionalRequirementInterface extends UpdateRequirementInterface {
  exception?: string;
  requirementIds?: string[];
}
