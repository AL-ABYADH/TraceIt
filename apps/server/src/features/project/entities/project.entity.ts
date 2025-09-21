import { ProjectAttributes, ProjectRelationships } from "../models/project.model";

export type Project = ProjectAttributes & Partial<ProjectRelationships>;
