"use client";
import React, { useState } from "react";
import { useProjectDetail } from "../hooks/useProjectDetail";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import ProjectSidebar from "./ProjectSidebar";

export default function ProjectLayoutShell({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const { isLoading, isError, error } = useProjectDetail(projectId!);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  if (isLoading) return <Loading isOpen={isLoading} message="Loading..." mode="fullscreen" />;
  if (isError) return <ErrorMessage message={error?.message} />;

  return (
    <div
      className="flex min-h-screen bg-background text-foreground"
      style={{
        minWidth: isCollapsed ? 300 : 500,
      }}
    >
      <ProjectSidebar
        projectId={projectId}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        className="transition-all duration-300 flex-shrink-0"
      />

      <main
        className="flex-1 overflow-auto p-4 w-full transition-all duration-300"
        style={{
          minWidth: isCollapsed ? 300 : 500,
        }}
      >
        {children}
      </main>
    </div>
  );
}
