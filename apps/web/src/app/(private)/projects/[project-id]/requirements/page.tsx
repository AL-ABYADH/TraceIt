"use client";

import { useParams, useSearchParams } from "next/navigation";
import { usePrimaryUseCases } from "@/modules/features/use-case/hooks/usePrimaryUseCases";
import UseCaseItem from "@/modules/features/use-case/components/UseCaseItem";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import {
  ExpansionProvider,
  useExpansion,
} from "@/modules/features/requirement/contexts/ExpansionContext";
import { useEffect } from "react";

function RequirementsPageContent() {
  const params = useParams<"/projects/[project-id]/requirements">();
  const searchParams = useSearchParams();
  const projectId = params["project-id"];
  const useCaseId = searchParams.get("useCaseId");
  const requirementId = searchParams.get("requirementId");

  const { data: useCases = [], isLoading, isError, error } = usePrimaryUseCases(projectId);
  const { expandItems } = useExpansion();

  useEffect(() => {
    if (useCaseId) {
      expandItems([useCaseId]);
    }
  }, [useCaseId, expandItems]);

  if (isLoading) {
    return <Loading isOpen={isLoading} message="Loading use cases" />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message} />;
  }

  if (useCases.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-muted-foreground">
          No use cases found. Create use cases first to add requirements.
        </div>
      </div>
    );
  }

  const sortedUseCases = [...useCases].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="space-y-4">
      {sortedUseCases.map((useCase, index) => (
        <UseCaseItem
          key={useCase.id}
          useCase={useCase}
          projectId={projectId}
          number={index + 1}
          highlightedUseCaseId={useCaseId}
          highlightedRequirementId={requirementId}
        />
      ))}
    </div>
  );
}

export default function RequirementsPage() {
  return (
    <ExpansionProvider>
      <RequirementsPageContent />
    </ExpansionProvider>
  );
}
