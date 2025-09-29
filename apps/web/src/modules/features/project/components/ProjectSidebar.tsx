"use client";

import { useProjectDetail } from "@/modules/features/project/hooks/useProjectDetail";
import { ProjectDto } from "@repo/shared-schemas";
import clsx from "clsx";
import {
  Activity,
  GitBranchIcon,
  UsersIcon,
  Ellipsis,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { route } from "nextjs-routes";

const pages = [
  { title: "Actors", href: "/projects/[project-id]/actors", icon: UsersIcon },
  { title: "Use Cases", href: "/projects/[project-id]/use-cases", icon: GitBranchIcon },
  { title: "Requirements", href: "/projects/[project-id]/requirements", icon: Ellipsis },
  {
    title: "Use Case Diagram",
    href: "/projects/[project-id]/use-case-diagram",
    icon: GitBranchIcon,
  },
  {
    title: "Activity Diagram",
    href: "/projects/[project-id]/activity-diagram",
    icon: Activity,
  },
] as const;

type Page = (typeof pages)[number];

export default function ProjectSidebar({
  projectId,
  isCollapsed = false,
  toggleCollapse,
  className,
}: {
  projectId: string;
  isCollapsed?: boolean;
  toggleCollapse: () => void;
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const { data } = useProjectDetail(projectId!, (d: ProjectDto) => d.name);

  const isActive = (href: string) => pathname === href.replace("[project-id]", projectId!);

  return (
    <aside
      className={clsx(
        "flex flex-col border-r border-border bg-surface/95 backdrop-blur-md transition-all duration-300",
        isCollapsed ? "w-20 min-w-[80px]" : "w-96 max-w-[320px]",
        className,
      )}
    >
      <nav className="flex-1 flex-col gap-2 px-3 overflow-y-auto relative max-w-96">
        {/* Header */}
        <div
          className={clsx(
            "flex items-center h-16 border-b border-border bg-card/30 backdrop-blur-sm mb-4 px-2 transition-all duration-300",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {!isCollapsed && (
            <div className="flex-1 min-w-0 mr-2">
              <h2
                className="text-lg font-semibold text-foreground truncate overflow-hidden whitespace-nowrap"
                title={data || "Project"}
              >
                {data || "Project"}
              </h2>
            </div>
          )}

          {/* Collapse button */}
          <button
            onClick={toggleCollapse}
            className="p-1 rounded hover:bg-card/50 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Pages */}
        {pages.map((page: Page) => {
          const Icon = page.icon;
          const active = isActive(page.href);

          return (
            <Link
              key={page.href}
              href={route({ pathname: page.href, query: { "project-id": projectId } })}
              className={clsx(
                "group relative mb-2 flex items-center rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface",
                active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-card hover:text-foreground",
                isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3",
              )}
            >
              {active && !isCollapsed && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground/40 rounded-r-full" />
              )}
              <Icon
                className={clsx(
                  "flex-shrink-0 w-5 h-5 transition-all duration-300",
                  isCollapsed ? "mx-auto" : "",
                )}
              />
              {!isCollapsed && <span className="truncate font-medium">{page.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
