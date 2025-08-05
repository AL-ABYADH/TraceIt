import { Injectable } from "@nestjs/common";
import { UseCaseRepository } from "../use-case/use-case.repository";
import { PrimaryUseCaseRepository } from "../primary-use-case/primary-use-case.repository";
import { SecondaryUseCaseRepository } from "../secondary-use-case/secondary-use-case.repository";
import { UseCaseActorRepository } from "../use-case-actor/use-case-actor.repository";
import { UseCaseDescriptionRepository } from "../use-case-description/use-case-description.repository";
import { UseCaseDiagramRepository } from "../use-case-diagram/use-case-diagram.repository";
import { UseCaseRelationshipRepository } from "../use-case-relationship/use-case-relationship.repository";
import { UseCaseSubtype } from "../../enums/use-case-subtype.enum";
import { InvalidUseCaseSubtypeError } from "../../errors/invalid-use-case-subtype.error";
import { ConcreteUseCaseRepositoryInterface } from "../interfaces/concrete-use-case-repository.interface";

@Injectable()
export class UseCaseRepositoryFactory {
  constructor(
    private readonly baseRepo: UseCaseRepository,
    private readonly primaryRepo: PrimaryUseCaseRepository,
    private readonly secondaryRepo: SecondaryUseCaseRepository,
    private readonly actorRepo: UseCaseActorRepository,
    private readonly descriptionRepo: UseCaseDescriptionRepository,
    private readonly diagramRepo: UseCaseDiagramRepository,
    private readonly relationshipRepo: UseCaseRelationshipRepository,
  ) {}

  /**
   * Retrieves a concrete repository implementation based on the specified use case subtype.
   * Uses `any` as the generic type because not all entities share a common base type.
   *
   * @param subType - The subtype of the use case to determine the repository
   * @returns An instance of a repository conforming to ConcreteUseCaseRepositoryInterface<any>
   * @throws InvalidUseCaseSubtypeError if the subtype is unrecognized
   */
  getConcreteRepository(subType: UseCaseSubtype): ConcreteUseCaseRepositoryInterface<any> {
    switch (subType) {
      case UseCaseSubtype.PRIMARY:
        return this.primaryRepo;
      case UseCaseSubtype.SECONDARY:
        return this.secondaryRepo;
      case UseCaseSubtype.ACTOR:
        return this.actorRepo;
      case UseCaseSubtype.DESCRIPTION:
        return this.descriptionRepo;
      case UseCaseSubtype.DIAGRAM:
        return this.diagramRepo;
      case UseCaseSubtype.RELATIONSHIP:
        return this.relationshipRepo;
      default:
        throw new InvalidUseCaseSubtypeError(subType);
    }
  }

  /**
   * Returns the base repository for generic use case operations.
   * Useful for handling common CRUD operations across all use case types.
   *
   * @returns The base UseCaseRepository instance
   */
  getBaseRepository(): UseCaseRepository {
    return this.baseRepo;
  }
}
