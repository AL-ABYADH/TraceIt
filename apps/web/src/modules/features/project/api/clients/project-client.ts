import { http } from "@/services/api/http";
import { projectEndpoints } from "../project-endpoints";
import {
  CreateProjectDto,
  ProjectDto,
  ProjectStatus,
  UpdateProjectDto,
} from "@repo/shared-schemas";

async function listActiveProjects(): Promise<ProjectDto[]> {
  return http.get(projectEndpoints.list, { params: { status: ProjectStatus.ACTIVE } });
}

async function listArchivedProjects(): Promise<ProjectDto[]> {
  return http.get(projectEndpoints.list, { params: { status: ProjectStatus.ARCHIVED } });
}

async function getProject(id: string): Promise<ProjectDto> {
  return http.get(projectEndpoints.detail, { pathParams: { id } });
}

async function createProject(project: CreateProjectDto): Promise<ProjectDto> {
  return http.post(projectEndpoints.list, { body: project });
}

async function removeProject(id: string) {
  return http.del(projectEndpoints.detail, { pathParams: { id } });
}

async function updateProject(id: string, project: UpdateProjectDto): Promise<ProjectDto> {
  return http.put(projectEndpoints.detail, { body: project, pathParams: { id } });
}

export const projectClient = {
  listActiveProjects,
  listArchivedProjects,
  getProject,
  createProject,
  updateProject,
  removeProject,
};
