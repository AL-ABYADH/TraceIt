import { Injectable } from "@nestjs/common";
import { UseCaseModel, UseCaseModelType } from "../../models/use-case.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { UseCase } from "../../entities/use-case.entity";

@Injectable()
export class UseCaseRepository {
  private useCaseModel: UseCaseModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.useCaseModel = UseCaseModel(this.neo4jService.getNeogma());
  }

  async getByProject(id: string): Promise<UseCase[]> {
    const useCases = await this.useCaseModel.findByRelatedEntity({
      relationshipAlias: "project",
      whereRelated: {
        id: id,
      },
    });
    // const useCasesIds = useCases.map((uc) => uc.id);
    //
    // const useCaseWithRelationships = await this.useCaseModel.findManyWithRelations({
    //   where: { id: { [Op.in]: useCasesIds } },
    // });

    // return useCaseWithRelationships;
    return useCases;
  }

  async getById(id: string): Promise<UseCase | null> {
    const useCase = await this.useCaseModel.findOneWithRelations({ where: { id: id } });
    if (!useCase) {
      return null;
    }

    return useCase;
  }
}
