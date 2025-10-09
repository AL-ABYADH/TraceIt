export const requirementQueryKeys = {
  list: ["requirements"],
  detail: (id: string) => [...requirementQueryKeys.list, "detail", id],
  useCaseRequirementList: (useCaseId: string) => ["useCaseRequirement", useCaseId],
  allRequirementsUnderUseCase: (useCaseId: string) => ["allRequirementsUnderUseCase", useCaseId],
  relationships: (requirementId: string) => ["requirementRelationships", requirementId],
} as const;
