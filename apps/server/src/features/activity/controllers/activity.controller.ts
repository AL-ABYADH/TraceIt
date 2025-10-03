import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import { ActivityService } from "../services/activity.service";
import { Activity } from "../entities/activity.entity";
import {
  ActivityDto,
  type ActivityIdDto,
  activityIdSchema,
  type CreateActivityDto,
  createActivitySchema,
  type RequirementOptionalIdDto,
  requirementOptionalIdSchema,
  type UpdateActivityDto,
  updateActivitySchema,
  type UseCaseOptionalIdDto,
  useCaseOptionalIdSchema,
} from "@repo/shared-schemas";

@Controller("activities")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async add(@Body(zodBody(createActivitySchema)) dto: CreateActivityDto): Promise<ActivityDto> {
    return await this.activityService.create(dto);
  }

  @Get()
  async list(
    @Query(zodQuery(requirementOptionalIdSchema)) params?: RequirementOptionalIdDto,
    @Query(zodQuery(useCaseOptionalIdSchema)) useCaseParams?: UseCaseOptionalIdDto,
  ): Promise<ActivityDto[]> {
    // Filter by use case if provided
    if (useCaseParams?.useCaseId) {
      return await this.activityService.listByUseCase(useCaseParams.useCaseId);
    }

    // Filter by requirement if provided
    if (params?.requirementId) {
      return await this.activityService.listByRequirement(params.requirementId);
    }

    // Return all activities if no filters
    return await this.activityService.listAll();
  }

  @Get(":activityId")
  async getById(@Param(zodParam(activityIdSchema)) params: ActivityIdDto): Promise<Activity> {
    return await this.activityService.findById(params.activityId);
  }

  @Put(":activityId")
  async update(
    @Param(zodParam(activityIdSchema)) params: ActivityIdDto,
    @Body(zodBody(updateActivitySchema)) dto: UpdateActivityDto,
  ): Promise<ActivityDto> {
    return await this.activityService.update(params.activityId, dto);
  }

  @Delete(":activityId")
  async remove(
    @Param(zodParam(activityIdSchema)) params: ActivityIdDto,
  ): Promise<{ success: boolean }> {
    return { success: await this.activityService.remove(params.activityId) };
  }
}
