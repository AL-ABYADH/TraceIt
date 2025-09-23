// import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
// import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
// import {
//   createDiagramSchema,
//   type CreateDiagramDto,
//   projectIdSchema,
//   type ProjectIdDto,
//   updateDiagramSchema,
//   type UpdateDiagramDto,
//   uuidParamsSchema,
//   type UuidParamsDto,
//   UseCaseDiagramDetailDto,
// } from "@repo/shared-schemas";
// import { UseCaseDiagramService } from "../../services/use-case-diagram/use-case-diagram.service";
//
// @Controller("use-case-diagrams")
// export class UseCaseDiagramController {
//   constructor(private readonly useCaseDiagramService: UseCaseDiagramService) {}
//
//   @Post()
//   async create(
//     @Body(zodBody(createDiagramSchema)) createDto: CreateDiagramDto,
//   ): Promise<UseCaseDiagramDetailDto> {
//     return await this.useCaseDiagramService.create(createDto);
//   }
//
//   @Get()
//   async listByProject(
//     @Query(zodQuery(projectIdSchema)) params: ProjectIdDto,
//   ): Promise<UseCaseDiagramDetailDto[]> {
//     return await this.useCaseDiagramService.listByProject(params.projectId);
//   }
//
//   @Get(":id")
//   async getById(
//     @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
//   ): Promise<UseCaseDiagramDetailDto> {
//     return await this.useCaseDiagramService.findById(params.id);
//   }
//
//   @Put(":id")
//   async update(
//     @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
//     @Body(zodBody(updateDiagramSchema)) updateDto: UpdateDiagramDto,
//   ): Promise<UseCaseDiagramDetailDto> {
//     return await this.useCaseDiagramService.update(params.id, updateDto);
//   }
//
//   @Delete(":id")
//   async delete(
//     @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
//   ): Promise<{ success: boolean }> {
//     return { success: await this.useCaseDiagramService.delete(params.id) };
//   }
//
//   @Post(":id/use-cases/:useCaseId")
//   async addUseCase(
//     @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
//     @Param("useCaseId") useCaseId: string,
//   ): Promise<{ success: boolean }> {
//     return { success: await this.useCaseDiagramService.addUseCase(params.id, useCaseId) };
//   }
//
//   @Delete(":id/use-cases/:useCaseId")
//   async removeUseCase(
//     @Param(zodParam(uuidParamsSchema)) params: UuidParamsDto,
//     @Param("useCaseId") useCaseId: string,
//   ): Promise<{ success: boolean }> {
//     return { success: await this.useCaseDiagramService.removeUseCase(params.id, useCaseId) };
//   }
// }
