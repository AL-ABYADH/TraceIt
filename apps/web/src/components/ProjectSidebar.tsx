"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { route } from "nextjs-routes";
import { useProjectDetail } from "@/modules/features/project/hooks/useProjectDetail";
import { ProjectDetailDto } from "@repo/shared-schemas";

const pages = [
  { title: "Actors", href: "/projects/[project-id]/actors" },
  { title: "Use Cases", href: "/projects/[project-id]/use-cases" },
] as const;

type Page = (typeof pages)[number];

export default function ProjectSidebar({ projectId }: { projectId: string }) {
  const pathname = usePathname() || "/";
  const { data } = useProjectDetail(projectId!, (data: ProjectDetailDto) => data.name);

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 border-r bg-black">
        {data}
        <div className="h-full overflow-y-auto py-6 px-4">
          <nav aria-label="Sidebar" className="space-y-1">
            {pages.map((p: Page) => {
              const active = pathname === p.href.replace("[project-id]", projectId!);
              return (
                <Link
                  key={p.href}
                  href={route({ pathname: p.href, query: { "project-id": projectId } })}
                  className={`group flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    active ? "bg-gray-700 text-indigo-200" : "hover:bg-gray-700"
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
    </>
  );
}
