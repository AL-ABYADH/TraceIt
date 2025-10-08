import { RequirementDto } from "@repo/shared-schemas";

export function renderRequirementText(req: RequirementDto): string {
  const { condition, operation, actors } = req;

  let actorText = "";
  if (actors && actors.length > 0) {
    const names = actors.map((a) => a.name);
    if (names.length === 1) {
      actorText = names[0]!;
    } else if (names.length === 2) {
      actorText = `${names[0]} and ${names[1]}`;
    } else {
      actorText = `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
    }
  }

  if (actors && actors.length > 0) {
    if (condition && condition.trim().length > 0) {
      return `If ${condition.toLowerCase()}, ${actorText} shall ${operation.toLowerCase()}.`;
    }
    return `${actorText} shall ${operation.toLowerCase()}.`;
  }

  if (condition && condition.trim().length > 0) {
    return `If ${condition.toLowerCase()}, the system shall ${operation.toLowerCase()}.`;
  }

  return `The system shall ${operation.toLowerCase()}.`;
}
