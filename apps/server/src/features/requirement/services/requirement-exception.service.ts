import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ExceptionalRequirementRepository } from "../repositories/exceptional-requirement.repository";
import { CreateRequirementExceptionInterface } from "../interfaces/create-requirement.interface";
import { UpdateRequirementExceptionInterface } from "../interfaces/update-requirement.interface";
import { RequirementException } from "../entities/requirement-exception.entity";
import { RequirementService } from "./requirement.service";

@Injectable()
export class RequirementExceptionService {
  constructor(
    private readonly exceptionalRequirementRepository: ExceptionalRequirementRepository,
    private readonly requirementService: RequirementService,
  ) {}

  /**
   * إنشاء استثناء جديد
   */
  async create(createDto: CreateRequirementExceptionInterface): Promise<RequirementException> {
    try {
      createDto.requirementIds.map(async (item) => {
        await this.requirementService.findById(item);
      });

      return this.exceptionalRequirementRepository.create(createDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * تحديث استثناء موجود
   */
  async update(
    id: string,
    updateDto: UpdateRequirementExceptionInterface,
  ): Promise<RequirementException> {
    await this.findById(id);
    return this.exceptionalRequirementRepository.update(id, updateDto.name);
  }

  /**
   * البحث عن استثناء بواسطة المعرف
   */
  async findById(id: string): Promise<RequirementException> {
    const exception = await this.exceptionalRequirementRepository.getById(id);
    if (!exception) {
      throw new NotFoundException(`الاستثناء بالمعرف ${id} غير موجود`);
    }
    return exception;
  }

  /**
   * إضافة متطلب إلى استثناء
   */
  async addRequirement(exceptionId: string, requirementId: string): Promise<RequirementException> {
    await this.findById(exceptionId);
    await this.requirementService.findById(exceptionId);
    return this.exceptionalRequirementRepository.addRequirement(exceptionId, requirementId);
  }

  /**
   * إزالة متطلب من استثناء
   */
  async removeRequirement(exceptionId: string, requirementId: string): Promise<boolean> {
    await this.findById(exceptionId);
    await this.requirementService.findById(exceptionId);
    return this.exceptionalRequirementRepository.removeRequirement(exceptionId, requirementId);
  }

  /**
   * حذف استثناء
   */
  async remove(id: string): Promise<boolean> {
    await this.findById(id);
    return this.exceptionalRequirementRepository.delete(id);
  }
}
