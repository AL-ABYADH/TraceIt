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
import { AddUseCaseDto } from "../dtos/add-use-case.dto";
import { UpdateUseCaseDto } from "../dtos/update-use-case.dto";
import { UseCase } from "../entities/use-case.entity";

@Controller("use-cases")
export class UseCaseController {
  constructor(private readonly useCaseService: UseCaseService) {}

  @Post()
  async add(@Body() dto: AddUseCaseDto) {
    const useCase = await this.useCaseService.add(dto);
    return { data: useCase };
  }

  @Get()
  async listByProject(@Query("projectId") projectId: string) {
    return { data: await this.useCaseService.listByProject(projectId) };
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateUseCaseDto): Promise<UseCase> {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }
}
