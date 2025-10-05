"use client";

import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import UseCaseDiagramFlow from "@/modules/features/use-case-diagram/components/UseCaseDiagramFlow";
import { useUseCaseDiagram } from "@/modules/features/use-case-diagram/hooks/useUseCaseDiagram";
import { useParams } from "next/navigation";
import { ApiError } from "@/services/api/api-errors";
import Button from "@/components/Button";
import CreateUseCaseDiagram from "@/modules/features/use-case-diagram/components/CreateUseCaseDiagram";

export default function UseCaseDiagramPage() {
  const params = useParams<"/projects/[project-id]/use-case-diagram">();
  const projectId = params["project-id"];

  const { data, isLoading, isError, error } = useUseCaseDiagram(projectId);

  if (isLoading) {
    return <Loading isOpen={isLoading} message="Loading use case diagram..." mode="dialog" />;
  }

  if (
    isError &&
    (!(error instanceof ApiError) || (error instanceof ApiError && error.statusCode !== 404))
  ) {
    return <ErrorMessage message={`Error loading use case diagram: ${error!.message}`} />;
  }

  if (!data) {
    return <CreateUseCaseDiagram projectId={projectId} />;
  }

  return <UseCaseDiagramFlow diagram={data!} />;
}
