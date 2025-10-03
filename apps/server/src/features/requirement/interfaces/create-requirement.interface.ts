export interface CreateRequirementInterface {
  operation: string;
  useCaseId?: string;
  condition?: string;
  actorIds?: string[];
  exceptionId?: string;
  parentRequirementId?: string;
}

export interface CreateRequirementExceptionInterface {
  name: string;
  requirementId: string;
}
