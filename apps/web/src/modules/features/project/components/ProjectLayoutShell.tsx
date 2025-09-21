"use client";
import ProjectLayoutLoading from "./ProjectLayoutLoading";
import ProjectLayoutError from "./ProjectLayoutError";
import { useProjectDetail } from "../hooks/useProjectDetail";
import { useParams } from "next/navigation";

export default function ProjectLayoutShell({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const params = useParams();
  const { isLoading, isError, error } = useProjectDetail(projectId!);

  if (isLoading) return <ProjectLayoutLoading />;
  if (isError) return <ProjectLayoutError error={error} />;

  return <>{children}</>;
}
