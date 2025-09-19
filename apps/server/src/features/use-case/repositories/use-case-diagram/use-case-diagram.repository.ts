import { Injectable } from "@nestjs/common";
import { UseCaseDiagram } from "../../entities/use-case-diagram.entity";
import { UseCaseDiagramModel, UseCaseDiagramModelType } from "../../models/use-case-diagram.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { UpdateUseCaseDiagramInterface } from "../../interfaces/update-use-case.interface";
import { CreateDiagramUseCaseInterface } from "../../interfaces/create-use-case.interface";

@Injectable()
export class UseCaseDiagramRepository {
  private diagramModel: UseCaseDiagramModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.diagramModel = UseCaseDiagramModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateDiagramUseCaseInterface): Promise<UseCaseDiagram> {
    try {
      const diagram = await this.diagramModel.createOne({
        initial: createDto.initial,
        final: createDto.final,
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
      });

      if (createDto.useCaseIds && createDto.useCaseIds.length > 0) {
        for (const useCaseId of createDto.useCaseIds) {
          await this.addUseCase(diagram.id, useCaseId);
        }
      }

      const result = await this.diagramModel.findOneWithRelations({
        where: { id: diagram.id },
        include: ["project", "useCases", "actors"],
      });

      if (!result) {
        throw new Error("Failed to retrieve created diagram");
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to create use case diagram: ${error.message}`);
    }
  }

  async update(id: string, updateDto: UpdateUseCaseDiagramInterface): Promise<UseCaseDiagram> {
    const updated = await this.diagramModel.updateOneOrThrow(updateDto, {
      where: { id },
    });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.diagramModel.delete({
      where: { id },
      detach: true,
    });

    return deleteResult > 0;
  }

  async getById(id: string): Promise<UseCaseDiagram | null> {
    const diagram = await this.diagramModel.findOneWithRelations({
      where: { id },
      include: ["project", "useCases"],
    });

    return diagram;
  }

  async getAll(): Promise<UseCaseDiagram[]> {
    const diagrams = await this.diagramModel.findManyWithRelations({
      include: ["project", "useCases"],
    });

    return diagrams;
  }

  async getByProject(projectId: string): Promise<UseCaseDiagram[]> {
    const diagrams = await this.diagramModel.findByRelatedEntity({
      whereRelated: { id: projectId },
      relationshipAlias: "project",
    });

    return diagrams;
  }

  async addUseCase(diagramId: string, useCaseId: string): Promise<boolean> {
    const result = await this.diagramModel.relateTo({
      alias: "useCases",
      where: {
        source: { id: diagramId },
        target: { id: useCaseId },
      },
    });

    return result > 0;
  }

  async removeUseCase(diagramId: string, useCaseId: string): Promise<boolean> {
    const result = await this.diagramModel.deleteRelationships({
      alias: "useCases",
      where: {
        source: { id: diagramId },
        target: { id: useCaseId },
      },
    });

    return result > 0;
  }
}
