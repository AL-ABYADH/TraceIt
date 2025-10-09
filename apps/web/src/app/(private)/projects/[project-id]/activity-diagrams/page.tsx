"use client";

import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import ActivityDiagramFlow from "@/modules/features/activity-diagram/components/ActivityDiagramFlow";
import CreateActivityDiagram from "@/modules/features/activity-diagram/components/CreateActivityDiagram";
import { useActivityDiagram } from "@/modules/features/activity-diagram/hooks/useActivityDiagram";
import { useUseCases } from "@/modules/features/use-case/hooks/useUseCases";
import { ApiError } from "@/services/api/api-errors";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import SelectField from "@/components/SelectField";
import Button from "@/components/Button";
import { useEffect, useMemo, useState } from "react";
import { route } from "nextjs-routes";
import { UseCaseSubtype } from "@repo/shared-schemas";

export default function UseCaseDiagramPage() {
  const params = useParams<"/projects/[project-id]/activity-diagrams">();
  const router = useRouter();
  const searchParams = useSearchParams();
  const useCaseId = searchParams.get("useCaseId");

  const projectId = params["project-id"];

  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string | undefined>(
    useCaseId ?? undefined,
  );

  const {
    data: useCases,
    isError: isUseCasesError,
    isLoading: isUseCasesLoading,
    error: useCasesError,
  } = useUseCases(projectId, UseCaseSubtype.PRIMARY);

  useEffect(() => {
    if (!useCases || useCases.length === 0) return;
    if (!selectedUseCaseId) {
      const def = useCases[0];
      setSelectedUseCaseId(def?.id);
      router.push(
        route({
          pathname: "/projects/[project-id]/activity-diagrams",
          query: { "project-id": projectId, useCaseId: def?.id },
        }),
      );
    }
  }, [useCases, selectedUseCaseId, projectId, router]);

  const selectedUseCase = useMemo(
    () => useCases?.find((u) => u.id === selectedUseCaseId),
    [useCases, selectedUseCaseId],
  );

  const {
    data: activityDiagram,
    isLoading: isActivityDiagramLoading,
    isError: isActivityDiagramError,
    error: activityDiagramError,
  } = useActivityDiagram(selectedUseCaseId);

  if (isUseCasesLoading) {
    return <Loading isOpen={isUseCasesLoading} message="Loading use cases..." mode="dialog" />;
  }

  if (isUseCasesError) {
    return <ErrorMessage message={useCasesError.message} />;
  }

  // No use cases at all -> show CTA to create one
  if (!useCases || useCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">No use cases found</h2>
        <p className="text-gray-400 text-center max-w-md">
          Create a use case first, then you can view and edit its activity diagram.
        </p>
        <Button
          onClick={() =>
            router.push(
              route({
                pathname: "/projects/[project-id]/use-cases",
                query: { "project-id": projectId },
              }),
            )
          }
        >
          Go to Use Cases
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <div className="max-w-md">
          <SelectField
            label="Primary Use Case"
            placeholder="Select a use case"
            value={selectedUseCaseId ?? ""}
            onChange={(e) => {
              const newUseCaseId = e.target.value;
              setSelectedUseCaseId(newUseCaseId);
              router.push(
                route({
                  pathname: "/projects/[project-id]/activity-diagrams",
                  query: { "project-id": projectId, useCaseId: newUseCaseId },
                }),
              );
            }}
          >
            {useCases.map((uc) => (
              <option key={uc.id} value={uc.id}>
                {uc.name}
              </option>
            ))}
          </SelectField>
        </div>
        {selectedUseCaseId && (
          <Button
            onClick={() =>
              router.push(
                route({
                  pathname: "/projects/[project-id]/use-cases/[use-case-id]/details",
                  query: { "project-id": projectId, "use-case-id": selectedUseCaseId },
                }),
              )
            }
          >
            View Use Case Description
          </Button>
        )}
      </div>

      {isActivityDiagramLoading && selectedUseCase && (
        <Loading
          isOpen={isActivityDiagramLoading}
          message={`Loading activity diagram for use case: ${selectedUseCase.name}...`}
          mode="dialog"
        />
      )}

      {isActivityDiagramError &&
        (!(activityDiagramError instanceof ApiError) ||
          (activityDiagramError instanceof ApiError &&
            activityDiagramError.statusCode !== 404)) && (
          <ErrorMessage
            message={`Error loading activity diagram for use case: ${selectedUseCase?.name} : ${activityDiagramError!.message}`}
          />
        )}

      {!isActivityDiagramLoading && !activityDiagram && selectedUseCaseId && (
        <CreateActivityDiagram useCaseId={selectedUseCaseId} projectId={projectId} />
      )}

      {!isActivityDiagramLoading && activityDiagram && selectedUseCaseId && (
        <ActivityDiagramFlow diagram={activityDiagram} useCaseId={selectedUseCaseId} />
      )}
    </div>
  );
}
