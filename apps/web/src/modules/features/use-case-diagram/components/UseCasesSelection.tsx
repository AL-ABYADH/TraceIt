"use client";

import Dialog from "@/components/Dialog";
import { useUseCases } from "../../use-case/hooks/useUseCases";
import { UseCaseListDto } from "@repo/shared-schemas";
import { UseCaseShape } from "./UseCaseShape";

interface UseCaseSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onUseCaseClick: (useCase: UseCaseListDto) => void;
}

export default function UseCaseSelection({
  isOpen,
  onClose,
  projectId,
  onUseCaseClick,
}: UseCaseSelectionProps) {
  const { data, isError, isLoading, error } = useUseCases(projectId);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Use Case Object" className="max-w-lg">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading use cases...</div>
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
            Error loading use cases: {error!.message}
          </div>
        </div>
      )}
      {data !== undefined &&
        data.toReversed()!.map((useCase) => (
          <button
            key={useCase.id}
            onClick={() => {
              onUseCaseClick(useCase);
              onClose();
            }}
          >
            {" "}
            <UseCaseShape key={useCase.id} name={useCase.name} />
          </button>
        ))}
    </Dialog>
  );
}
