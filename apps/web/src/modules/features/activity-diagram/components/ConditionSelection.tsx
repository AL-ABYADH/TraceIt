"use client";

import Dialog from "@/components/Dialog";
import { useUseCaseConditions } from "../hooks/useUseCaseConditions";
import { DecisionShape } from "./DecisionShape";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { ConditionDto } from "@repo/shared-schemas";

interface ConditionSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  onConditionSelect: (condition: ConditionDto) => void;
}

export default function ConditionSelection({
  isOpen,
  onClose,
  useCaseId,
  onConditionSelect,
}: ConditionSelectionProps) {
  const { data: conditions, isError, isLoading, error } = useUseCaseConditions(useCaseId);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Select Existing Condition">
      {isLoading && <Loading isOpen={true} />}

      {isError && (
        <ErrorMessage
          message={`Failed to load conditions: ${(error as any)?.message ?? "Unknown error"}`}
        />
      )}

      {conditions !== undefined && (
        <div className="grid grid-cols-1 gap-3 mt-4">
          {conditions.map((condition) => (
            <button
              key={condition.id}
              onClick={() => {
                onConditionSelect(condition);
                onClose();
              }}
              className="flex items-center justify-center p-4 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-gray-200"
            >
              <DecisionShape name={condition.name} />
            </button>
          ))}
        </div>
      )}

      {conditions !== undefined && conditions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-muted-foreground mb-2">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1">No conditions found for this use case.</p>
          <p className="text-xs text-muted-foreground">
            Create conditions first to add them to the diagram.
          </p>
        </div>
      )}
    </Dialog>
  );
}
