"use client";

import EllipsisMenu from "@/components/EllipsisMenu";
import { PrimaryUseCaseListDto, RequirementDto } from "@repo/shared-schemas";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState, useEffect, use } from "react";
import RequirementForm from "../../requirement/components/RequirementForm";
import RequirementItem from "../../requirement/components/RequirementItem";
import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
import { useExpansion } from "../../requirement/contexts/ExpansionContext";
import { useRouter } from "next/navigation";
import { route } from "nextjs-routes";
import _ from "lodash";

const findPath = (items: any[], id: string, type: "requirement" | "exception"): string[] => {
  const path: string[] = [];

  const find = (reqs: any[], currentPath: string[]): boolean => {
    for (const req of reqs) {
      const newPath = [...currentPath, req.id];
      if (type === "requirement" && req.id === id) {
        path.push(...newPath);
        return true;
      }
      if (type === "exception" && req.exceptions) {
        for (const ex of req.exceptions) {
          if (ex.id === id) {
            path.push(...newPath, ex.id);
            return true;
          }
          if (ex.requirements && find(ex.requirements, [...newPath, ex.id])) {
            return true;
          }
        }
      }
      if (req.nestedRequirements && find(req.nestedRequirements, newPath)) {
        return true;
      }
    }
    return false;
  };

  find(items, []);
  return path;
};

interface UseCaseItemProps {
  useCase: PrimaryUseCaseListDto;
  projectId: string;
  number: number;
  highlightedUseCaseId: string | null;
  highlightedRequirementId: string | null;
  highlightedExceptionId: string | null;
}

export default function UseCaseItem({
  useCase,
  projectId,
  number,
  highlightedUseCaseId,
  highlightedRequirementId,
  highlightedExceptionId,
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
    if (isExpanded && requirements.length > 0 && useCase.id === highlightedUseCaseId) {
      if (highlightedRequirementId) {
        const path = findPath(requirements, highlightedRequirementId, "requirement");
        if (path.length > 0) {
          expandItems(path);
        }
      }
      if (highlightedExceptionId) {
        const path = findPath(requirements, highlightedExceptionId, "exception");
        if (path.length > 0) {
          expandItems(path);
        }
      }
    }
  }, [
    isExpanded,
    requirements,
    useCase.id,
    highlightedUseCaseId,
    highlightedRequirementId,
    highlightedExceptionId,
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

  const handleViewActivityDiagram = () => {
    router.push(
      route({
        pathname: "/projects/[project-id]/activity-diagrams",
        query: {
          "project-id": projectId,
          useCaseId: useCase.id,
        },
      }),
    );
  };

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

  const sortedRequirements = sortRequirementsByCreatedAt(requirements);

  return (
    <div className="p-2 border border-border rounded-lg bg-surface/50 overflow-auto">
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

          <div className="flex items-center gap-2 ">
            <span className="text-xs font-medium text-muted-foreground bg-surface px-2 rounded">
              {number}.
            </span>
            <h3 className="font-medium text-foreground truncate">{useCase.name}</h3>
          </div>
        </div>

        {/* Ellipsis Menu for actions */}
        <EllipsisMenu
          actions={[
            {
              label: "Add Requirement",
              onClick: handleAddRequirement,
            },
            {
              label: "View Use Case Description",
              onClick: handleViewDescription,
            },
            {
              label: "View Activity Diagram",
              onClick: handleViewActivityDiagram,
            },
            {
              label: "Navigate to Use Case",
              onClick: () => {
                router.push(
                  route({
                    pathname: "/projects/[project-id]/use-cases",
                    query: {
                      "project-id": projectId,
                      useCaseId: useCase.id,
                    },
                  }),
                );
              },
            },
          ]}
          className="text-xs"
        />
      </div>

      {/* Requirements List */}
      {isExpanded && (
        <div className="mb-2">
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
                  highlightedExceptionId={highlightedExceptionId}
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
