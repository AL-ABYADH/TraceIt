"use client";

import Dialog from "@/components/Dialog";
import { useUseCases } from "../../use-case/hooks/useUseCases";
import { UseCaseListDto } from "@repo/shared-schemas";
import { UseCaseShape } from "./UseCaseShape";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useParams } from "next/navigation";

interface UseCaseSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onUseCaseClick: (useCase: UseCaseListDto) => void;
}

export default function UseCaseSelection({
  isOpen,
  onClose,
  onUseCaseClick,
}: UseCaseSelectionProps) {
  const params = useParams<"/projects/[project-id]/use-case-diagram">();
  const projectId = params["project-id"];

  const { data, isError, isLoading, error } = useUseCases(projectId);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Use Case Object" className="max-w-lg">
      {isLoading && <Loading isOpen={isLoading} message="Loading use cases..." mode="dialog" />}
      {isError && <ErrorMessage message={`Error loading use cases: ${error!.message}`} />}
      {data !== undefined && (
        <div className="flex flex-col item-center gap-3 p-1 max-h-96 overflow-y-auto">
          {data.toReversed()!.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => {
                onUseCaseClick(useCase);
                onClose();
              }}
              className="flex items-center justify-center p-2  hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <UseCaseShape
                key={useCase.id}
                name={useCase.name}
                style={{ cursor: "pointer", transition: "all 0.2s ease" }}
              />
            </button>
          ))}
        </div>
      )}
    </Dialog>
  );
}
