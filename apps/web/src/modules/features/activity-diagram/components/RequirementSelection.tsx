"use client";
import { useEffect, useMemo, useState } from "react";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { RequirementDto, RequirementListDto } from "@repo/shared-schemas";
import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
import { requirementClient } from "../../requirement/api/clients/requirement-client";
import { useAllRequirementsUnderUseCase } from "../../requirement/hooks/useAllUseCaseRequirements";

interface RequirementSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  isConditionMode?: boolean; // true when selecting requirement for creating a CONDITION
  onRequirementSelect: (requirement: RequirementListDto) => void;
  availableRequirements?: RequirementListDto[];
  checkingRequirements?: Set<string>; // Track which requirements are being verified
}

type RelationStatus = { hasActivity: boolean; hasCondition: boolean };

export default function RequirementSelection({
  isOpen,
  onClose,
  useCaseId,
  isConditionMode = false,
  onRequirementSelect,
  availableRequirements,
  checkingRequirements = new Set(),
}: RequirementSelectionProps) {
  const {
    data: allRequirements,
    isError,
    isLoading,
    error,
  } = useAllRequirementsUnderUseCase(useCaseId);

  // Use provided availableRequirements or fall back to all requirements
  const requirementsToShow = availableRequirements || allRequirements || [];

  // Filtering rules:
  // - Condition mode: only show requirements that HAVE a condition string (requirement.condition)
  // - Activity mode: show all requirements
  const filteredRequirements = useMemo(
    () =>
      isConditionMode
        ? requirementsToShow.filter((req) => req.condition && req.condition.trim().length > 0)
        : requirementsToShow,
    [isConditionMode, requirementsToShow],
  );

  // relationship statuses fetched from the server: { [requirementId]: RelationStatus }
  const [statuses, setStatuses] = useState<Record<string, RelationStatus>>({});
  const [isStatusesLoading, setIsStatusesLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // If there are no requirements to check, clear statuses and exit early
    if (!filteredRequirements || filteredRequirements.length === 0) {
      setStatuses({});
      return;
    }

    let mounted = true;
    setIsStatusesLoading(true);

    // Fetch relationship status for each requirement (uses existing single endpoint)
    Promise.all(
      filteredRequirements.map((req) =>
        requirementClient
          .getRequirementRelationships({ requirementId: req.id })
          .then((res) => ({ id: req.id, status: res }))
          .catch((err) => {
            // If a single check fails, we still continue — default to false/false for that item.
            console.error(`Failed to fetch relationships for requirement ${req.id}`, err);
            return { id: req.id, status: { hasActivity: false, hasCondition: false } };
          }),
      ),
    )
      .then((results) => {
        if (!mounted) return;
        const map: Record<string, RelationStatus> = {};
        for (const r of results) map[r.id] = r.status;
        setStatuses(map);
      })
      .finally(() => {
        if (!mounted) return;
        setIsStatusesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, filteredRequirements]);

  const title = isConditionMode
    ? "Select Requirement for Condition"
    : "Select Requirement for Activity";

  const emptyMessage = isConditionMode
    ? "No requirements with condition templates found for this use case."
    : "No available requirements found for this use case.";

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg">
      {/* Loading requirements list */}
      {isLoading && <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />}

      {/* Loading relationship checks */}
      {!isLoading && isStatusesLoading && (
        <div className="p-2 text-sm text-muted-foreground">
          Checking requirement relationships...
        </div>
      )}

      {isError && (
        <ErrorMessage
          message={`Error loading requirements: ${(error as any)?.message ?? "Unknown error"}`}
        />
      )}

      {filteredRequirements && filteredRequirements.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto p-1">
          {filteredRequirements.map((requirement) => {
            const status = statuses[requirement.id] ?? { hasActivity: false, hasCondition: false };
            const isChecking = checkingRequirements.has(requirement.id);

            // Determine "used" status depending on mode
            const isUsedByActivity = Boolean(status.hasActivity);
            const isUsedByCondition = Boolean(status.hasCondition);

            // In condition mode, a requirement is "used" if it already has a condition relationship.
            // In activity mode, a requirement is "used" if it already has an activity relationship.
            const isDisabled = isConditionMode ? isUsedByCondition : isUsedByActivity;

            // For clarity display both statuses (activity/condition) if present
            const statusBadges: string[] = [];
            if (isUsedByActivity) statusBadges.push("activity");
            if (isUsedByCondition) statusBadges.push("condition");

            // Show loading state if this requirement is being checked
            if (isChecking) {
              return (
                <div
                  key={requirement.id}
                  className="w-full text-left p-3 border border-border rounded-lg bg-muted opacity-70 cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{requirement.operation}</div>
                    <div className="text-xs text-muted-foreground ml-2">Verifying...</div>
                  </div>
                  {requirement.condition && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Condition: {requirement.condition}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 mt-1">⏳ Checking availability...</div>
                </div>
              );
            }

            return (
              <button
                key={requirement.id}
                onClick={() => {
                  // defensive: do not call if disabled
                  if (isDisabled) return;
                  onRequirementSelect(requirement);
                }}
                disabled={isDisabled}
                className={`w-full text-left p-3 border border-border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary
                   ${isDisabled ? "opacity-60 cursor-not-allowed bg-muted" : "hover:bg-accent hover:text-accent-foreground"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{requirement.operation}</div>
                  {statusBadges.length > 0 && (
                    <div className="text-xs text-muted-foreground ml-2">
                      {statusBadges.join(", ")}
                    </div>
                  )}
                </div>

                {requirement.condition && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Condition: {requirement.condition}
                  </div>
                )}

                {isDisabled && (
                  <div className="text-xs text-yellow-600 mt-1">
                    ⚠️ Already has linked {isConditionMode ? "condition" : "activity"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
          <div className="mt-2 text-sm">
            {allRequirements?.length ?? 0} total requirements.
            <div>
              {Object.keys(statuses).length > 0 && (
                <span>
                  {Object.values(statuses).filter((s) => s.hasActivity).length} requirements already
                  linked to activities.{" "}
                </span>
              )}
              {Object.keys(statuses).length > 0 && (
                <span>
                  {Object.values(statuses).filter((s) => s.hasCondition).length} requirements
                  already linked to conditions.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
