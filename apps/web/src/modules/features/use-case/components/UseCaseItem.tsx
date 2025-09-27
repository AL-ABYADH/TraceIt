"use client";

import { useState, useEffect } from "react";
import { PrimaryUseCaseListDto } from "@repo/shared-schemas";
import { ChevronRightIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
import RequirementItem from "../../requirement/components/RequirementItem";
import RequirementForm from "../../requirement/components/RequirementForm";
import Button from "@/components/Button";

interface UseCaseItemProps {
  useCase: PrimaryUseCaseListDto;
  projectId: string;
  onAddSubRequirement?: (requirementId: string) => void;
}

export default function UseCaseItem({ useCase, projectId, onAddSubRequirement }: UseCaseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRequirementFormOpen, setIsRequirementFormOpen] = useState(false);

  const { data: requirements = [], isLoading, isError } = useUseCasesRequirements(useCase.id);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleAddRequirement = () => {
    setIsRequirementFormOpen(true);
  };

  const handleCloseRequirementForm = () => {
    setIsRequirementFormOpen(false);
  };

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

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{useCase.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              UC-{useCase.id.slice(-3).toUpperCase()}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleAddRequirement} className="text-xs">
          <PlusIcon className="w-3 h-3 mr-1" />
          Add Requirement
        </Button>
      </div>

      {/* Requirements List */}
      {isExpanded && (
        <div className="border-t border-border">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading requirements...</div>
          ) : isError ? (
            <div className="p-4 text-center text-destructive">Error loading requirements</div>
          ) : requirements.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No requirements yet. Click "Add Requirement" to create one.
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {requirements.map((requirement) => (
                <RequirementItem
                  key={requirement.id}
                  requirement={requirement}
                  level={0}
                  onAddSubRequirement={onAddSubRequirement}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requirement Form for this Use Case */}
      <RequirementForm
        isOpen={isRequirementFormOpen}
        onClose={handleCloseRequirementForm}
        useCaseId={useCase.id}
        projectId={projectId}
      />
    </div>
  );
}
