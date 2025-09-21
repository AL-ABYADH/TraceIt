import { ProjectDto } from "@repo/shared-schemas";
import { FolderIcon } from "lucide-react";
import Link from "next/link";
import { route } from "nextjs-routes";

interface ProjectCardProps {
  project: ProjectDto;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getTimeAgo = (date: Date | string) => {
    const now = new Date();
    const projectDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - projectDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  };

  return (
    <Link
      href={route({
        pathname: "/projects/[project-id]/actors",
        query: { "project-id": project.id },
      })}
      className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:bg-card-hover transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <FolderIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-foreground font-medium">{project.name}</span>
      </div>
      <span className="text-muted-foreground text-sm">
        {project.createdAt ? getTimeAgo(project.createdAt) : "Recently"}
      </span>
    </Link>
  );
}
