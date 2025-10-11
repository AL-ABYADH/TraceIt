export interface UpdateRequirementInterface {
  operation?: string;
  condition?: string;
  actorIds?: string[];
}

export interface RepositoryUpdateRequirementInterface {
  operation?: string;
  condition?: string;
  actorIds?: string[];
  isActivityStale: boolean;
  isConditionStale: boolean;
}

export interface UpdateRequirementExceptionInterface {
  name?: string;
}
