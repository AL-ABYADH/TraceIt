"use client";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import React, { useState } from "react";
import { useProjectDetail } from "../hooks/useProjectDetail";
import ProjectSidebar from "./ProjectSidebar";
import { useMaximization } from "@/contexts/MaximizationContext";

export default function ProjectLayoutShell({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const { isMaximized } = useMaximization();

  const { isLoading, isError, error } = useProjectDetail(projectId!);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  if (isLoading) return <Loading isOpen={isLoading} message="Loading..." mode="fullscreen" />;
  if (isError) return <ErrorMessage message={error?.message} />;

  const sidebarWidth = isCollapsed ? 80 : 250;

  return (
    <div className="flex h-full w-full bg-background text-foreground">
      {!isMaximized && (
        <div className="h-full flex-shrink-0 sticky top-0" style={{ width: sidebarWidth }}>
          <ProjectSidebar
            projectId={projectId}
            isCollapsed={isCollapsed}
            toggleCollapse={toggleCollapse}
            className="h-full"
          />
        </div>
      )}

      {/* Main scrolls only */}
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
