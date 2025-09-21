"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { route } from "nextjs-routes";
import { useProjectDetail } from "@/modules/features/project/hooks/useProjectDetail";
import { ProjectDto } from "@repo/shared-schemas";

const pages = [
  { title: "Actors", href: "/projects/[project-id]/actors" },
  { title: "Use Cases", href: "/projects/[project-id]/use-cases" },
  // { title: "Requirements", href: "/projects/[project-id]/requirements" },
  // { title: "Use Case Diagram", href: "/projects/[project-id]/use-case-diagram" },
  // { title: "Activity Diagram", href: "/projects/[project-id]/activity-diagram" },
] as const;

type Page = (typeof pages)[number];

export default function ProjectSidebar({ projectId }: { projectId: string }) {
  const pathname = usePathname() || "/";
  const { data } = useProjectDetail(projectId!, (data: ProjectDto) => data.name);

  return (
    <aside className="md:flex md:flex-col w- shrink-0 border-r border-border bg-surface">
      {/* Project Name */}
      <div className="px-4 py-6 text-foreground font-semibold text-lg border-b border-border">
        {data || "Project"}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-2">
        <nav aria-label="Sidebar" className="space-y-1">
          {pages.map((p: Page) => {
            const active = pathname === p.href.replace("[project-id]", projectId!);

            return (
              <Link
                key={p.href}
                href={route({ pathname: p.href, query: { "project-id": projectId } })}
                className={`group flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                  active
                    ? "bg-card text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-card-hover"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="truncate">{p.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
