import { UseCaseRelationshipType } from "../enums/use-case-relationship-type.enum";
import { UseCase } from "./use-case.entity";

export class UseCaseRelationship extends UseCase {
  relatedUseCase: any;
  type: UseCaseRelationshipType;
}
