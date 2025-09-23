import { ProjectDto } from "@repo/shared-schemas";
import { FolderIcon } from "lucide-react";
import Link from "next/link";
import { route } from "nextjs-routes";
import { useEffect, useState } from "react";

interface ProjectCardProps {
  project: ProjectDto;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (!project.createdAt) return;
    const now = new Date();
    const projectDate = new Date(project.createdAt);
    const diffInHours = Math.floor((now.getTime() - projectDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) setTimeAgo("Just now");
    else if (diffInHours < 24) setTimeAgo(`${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`);
    else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) setTimeAgo(`${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`);
      else
        setTimeAgo(
          `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? "s" : ""} ago`,
        );
    }
  }, [project.createdAt]);

  return (
    <Link
      href={route({
        pathname: "/projects/[project-id]/actors",
        query: { "project-id": project.id },
      })}
      className="flex items-center justify-between px-4 bg-surface rounded-lg border border-border hover:bg-card-hover transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <FolderIcon className=" text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="p-4 text-foreground font-medium"> {project.name}</span>
      </div>
      <span className="text-muted-foreground text-sm">{timeAgo || "Recently"}</span>
    </Link>
  );
}
