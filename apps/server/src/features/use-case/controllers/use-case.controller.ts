import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { UseCaseService } from "../services/use-case/use-case.service";
import { UseCase } from "../entities/use-case.entity";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type AddUseCaseDto,
  addUseCaseSchema,
  type UpdateUseCaseDto,
  updateUseCaseSchema,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";
import { UseCaseSubtype } from "../enums/use-case-subtype.enum";

@Controller("use-cases")
export class UseCaseController {
  constructor(private readonly useCaseService: UseCaseService) {}

  @Post()
  async add(@Body(zodBody(addUseCaseSchema)) dto: AddUseCaseDto): Promise<{ data: UseCase }> {
    const newDto = {
      name: dto.name,
      projectId: dto.projectId,
      subType: dto.subType as UseCaseSubtype,
    };
    const useCase = await this.useCaseService.add(newDto);
    return { data: useCase };
  }

  @Get()
  async listByProject(
    @Query(zodQuery(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ data: UseCase[] }> {
    return { data: await this.useCaseService.listByProject(params.id) };
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
    @Body(zodBody(updateUseCaseSchema)) dto: UpdateUseCaseDto,
  ): Promise<UseCase> {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async remove(
    @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }
}
