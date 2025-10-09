"use client";

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import { usePrimaryUseCaseDetail } from "@/modules/features/use-case/hooks/usePrimaryUseCaseDetail";
import { Pencil } from "lucide-react";
import { useState } from "react";
import MainFlowSection from "../../requirement/components/MainFlowSection";
import RecursiveFlowSection from "../../requirement/components/RecursiveFlowSection";
import _ from "lodash";
// If you need types, run: pnpm add -D @types/lodash
import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
import UseCaseForm from "./UseCaseForm";

import { useRouter } from "next/navigation";
import { route } from "nextjs-routes";

interface UseCaseDetailsProps {
  projectId: string;
  useCaseId: string;
}

export default function UseCaseDetails({ projectId, useCaseId }: UseCaseDetailsProps) {
  const { data, isLoading, isError, error } = usePrimaryUseCaseDetail(useCaseId);
  const {
    data: requirements,
    isLoading: reqLoading,
    isError: reqError,
    error: reqErrorMessage,
  } = useUseCasesRequirements(useCaseId);
  const [isEditOpen, setEditOpen] = useState(false);
  const router = useRouter();

  // Keep showing loading until both use case and requirements are loaded
  if (isLoading || reqLoading)
    return <Loading isOpen message="Loading use case and requirements..." />;
  if (isError) return <ErrorMessage message={error?.message ?? "Failed to load use case"} />;
  if (reqError)
    return <ErrorMessage message={reqErrorMessage?.message ?? "Failed to load requirements"} />;
  if (!data || !requirements) return <ErrorMessage message="Use case or requirements not found" />;

  const primaryActors = data.primaryActors?.map((a) => a.name).join(", ") || "—";
  const secondaryActors = data.secondaryActors?.map((a) => a.name).join(", ") || "—";
  const description = data.description || "—";

  function sortRequirementsByCreatedAt(requirements: any[]): any[] {
    if (!Array.isArray(requirements)) return [];

    // Sort current level
    const sorted = _.orderBy(requirements, ["createdAt"], ["asc"]);

    // Recursively sort all nested levels
    return sorted.map((req) => {
      const cloned = { ...req };

      // If this requirement has nested lists, sort them too
      if (Array.isArray(cloned.nestedRequirements)) {
        cloned.nestedRequirements = sortRequirementsByCreatedAt(cloned.nestedRequirements);
      }
      if (Array.isArray(cloned.exceptions)) {
        cloned.exceptions = sortRequirementsByCreatedAt(cloned.exceptions);
      }
      if (Array.isArray(cloned.requirementException)) {
        cloned.requirementException = sortRequirementsByCreatedAt(cloned.requirementException);
      }

      return cloned;
    });
  }

  const clonedRequirements = _.cloneDeep(requirements);
  const orderedRequirements = sortRequirementsByCreatedAt(clonedRequirements);

  return (
    <div className="p-6">
      <div className="rounded-lg bg-card text-card-foreground shadow-sm border p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Use Case: {data.name}{" "}
            <span className="text-muted-foreground text-base">({data.subtype})</span>
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  route({
                    pathname: "/projects/[project-id]/activity-diagrams",
                    query: { "project-id": projectId, useCaseId: useCaseId },
                  }),
                )
              }
            >
              View Activity Diagram
            </Button>
            <Button variant="ghost" onClick={() => setEditOpen(true)}>
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Section title="Primary Actors">{primaryActors}</Section>
          <Section title="Actors">{secondaryActors}</Section>
          <Section title="Importance Level">{data.importanceLevel}</Section>
          <Section title="Description">{description}</Section>
        </div>

        {/* Flows */}
        <MainFlowSection
          requirements={orderedRequirements}
          projectId={projectId}
          validatedUseCaseId={useCaseId}
        />
        <RecursiveFlowSection
          requirements={orderedRequirements}
          type="S"
          projectId={projectId}
          validatedUseCaseId={useCaseId}
        />

        <UseCaseForm
          isOpen={isEditOpen}
          onClose={() => setEditOpen(false)}
          projectId={projectId}
          mode="edit"
          useCaseId={useCaseId}
        />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-medium text-sm text-muted-foreground mb-1">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
