import { ProjectDto } from "@repo/shared-schemas";
import Link from "next/link";
import { route } from "nextjs-routes";

export default function ProjectCard({ project }: { project: ProjectDto }) {
  return (
    <Link
      href={route({
        pathname: "/projects/[project-id]/actors",
        query: { "project-id": project.id },
      })}
    >
      {project.name}
    </Link>
  );
}
