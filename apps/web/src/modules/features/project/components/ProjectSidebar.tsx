"use client";

import { useProjectDetail } from "@/modules/features/project/hooks/useProjectDetail";
import { ProjectDto } from "@repo/shared-schemas";
import clsx from "clsx";
import { GitBranchIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { route } from "nextjs-routes";

const pages = [
  {
    title: "Actors",
    href: "/projects/[project-id]/actors",
    icon: UsersIcon,
  },
  {
    title: "Use Cases",
    href: "/projects/[project-id]/use-cases",
    icon: GitBranchIcon,
  },
  {
    title: "Use Case Diagram",
    href: "/projects/[project-id]/use-case-diagram",
    icon: GitBranchIcon,
  },
] as const;

type Page = (typeof pages)[number];

export default function ProjectSidebar({
  projectId,
  className,
}: {
  projectId: string;
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const { data } = useProjectDetail(projectId!, (d: ProjectDto) => d.name);

  const isActive = (href: string) => pathname === href.replace("[project-id]", projectId!);

  return (
    <aside
      className={clsx(
        "flex flex-col border-r border-border bg-surface/95 backdrop-blur-md",
        className,
      )}
    >
      <nav className="flex-1 flex-col gap-2 px-3 overflow-y-auto">
        <div className="flex items-center h-16 px-4 border-b border-border bg-card/30 backdrop-blur-sm mb-4">
          <h2 className="truncate text-lg font-semibold text-foreground">{data || "Project"}</h2>
        </div>

        {pages.map((page: Page) => {
          const Icon = page.icon;
          const active = isActive(page.href);

          return (
            <Link
              key={page.href}
              href={route({
                pathname: page.href,
                query: { "project-id": projectId },
              })}
              className={clsx(
                "group relative mb-2 flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface",
                active
                  ? "bg-primary text-primary-foreground shadow-md p-2"
                  : "text-muted-foreground hover:bg-card hover:text-foreground p-2",
                "px-4 py-3",
              )}
            >
              {active && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground/40 rounded-r-full p-2" />
              )}

              <Icon
                className={clsx(
                  "flex-shrink-0 w-5 h-5 transition-all duration-200",
                  active && "text-primary-foreground",
                )}
              />
              <div className="w-2"></div>
              <span className="truncate font-medium">{page.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
