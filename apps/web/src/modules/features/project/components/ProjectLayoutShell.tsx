"use client";
import React from "react";
import { useProjectDetail } from "../hooks/useProjectDetail";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

export default function ProjectLayoutShell({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const params = useParams();
  const { isLoading, isError, error } = useProjectDetail(projectId!);

  if (isLoading) return <Loading isOpen={isLoading} message="Loading..." mode="fullscreen" />;
  if (isError) return <ErrorMessage message={error?.message} />;

  return <>{children}</>;
}
