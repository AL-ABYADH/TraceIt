export interface CreateRequirementInterface {
  operation: string;
  useCaseId: string;
  condition?: string;
  actorIds?: string[];
}

export interface CreateRequirementExceptionInterface {
  name: string;
  requirementIds: string[];
}
