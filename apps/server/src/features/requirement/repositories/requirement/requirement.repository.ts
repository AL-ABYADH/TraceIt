import { Injectable } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { RequirementModel, RequirementModelType } from "../../models/requirement.model";
import { Requirement } from "../../entities/requirement.entity";

@Injectable()
export class RequirementRepository {
  private requirementModel: RequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.requirementModel = RequirementModel(this.neo4jService.getNeogma());
  }

  async getById(id: string): Promise<Requirement | null> {
    try {
      const requirement = await this.requirementModel.findOne({
        where: { id },
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve requirement: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<Requirement[]> {
    try {
      const requirements = await this.requirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve requirements for use case: ${error.message}`);
    }
  }

  async getByProject(projectId: string): Promise<Requirement[]> {
    try {
      const requirements = await this.requirementModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve requirements for project: ${error.message}`);
    }
  }
}
