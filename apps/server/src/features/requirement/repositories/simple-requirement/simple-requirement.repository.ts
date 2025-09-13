import { Injectable } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { SimpleRequirementModel, SimpleRequirementModelType } from "../../models";
import { SimpleRequirement } from "../../entities";

@Injectable()
export class SimpleRequirementRepository {
  private simpleRequirementModel: SimpleRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.simpleRequirementModel = SimpleRequirementModel(this.neo4jService.getNeogma());
  }

  async getById(id: string): Promise<SimpleRequirement | null> {
    try {
      const requirement = await this.simpleRequirementModel.findOne({
        where: { id },
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve simple requirement: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<SimpleRequirement[]> {
    try {
      const requirements = await this.simpleRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve simple requirements for use case: ${error.message}`);
    }
  }
}
