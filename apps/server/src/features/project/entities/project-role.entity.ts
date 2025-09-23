import { ProjectRoleAttributes, ProjectRoleRelationships } from "../models/project-role.model";

export type ProjectRole = ProjectRoleAttributes & Partial<ProjectRoleRelationships>;
