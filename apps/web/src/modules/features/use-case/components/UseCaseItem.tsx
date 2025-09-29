"use client";

import { useState } from "react";
import { PrimaryUseCaseListDto } from "@repo/shared-schemas";
import { ChevronRightIcon, ChevronDownIcon } from "lucide-react";
import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
import RequirementItem from "../../requirement/components/RequirementItem";
import RequirementForm from "../../requirement/components/RequirementForm";
import EllipsisMenu from "@/components/EllipsisMenu";

interface UseCaseItemProps {
  useCase: PrimaryUseCaseListDto;
  projectId: string;
  number: number; // ✅ New
}

export default function UseCaseItem({ useCase, projectId, number }: UseCaseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRequirementFormOpen, setIsRequirementFormOpen] = useState(false);

  const { data: requirements = [], isLoading, isError } = useUseCasesRequirements(useCase.id);

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const handleAddRequirement = () => setIsRequirementFormOpen(true);
  const handleCloseRequirementForm = () => setIsRequirementFormOpen(false);

  const sortedRequirements = [...requirements].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="border border-border rounded-lg bg-surface/50">
      {/* Use Case Header */}
      <div className="flex items-center justify-between p-4 hover:bg-card/30 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={toggleExpanded} className="p-1 hover:bg-card rounded transition-colors">
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
                  level={0}
                  number={index + 1}
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
        projectId={projectId}
      />
    </div>
  );
}
