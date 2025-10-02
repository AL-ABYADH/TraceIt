"use client";

import Dialog from "@/components/Dialog";
import { useUseCases } from "../../use-case/hooks/useUseCases";
import { UseCaseListDto } from "@repo/shared-schemas";
import { UseCaseShape } from "./UseCaseShape";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

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
      {isLoading && <Loading isOpen={isLoading} message="Loading use cases..." mode="dialog" />}
      {isError && <ErrorMessage message={`Error loading use cases: ${error!.message}`} />}
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
