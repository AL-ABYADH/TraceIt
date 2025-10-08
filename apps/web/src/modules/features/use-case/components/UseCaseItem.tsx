"use client";

import EllipsisMenu from "@/components/EllipsisMenu";
import { PrimaryUseCaseListDto, RequirementDto } from "@repo/shared-schemas";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState, useEffect } from "react";
import RequirementForm from "../../requirement/components/RequirementForm";
import RequirementItem from "../../requirement/components/RequirementItem";
import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
import { useExpansion } from "../../requirement/contexts/ExpansionContext";
import { useRouter } from "next/navigation";
import { route } from "nextjs-routes";

const findRequirementPath = (requirements: RequirementDto[], requirementId: string): string[] => {
  const path: string[] = [];

  const find = (reqs: RequirementDto[], currentPath: string[]): boolean => {
    for (const req of reqs) {
      const newPath = [...currentPath, req.id];
      if (req.id === requirementId) {
        path.push(...newPath);
        return true;
      }
      if (req.nestedRequirements && find(req.nestedRequirements, newPath)) {
        return true;
      }
      if (req.exceptions) {
        for (const ex of req.exceptions) {
          if (ex.requirements && find(ex.requirements, newPath)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  find(requirements, []);
  return path;
};

interface UseCaseItemProps {
  useCase: PrimaryUseCaseListDto;
  projectId: string;
  number: number;
  highlightedUseCaseId: string | null;
  highlightedRequirementId: string | null;
}

export default function UseCaseItem({
  useCase,
  projectId,
  number,
  highlightedUseCaseId,
  highlightedRequirementId,
}: UseCaseItemProps) {
  const [isRequirementFormOpen, setIsRequirementFormOpen] = useState(false);
  const { expandedItems, toggleItem, expandItems } = useExpansion();
  const isExpanded = expandedItems.has(useCase.id);
  const router = useRouter();

  const {
    data: requirements = [],
    isLoading,
    isError,
  } = useUseCasesRequirements(useCase.id, {
    enabled: isExpanded, // Only fetch requirements if the use case is expanded
  });

  useEffect(() => {
    if (
      isExpanded &&
      requirements.length > 0 &&
      useCase.id === highlightedUseCaseId &&
      highlightedRequirementId
    ) {
      const path = findRequirementPath(requirements, highlightedRequirementId);
      if (path.length > 0) {
        expandItems(path);
      }
    }
  }, [
    isExpanded,
    requirements,
    useCase.id,
    highlightedUseCaseId,
    highlightedRequirementId,
    expandItems,
  ]);

  const handleAddRequirement = () => setIsRequirementFormOpen(true);
  const handleCloseRequirementForm = () => setIsRequirementFormOpen(false);

  const handleViewDescription = () => {
    router.push(
      route({
        pathname: "/projects/[project-id]/use-cases/[use-case-id]/details",
        query: {
          "project-id": projectId,
          "use-case-id": useCase.id,
        },
      }),
    );
  };

  const sortedRequirements = [...requirements].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="border border-border rounded-lg bg-surface/50">
      {/* Use Case Header */}
      <div className="flex items-center justify-between p-4 hover:bg-card/30 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => toggleItem(useCase.id)}
            className="p-1 hover:bg-card rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground bg-surface px-2 py-1 rounded">
              {number}.
            </span>
            <h3 className="font-medium text-foreground truncate">{useCase.name}</h3>
          </div>
        </div>

        {/* Ellipsis Menu for actions */}
        <EllipsisMenu
          actions={[
            {
              label: "View Use Case Description",
              onClick: handleViewDescription,
            },
            {
              label: "Add Requirement",
              onClick: handleAddRequirement,
            },
          ]}
          className="text-xs"
        />
      </div>

      {/* Requirements List */}
      {isExpanded && (
        <div className="border-t border-border">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading requirements...</div>
          ) : isError ? (
            <div className="p-4 text-center text-destructive">Error loading requirements</div>
          ) : sortedRequirements.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No requirements yet. Use the menu to add one.
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {sortedRequirements.map((requirement, index) => (
                <RequirementItem
                  key={requirement.id}
                  requirement={requirement}
                  number={index + 1}
                  projectId={projectId}
                  level={1}
                  validatedUseCaseId={useCase.id}
                  highlightedRequirementId={highlightedRequirementId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <RequirementForm
        isOpen={isRequirementFormOpen}
        onClose={handleCloseRequirementForm}
        useCaseId={useCase.id}
        validatedUseCaseId={useCase.id}
        projectId={projectId}
      />
    </div>
  );
}
