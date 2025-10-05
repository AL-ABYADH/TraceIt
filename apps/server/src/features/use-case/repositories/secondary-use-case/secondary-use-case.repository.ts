import { Injectable, NotFoundException } from "@nestjs/common";
import { UseCaseSubtype } from "@repo/shared-schemas";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { SecondaryUseCase } from "../../entities/secondary-use-case.entity";
import { CreateSecondaryUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateSecondaryUseCaseInterface } from "../../interfaces/update-use-case.interface";
import {
  SecondaryUseCaseModel,
  SecondaryUseCaseModelType,
} from "../../models/secondary-use-case.model";

@Injectable()
export class SecondaryUseCaseRepository {
  private secondaryUseCaseModel: SecondaryUseCaseModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.secondaryUseCaseModel = SecondaryUseCaseModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateSecondaryUseCaseInterface): Promise<SecondaryUseCase> {
    const useCase = await this.secondaryUseCaseModel.createOne({
      name: createDto.name,
      project: {
        where: [{ params: { id: createDto.projectId } }],
      },
      parentUseCase: {
        where: [{ params: { id: createDto.primaryUseCaseId } }],
      },

      subtype: UseCaseSubtype.SECONDARY,
    });
    return useCase;
  }

  async update(id: string, updateDto: UpdateSecondaryUseCaseInterface): Promise<SecondaryUseCase> {
    const secondaryUpdateDto = updateDto;
    const attributes = {};

    if (secondaryUpdateDto.name) {
      attributes["name"] = secondaryUpdateDto.name;
    }

    await this.secondaryUseCaseModel.updateOneOrThrow(attributes, {
      where: { id },
    });

    if (secondaryUpdateDto.primaryUseCaseId) {
      await this.secondaryUseCaseModel.deleteRelationships({
        alias: "parentUseCase",
        where: {
          source: { id },
        },
      });

      await this.secondaryUseCaseModel.relateTo({
        alias: "parentUseCase",
        where: {
          source: { id },
          target: { id: secondaryUpdateDto.primaryUseCaseId },
        },
      });
    }

    const result = await this.secondaryUseCaseModel.findOneWithRelations({
      where: { id },
      include: ["parentUseCase", "project"],
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.secondaryUseCaseModel.delete({
      where: { id },
      detach: true,
    });

    return deleteResult > 0;
  }

  async getById(id: string): Promise<SecondaryUseCase | null> {
    const useCase = await this.secondaryUseCaseModel.findOneWithRelations({
      where: { id },
      include: ["parentUseCase", "project"],
    });

    return useCase ? useCase : null;
  }

  async getAll(): Promise<SecondaryUseCase[]> {
    const useCases = await this.secondaryUseCaseModel.findManyWithRelations({
      include: ["parentUseCase", "project"],
    });

    return useCases;
  }

  async getByProject(projectId: string): Promise<SecondaryUseCase[]> {
    const useCases = await this.secondaryUseCaseModel.findByRelatedEntity({
      whereRelated: { id: projectId },
      relationshipAlias: "project",
    });

    return useCases;
  }
}
