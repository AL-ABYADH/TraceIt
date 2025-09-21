import { http } from "@/services/api/http";
import { projectEndpoints } from "../project-endpoints";
import {
  CreateProjectDto,
  ProjectDetailDto,
  ProjectListDto,
  ProjectStatus,
  UpdateProjectDto,
} from "@repo/shared-schemas";

async function listActiveProjects(): Promise<ProjectListDto[]> {
  return http.get(projectEndpoints.list, { params: { status: ProjectStatus.ACTIVE } });
}

async function listArchivedProjects(): Promise<ProjectListDto[]> {
  return http.get(projectEndpoints.list, { params: { status: ProjectStatus.ARCHIVED } });
}

async function getProject(id: string): Promise<ProjectDetailDto> {
  return http.get(projectEndpoints.detail, { pathParams: { id } });
}

async function createProject(project: CreateProjectDto): Promise<ProjectDetailDto> {
  return http.post(projectEndpoints.list, { body: project });
}

async function deleteProject(id: string) {
  return http.del(projectEndpoints.detail, { pathParams: { id } });
}

async function updateProject(id: string, project: UpdateProjectDto): Promise<ProjectDetailDto> {
  return http.put(projectEndpoints.detail, { body: project, pathParams: { id } });
}

export const projectClient = {
  listActiveProjects,
  listArchivedProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
