import { UseCaseSubtype } from "../enums/use-case-subtype.enum";
import { AddUseCaseParamsInterface } from "../interfaces/add-use-case.interface";

/**
 * DTO representing the payload for creating a new use case.
 * Includes a `subType` field to distinguish between different types of use cases,
 * such as primary, secondary, actor, description, diagram, or relationship.
 */
export class AddUseCaseDto implements AddUseCaseParamsInterface {
  name: string;
  projectId: string;
  subType: UseCaseSubtype; // Specifies the type/category of the use case to be created
}
