"use client";

import { useState } from "react";
import { usePrimaryUseCases } from "../../use-case/hooks/usePrimaryUseCases";
import UseCaseItem from "../../use-case/components/UseCaseItem";
import Button from "@/components/Button";

interface RequirementsListProps {
  projectId: string;
}

export default function RequirementsList({ projectId }: RequirementsListProps) {
  const { data: useCases = [], isLoading, isError, error } = usePrimaryUseCases(projectId);

  const handleAddSubRequirement = (requirementId: string) => {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading use cases...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
          Error loading use cases: {error?.message}
        </div>
      </div>
    );
  }

  if (useCases.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-muted-foreground">
          No use cases found. Create use cases first to add requirements.
        </div>
        <Button variant="ghost">Go to Use Cases</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {useCases.map((useCase) => (
        <UseCaseItem
          key={useCase.id}
          useCase={useCase}
          projectId={projectId}
          onAddSubRequirement={handleAddSubRequirement}
        />
      ))}
    </div>
  );
}
