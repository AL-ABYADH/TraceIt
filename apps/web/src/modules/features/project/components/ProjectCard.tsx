import { ProjectListDto } from "@repo/shared-schemas";
import Link from "next/link";
import { route } from "nextjs-routes";

export default function ProjectCard({ project }: { project: ProjectListDto }) {
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
