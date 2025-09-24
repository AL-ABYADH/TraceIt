// import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
// import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
// import {
//   createDiagramSchema,
//   projectIdSchema,
//   type ProjectIdDto,
//   UseCaseDiagramDetailDto,
//   type UseCaseIdDto,
//   useCaseIdSchema,
//   type CreateDiagramDto,
//   updateDiagramSchema,
//   type UpdateDiagramDto,
//   useCaseDiagramIdSchema,
//   type UseCaseDiagramIdDto,
// } from "@repo/shared-schemas";
// import { UseCaseDiagramService } from "../../services/use-case-diagram/use-case-diagram.service";

// @Controller("use-case-diagrams")
// export class UseCaseDiagramController {
//   constructor(private readonly useCaseDiagramService: UseCaseDiagramService) {}

//   @Post()
//   async create(
//     @Body(zodBody(createDiagramSchema)) createDto: CreateDiagramDto,
//   ): Promise<UseCaseDiagramDetailDto> {
//     return await this.useCaseDiagramService.create(createDto);
//   }

//   @Get()
//   async listByProject(
//     @Query(zodQuery(projectIdSchema)) params: ProjectIdDto,
//   ): Promise<UseCaseDiagramDetailDto[]> {
//     return await this.useCaseDiagramService.listByProject(params.projectId);
//   }

//   @Get(":useCaseDiagramId")
//   async getById(
//     @Param(zodParam(useCaseDiagramIdSchema)) params: UseCaseDiagramIdDto,
//   ): Promise<UseCaseDiagramDetailDto> {
//     return await this.useCaseDiagramService.findById(params.useCaseDiagramId);
//   }

//   @Put(":useCaseDiagramId")
//   async update(
//     @Param(zodParam(useCaseDiagramIdSchema)) params: UseCaseDiagramIdDto,
//     @Body(zodBody(updateDiagramSchema)) updateDto: UpdateDiagramDto,
//   ): Promise<UseCaseDiagramDetailDto> {
//     return await this.useCaseDiagramService.update(params.useCaseDiagramId, updateDto);
//   }

//   @Delete(":useCaseDiagramId")
//   async delete(
//     @Param(zodParam(useCaseDiagramIdSchema)) params: UseCaseDiagramIdDto,
//   ): Promise<{ success: boolean }> {
//     return { success: await this.useCaseDiagramService.delete(params.useCaseDiagramId) };
//   }

//   @Post(":useCaseDiagramId/use-cases/:useCaseId")
//   async addUseCase(
//     @Param(zodParam(useCaseDiagramIdSchema)) param1: UseCaseDiagramIdDto,
//     @Param(zodParam(useCaseIdSchema)) param2: UseCaseIdDto,
//   ): Promise<{ success: boolean }> {
//     return {
//       success: await this.useCaseDiagramService.addUseCase(
//         param1.useCaseDiagramId,
//         param2.useCaseId,
//       ),
//     };
//   }

//   @Delete(":useCaseDiagramId/use-cases/:useCaseId")
//   async removeUseCase(
//     @Param(zodParam(useCaseDiagramIdSchema)) param1: UseCaseDiagramIdDto,
//     @Param(zodParam(useCaseIdSchema)) param2: UseCaseIdDto,
//   ): Promise<{ success: boolean }> {
//     return {
//       success: await this.useCaseDiagramService.removeUseCase(
//         param1.useCaseDiagramId,
//         param2.useCaseId,
//       ),
//     };
//   }
// }
