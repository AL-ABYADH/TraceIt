import { RequirementListDto } from "@repo/shared-schemas";

export function formatRequirementText(requirement: RequirementListDto): string {
  const { condition, operation } = requirement;

  if (condition && condition.trim().length > 0) {
    return `If ${condition}, the system shall ${operation}.`;
  }

  return `The system shall ${operation}.`;
}
