import { Injectable } from "@nestjs/common";
import { UseCaseRepository } from "../use-case/use-case.repository";
import { PrimaryUseCaseRepository } from "../primary-use-case/primary-use-case.repository";
import { SecondaryUseCaseRepository } from "../secondary-use-case/secondary-use-case.repository";
import { UseCaseActorRepository } from "../use-case-actor/use-case-actor.repository";
import { UseCaseDescriptionRepository } from "../use-case-description/use-case-description.repository";
import { UseCaseDiagramRepository } from "../use-case-diagram/use-case-diagram.repository";
import { UseCaseRelationshipRepository } from "../use-case-relationship/use-case-relationship.repository";
import { ConcreteUseCaseRepositoryInterface } from "../interfaces/concrete-use-case-repository.interface";
import { UseCase } from "../../entities/use-case.entity";
import { UseCaseSubtype } from "../../enums/use-case-subtype.enum";
import { InvalidUseCaseSubtypeError } from "../../errors/invalid-use-case-subtype.error";

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

  getConcreteRepository(subType: UseCaseSubtype): ConcreteUseCaseRepositoryInterface<UseCase> {
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

  getBaseRepository(): UseCaseRepository {
    return this.baseRepo;
  }
}
