import { Injectable } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { CompositeRequirementModel, CompositeRequirementModelType } from "../../models";
import { Requirement, CompositeRequirement } from "../../entities";

@Injectable()
export class CompositeRequirementRepository {
  private compositeRequirementModel: CompositeRequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.compositeRequirementModel = CompositeRequirementModel(this.neo4jService.getNeogma());
  }

  async getById(id: string): Promise<CompositeRequirement | null> {
    try {
      const requirement = await this.compositeRequirementModel.findOne({
        where: { id },
      });

      return requirement ?? null;
    } catch (error) {
      throw new Error(`Failed to retrieve composite requirement: ${error.message}`);
    }
  }

  async getByUseCase(useCaseId: string): Promise<CompositeRequirement[]> {
    try {
      const requirements = await this.compositeRequirementModel.findByRelatedEntity({
        whereRelated: { id: useCaseId },
        relationshipAlias: "useCase",
      });

      return requirements;
    } catch (error) {
      throw new Error(`Failed to retrieve composite requirements for use case: ${error.message}`);
    }
  }

  async getSubRequirements(id: string): Promise<Requirement[]> {
    try {
      const requirement = await this.compositeRequirementModel.findOneWithRelations({
        where: { id },
        include: ["subRequirements"],
      });

      return requirement?.subRequirements || [];
    } catch (error) {
      throw new Error(`Failed to retrieve sub-requirements: ${error.message}`);
    }
  }
}
