import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RequirementRepository } from "../repositories/requirement.repository";
import { ExceptionalRequirementRepository } from "../repositories/exceptional-requirement.repository";
import { CreateRequirementInterface } from "../interfaces/create-requirement.interface";
import { UpdateRequirementInterface } from "../interfaces/update-requirement.interface";
import { Requirement } from "../entities/requirement.entity";
import { UseCaseService } from "../../use-case/services/use-case/use-case.service";
import { ActorService } from "../../actor/services/actor/actor.service";

@Injectable()
export class RequirementService {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly exceptionalRequirementRepository: ExceptionalRequirementRepository,
    private readonly useCaseService: UseCaseService,
    private readonly actorService: ActorService,
  ) {}

  /**
   * إنشاء متطلب جديد
   */
  async createRequirement(createDto: CreateRequirementInterface): Promise<Requirement> {
    try {
      if (createDto.exceptionId && createDto.parentRequirementId) {
        throw new BadRequestException(
          "You must provide either parentRequirementId or exceptionId, but not both.",
        );
      }
      await this.useCaseService.findById(createDto.useCaseId);

      if (createDto.actorIds && createDto.actorIds.length > 0) {
        for (const actorId of createDto.actorIds) {
          await this.actorService.findById(actorId);
        }
      }

      const created = await this.requirementRepository.create(createDto);
      if (createDto.parentRequirementId) {
        await this.requirementRepository.addNestedRequirement(
          createDto.parentRequirementId,
          created.id,
        );
      } else if (createDto.exceptionId) {
        await this.exceptionalRequirementRepository.addRequirement(
          createDto.exceptionId,
          created.id,
        );
      }
      return created;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * تحديث متطلب موجود
   */
  async updateRequirement(id: string, updateDto: UpdateRequirementInterface): Promise<Requirement> {
    const requirement = await this.findById(id);

    if (updateDto.actorIds && updateDto.actorIds.length > 0) {
      for (const actorId of updateDto.actorIds) {
        await this.actorService.findById(actorId);
      }
    }

    return this.requirementRepository.update(id, updateDto);
  }

  /**
   * البحث عن متطلب بواسطة المعرف
   */
  async findById(id: string): Promise<Requirement> {
    const requirement = await this.requirementRepository.getById(id);
    if (!requirement) {
      throw new NotFoundException(`المتطلب بالمعرف ${id} غير موجود`);
    }
    return requirement;
  }

  /**
   * الحصول على المتطلبات المرتبطة بحالة استخدام معينة
   */
  async findByUseCase(useCaseId: string): Promise<Requirement[]> {
    await this.useCaseService.findById(useCaseId);
    return this.requirementRepository.getByUseCase(useCaseId);
  }

  /**
   * إضافة متطلب متداخل إلى متطلب موجود
   */
  async addNestedRequirement(parentId: string, childId: string): Promise<Requirement> {
    await this.findById(parentId);
    await this.findById(childId);
    return this.requirementRepository.addNestedRequirement(parentId, childId);
  }

  /**
   * إزالة متطلب متداخل
   */
  async removeNestedRequirement(parentId: string, childId: string): Promise<boolean> {
    await this.findById(parentId);
    await this.findById(childId);
    return this.requirementRepository.removeNestedRequirement(parentId, childId);
  }

  /**
   * إضافة استثناء إلى متطلب
   */
  async addException(requirementId: string, exceptionId: string): Promise<Requirement> {
    await this.findById(requirementId);

    const exception = await this.exceptionalRequirementRepository.getById(exceptionId);
    if (!exception) {
      throw new NotFoundException(`الاستثناء بالمعرف ${exceptionId} غير موجود`);
    }

    return this.requirementRepository.addException(requirementId, exceptionId);
  }

  /**
   * إزالة استثناء من متطلب
   */
  async removeException(requirementId: string, exceptionId: string): Promise<boolean> {
    await this.findById(requirementId);

    const exception = await this.exceptionalRequirementRepository.getById(exceptionId);
    if (!exception) {
      throw new NotFoundException(`الاستثناء بالمعرف ${exceptionId} غير موجود`);
    }

    return this.requirementRepository.removeException(requirementId, exceptionId);
  }

  /**
   * حذف متطلب
   */
  async removeRequirement(id: string): Promise<boolean> {
    const data = await this.findById(id);
    if (data.nestedRequirements) {
      for (const nestedRequirement of data.nestedRequirements) {
        await this.requirementRepository.delete(nestedRequirement.id);
      }
    }
    if (data.exceptions) {
      for (const exception of data.exceptions) {
        await this.exceptionalRequirementRepository.delete(exception.id);
      }
    }
    return this.requirementRepository.delete(id);
  }

  /**
   * نقل متطلبات متداخلة من حالة استخدام أساسية إلى حالة استخدام ثانوية
   * @param parentRequirementId معرف المتطلب الأساسي
   * @param fromUseCaseId معرف حالة الاستخدام الأساسية
   * @param toUseCaseId معرف حالة الاستخدام الثانوية
   */
  async transferNestedRequirementsToSecondaryUseCase(
    parentRequirementId: string,
    fromUseCaseId: string,
    toUseCaseId: string,
  ): Promise<boolean> {
    // التحقق من وجود المتطلبات وحالات الاستخدام
    const parentRequirement = await this.findById(parentRequirementId);
    await this.useCaseService.findById(fromUseCaseId);
    await this.useCaseService.findById(toUseCaseId);

    if (
      !parentRequirement.nestedRequirements ||
      parentRequirement.nestedRequirements.length === 0
    ) {
      throw new BadRequestException(`المتطلب رقم ${parentRequirementId} ليس لديه متطلبات متداخلة.`);
    }

    // استخراج المعرفات للمتطلبات المتداخلة
    const nestedRequirementIds = parentRequirement.nestedRequirements.map((req) => req.id);

    // انقل كل متطلب متداخل من حالة الاستخدام الأساسية إلى حالة الاستخدام الثانوية
    for (const reqId of nestedRequirementIds) {
      await this.requirementRepository.changeUseCase(reqId, fromUseCaseId, toUseCaseId);
    }

    return true;
  }
}
