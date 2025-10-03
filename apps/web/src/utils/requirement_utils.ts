import { RequirementDto } from "@repo/shared-schemas";

export function renderRequirementText(req: RequirementDto): string {
  const { condition, operation } = req;

  if (condition && condition.trim().length > 0) {
    return `If ${condition}, the system shall ${operation}.`;
  }

  return `The system shall ${operation}.`;
}
