import { Injectable, NotFoundException } from "@nestjs/common";
import { RequirementModel, RequirementModelType } from "../models/requirement.model";
import { Requirement } from "../entities/requirement.entity";
import { CreateRequirementInterface } from "../interfaces/create-requirement.interface";
import { UpdateRequirementInterface } from "../interfaces/update-requirement.interface";
import { Op } from "@repo/custom-neogma";

@Injectable()
export class RequirementRepository {
  private requirementModel: RequirementModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.requirementModel = RequirementModel(this.neo4jService.getNeogma());
  }

  async create(createDto: CreateRequirementInterface): Promise<Requirement> {
    try {
      const requirement = await this.requirementModel.createOne({
        operation: createDto.operation,
        condition: createDto.condition,
        useCase: {
          where: [{ params: { id: createDto.useCaseId } }],
        },
        actors: {
          where: createDto.actorIds ? [{ params: { id: { [Op.in]: createDto.actorIds } } }] : [],
        },
      });

      return requirement;
    } catch (error) {
      throw new Error(`Failed to create requirement: ${error.message}`);
    }
  }

  async update(id: string, updateDto: UpdateRequirementInterface): Promise<Requirement> {
    try {
      const updateData: Record<string, any> = {};

      if (updateDto.operation !== undefined) {
        updateData.operation = updateDto.operation;
      }

      if (updateDto.condition !== undefined) {
        updateData.condition = updateDto.condition;
      }

      await this.requirementModel.updateOneOrThrow(updateData, {
        where: { id },
      });

      if (updateDto.actorIds !== undefined) {
        await this.requirementModel.deleteRelationships({
          alias: "actors",
          where: {
            source: { id },
          },
        });

        if (updateDto.actorIds.length > 0) {
          for (const actorId of updateDto.actorIds) {
            await this.requirementModel.relateTo({
              alias: "actors",
              where: {
                source: { id },
                target: { id: actorId },
              },
            });
          }
        }
      }

      const updatedRequirement = await this.requirementModel.findOneWithRelations({
        where: { id },
      });

      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ID ${id} not found after update`);
      }

      return updatedRequirement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update requirement: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.requirementModel.delete({
        where: { id },
        detach: true,
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to delete requirement: ${error.message}`);
    }
  }

  async getById(id: string): Promise<Requirement | null> {
    try {
      const requirement = await this.requirementModel.findOneWithRelations({
        where: { id },
        include: ["useCase", "actors", "nestedRequirements", "exceptions"],
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

  async addNestedRequirement(parentId: string, childId: string): Promise<Requirement> {
    try {
      await this.requirementModel.relateTo({
        alias: "nestedRequirements",
        where: {
          source: { id: parentId },
          target: { id: childId },
        },
      });

      const updatedRequirement = await this.getById(parentId);
      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ID ${parentId} not found after update`);
      }

      return updatedRequirement;
    } catch (error) {
      throw new Error(`Failed to add nested requirement: ${error.message}`);
    }
  }

  async removeNestedRequirement(parentId: string, childId: string): Promise<boolean> {
    try {
      const result = await this.requirementModel.deleteRelationships({
        alias: "nestedRequirements",
        where: {
          source: { id: parentId },
          target: { id: childId },
        },
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to remove nested requirement: ${error.message}`);
    }
  }

  async addException(requirementId: string, exceptionId: string): Promise<Requirement> {
    try {
      await this.requirementModel.relateTo({
        alias: "exceptions",
        where: {
          source: { id: requirementId },
          target: { id: exceptionId },
        },
      });

      const updatedRequirement = await this.getById(requirementId);
      if (!updatedRequirement) {
        throw new NotFoundException(`Requirement with ID ${requirementId} not found after update`);
      }

      return updatedRequirement;
    } catch (error) {
      throw new Error(`Failed to add exception: ${error.message}`);
    }
  }

  async removeException(requirementId: string, exceptionId: string): Promise<boolean> {
    try {
      const result = await this.requirementModel.deleteRelationships({
        alias: "exceptions",
        where: {
          source: { id: requirementId },
          target: { id: exceptionId },
        },
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Failed to remove exception: ${error.message}`);
    }
  }
  /**
   * تغيير ارتباط المتطلب من حالة استخدام إلى أخرى
   */
  async changeUseCase(
    requirementId: string,
    fromUseCaseId: string,
    toUseCaseId: string,
  ): Promise<boolean> {
    try {
      // حذف العلاقة مع حالة الاستخدام الأساسية
      await this.requirementModel.deleteRelationships({
        alias: "useCase",
        where: {
          source: { id: requirementId },
          target: { id: fromUseCaseId },
        },
      });

      // إنشاء علاقة مع حالة الاستخدام الثانوية
      await this.requirementModel.relateTo({
        alias: "useCase",
        where: {
          source: { id: requirementId },
          target: { id: toUseCaseId },
        },
      });

      return true;
    } catch (error) {
      throw new Error(`فشل في نقل المتطلب إلى حالة الاستخدام الجديدة: ${error.message}`);
    }
  }
}
