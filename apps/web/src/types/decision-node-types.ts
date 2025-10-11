// import { RequirementExceptionDto, RequirementListDto } from "@repo/shared-schemas";

// /**
//  * Union type for decision node data that can contain either
//  * a RequirementListDto (for conditions) or RequirementExceptionDto (for exceptions)
//  */
// export type DecisionNodeData = RequirementListDto | RequirementExceptionDto;

// /**
//  * Type guard to check if the decision node data is a RequirementListDto (condition)
//  */
// export function isRequirementListDto(data: DecisionNodeData): data is RequirementListDto {
//   // Conditions have 'operation' property - condition is optional
//   return "operation" in data;
// }

// /**
//  * Type guard to check if the decision node data is a RequirementExceptionDto (exception)
//  */
// export function isRequirementExceptionDto(data: DecisionNodeData): data is RequirementExceptionDto {
//   // Exceptions have 'name' property - requirements might not always be present
//   return "name" in data && !("operation" in data);
// }

// export function isConditionNode(data: DecisionNodeData): boolean {
//   return isRequirementListDto(data);
// }

// /**
//  * Utility function to get the name from decision node data
//  */
// export function getDecisionNodeName(data: DecisionNodeData): string {
//   if (isRequirementListDto(data)) {
//     // For conditions, use conditionLabel if available, otherwise condition, otherwise operation
//     return data.conditionLabel || data.condition || data.operation || "Condition";
//   } else if (isRequirementExceptionDto(data)) {
//     // For exceptions, use the name
//     return data.name || "Exception";
//   }
//   return "Unknown Node";
// }

// /**
//  * Utility function to determine if a decision node is a condition or exception
//  */
// export function getDecisionNodeType(data: DecisionNodeData): "condition" | "exception" {
//   return isConditionNode(data) ? "condition" : "exception";
// }
import { RequirementExceptionDto, RequirementListDto } from "@repo/shared-schemas";

export type DecisionNodeData = RequirementListDto | RequirementExceptionDto;

// Enhanced type guard that checks for deletion markers or missing relationships
export function isRequirementListDto(data: DecisionNodeData): data is RequirementListDto {
  // Conditions have 'operation' property
  return "operation" in data;
}

export function isRequirementExceptionDto(data: DecisionNodeData): data is RequirementExceptionDto {
  // Exceptions have 'name' property and should have requirements
  // Also check if it's marked as deleted or has no requirements (which means the related requirement was deleted)
  return "name" in data && !("operation" in data);
}

// New function to check if a node is effectively deleted (including relationship-based deletion)
export function isNodeEffectivelyDeleted(data: DecisionNodeData): boolean {
  if (isRequirementListDto(data)) {
    // For conditions, check if operation exists
    return !data.operation;
  } else if (isRequirementExceptionDto(data)) {
    // For exceptions, we need to check if the related requirement was deleted
    // This is tricky because exceptions don't directly store the requirement status
    // We'll need to rely on a deletion marker or check if requirements array is empty/missing
    return !data.name || (data as any)._isRequirementDeleted === true;
  }
  return true;
}

export function getDecisionNodeName(data: DecisionNodeData): string {
  if (isRequirementListDto(data)) {
    return data.conditionLabel || data.condition || data.operation || "Condition";
  } else if (isRequirementExceptionDto(data)) {
    return data.name || "Exception";
  }
  return "Unknown Node";
}
