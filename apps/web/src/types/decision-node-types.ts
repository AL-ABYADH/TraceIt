import { ConditionDto, RequirementExceptionDto } from "@repo/shared-schemas";

/**
 * Union type for decision node data that can contain either
 * a ConditionDto or RequirementExceptionDto
 */
export type DecisionNodeData = ConditionDto | RequirementExceptionDto;

/**
 * Type guard to check if the decision node data is a full ConditionDto
 */
export function isConditionDto(data: DecisionNodeData): data is ConditionDto {
  // ConditionDto has a 'requirementUpdated' property that RequirementExceptionDto doesn't have
  return "requirementUpdated" in data && typeof data.requirementUpdated === "boolean";
}

/**
 * Type guard to check if the decision node data is a RequirementExceptionDto
 */
export function isRequirementExceptionDto(data: DecisionNodeData): data is RequirementExceptionDto {
  // RequirementExceptionDto has a 'requirements' property (plural) that ConditionDto doesn't have
  // and doesn't have 'requirementUpdated'
  return (
    "requirements" in data && Array.isArray(data.requirements) && !("requirementUpdated" in data)
  );
}

/**
 * More reliable function to determine if a decision node represents a condition
 * This checks multiple possible indicators to handle different data structures
 */
export function isConditionNode(data: DecisionNodeData): boolean {
  // Check for full ConditionDto with requirementUpdated field
  if (isConditionDto(data)) {
    return true;
  }

  // If it has 'requirements' array, it's definitely an exception
  if ("requirements" in data && Array.isArray((data as any).requirements)) {
    return false;
  }

  // If it doesn't have requirementUpdated but also doesn't have requirements,
  // default to condition for safety (handles persisted/minified data)
  return true;
}

/**
 * Utility function to get the name from decision node data
 */
export function getDecisionNodeName(data: DecisionNodeData): string {
  return data.name || "Unknown";
}

/**
 * Utility function to determine if a decision node is a condition or exception
 */
export function getDecisionNodeType(data: DecisionNodeData): "condition" | "exception" {
  return isConditionNode(data) ? "condition" : "exception";
}
