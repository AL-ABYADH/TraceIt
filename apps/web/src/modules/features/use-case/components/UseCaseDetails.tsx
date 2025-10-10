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
import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
import UseCaseForm from "./UseCaseForm";

import { useRouter } from "next/navigation";
import { route } from "nextjs-routes";
import { PrimaryUseCaseDetailDto, UseCaseSubtype } from "@repo/shared-schemas";
import { useSecondaryUseCaseDetail } from "../hooks/useSecondaryUseCaseDetail";
import SecondaryUseCaseForm from "./SecondaryUseCaseForm";

interface UseCaseDetailsProps {
  projectId: string;
  useCaseId: string;
  useCaseSubType: UseCaseSubtype;
}

export default function UseCaseDetails({
  projectId,
  useCaseId,
  useCaseSubType,
}: UseCaseDetailsProps) {
  const router = useRouter();
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingSecondaryId, setEditingSecondaryId] = useState<string | null>(null);
  const [isSecondaryFormOpen, setSecondaryFormOpen] = useState(false);

  const isPrimary = useCaseSubType === "PRIMARY";

  const primary = usePrimaryUseCaseDetail(useCaseId, undefined, {}, isPrimary);
  const secondary = useSecondaryUseCaseDetail(useCaseId, undefined, {}, !isPrimary);

  const { data, isLoading, isError, error } = isPrimary ? primary : secondary;

  const {
    data: requirements,
    isLoading: reqLoading,
    isError: reqError,
    error: reqErrorMessage,
  } = useUseCasesRequirements(useCaseId);

  if (isLoading || reqLoading)
    return <Loading isOpen message="Loading use case and requirements..." />;

  if (isError) return <ErrorMessage message={error?.message ?? "Failed to load use case"} />;
  if (reqError)
    return <ErrorMessage message={reqErrorMessage?.message ?? "Failed to load requirements"} />;
  if (!data || !requirements) return <ErrorMessage message="Use case or requirements not found" />;

  const orderedRequirements = sortRequirementsByCreatedAt(_.cloneDeep(requirements));

  function sortRequirementsByCreatedAt(requirements: any[]): any[] {
    if (!Array.isArray(requirements)) return [];
    const sorted = _.orderBy(requirements, ["createdAt"], ["asc"]);
    return sorted.map((req) => ({
      ...req,
      nestedRequirements: sortRequirementsByCreatedAt(req.nestedRequirements || []),
      exceptions: sortRequirementsByCreatedAt(req.exceptions || []),
      requirementException: sortRequirementsByCreatedAt(req.requirementException || []),
    }));
  }

  return (
    <div className="p-6">
      <div className="rounded-lg bg-card text-card-foreground shadow-sm border p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Use Case: {data.name}{" "}
            <span className="text-muted-foreground text-base">({useCaseSubType})</span>
          </h1>
          <div className="flex items-center gap-2">
            {isPrimary && (
              <Button
                variant="ghost"
                onClick={() =>
                  router.push(
                    route({
                      pathname: "/projects/[project-id]/activity-diagrams",
                      query: { "project-id": projectId, useCaseId },
                    }),
                  )
                }
              >
                View Activity Diagram
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                if (isPrimary) {
                  setEditOpen(true); // open primary form
                } else {
                  setEditingSecondaryId(useCaseId); // for secondary, use this ID
                  setSecondaryFormOpen(true); // open secondary form
                }
              }}
            >
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Only show details for primary use case */}
        {isPrimary && (
          <div className="mt-6 space-y-4">
            <Section title="Primary Actors">
              {(data as PrimaryUseCaseDetailDto).primaryActors
                ?.map((a: any) => a.name)
                .join(", ") || "—"}
            </Section>
            <Section title="Actors">
              {(data as PrimaryUseCaseDetailDto).secondaryActors
                ?.map((a: any) => a.name)
                .join(", ") || "—"}
            </Section>
            <Section title="Importance Level">
              {(data as PrimaryUseCaseDetailDto).importanceLevel}
            </Section>
            <Section title="Description">
              {(data as PrimaryUseCaseDetailDto).description || "—"}
            </Section>
          </div>
        )}

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

        {/* Forms */}
        {isPrimary && (
          <UseCaseForm
            isOpen={isEditOpen}
            onClose={() => setEditOpen(false)}
            projectId={projectId}
            mode="edit"
            useCaseId={useCaseId}
          />
        )}
        {!isPrimary && (
          <SecondaryUseCaseForm
            isOpen={isSecondaryFormOpen}
            onClose={() => setSecondaryFormOpen(false)}
            mode="edit"
            projectId={projectId}
            primaryUseCaseId={useCaseId}
            secondaryUseCaseId={editingSecondaryId ?? undefined}
            initialName={data.name} // pass secondary name here
            invalidateUseCaseId={useCaseId}
          />
        )}
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
