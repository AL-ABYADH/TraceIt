import { ProjectListDto } from "@repo/shared-schemas";

export default function ProjectCard({ project }: { project: ProjectListDto }) {
  return <div>{project.name}</div>;
}
