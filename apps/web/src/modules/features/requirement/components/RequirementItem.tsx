"use client";

import { RequirementListDto } from "@repo/shared-schemas";
import { PlusIcon } from "lucide-react";
import Button from "@/components/Button";

interface RequirementItemProps {
  requirement: RequirementListDto;
  level?: number;
  onAddSubRequirement?: (requirementId: string) => void;
}

export default function RequirementItem({
  requirement,
  level = 0,
  onAddSubRequirement,
}: RequirementItemProps) {
  const indentClass = level > 0 ? `ml-${level * 6}` : "";

  return (
    <div className={`py-2 ${indentClass}`}>
      <div className="flex items-start justify-between group hover:bg-card/30 rounded-lg p-3 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground bg-surface px-2 py-1 rounded">
              REQ-{requirement.id.slice(-3).toUpperCase()}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-medium">Operation:</span> {requirement.operation}
            </p>

            {requirement.condition && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium">Condition:</span> {requirement.condition}
              </p>
            )}
          </div>
        </div>

        {onAddSubRequirement && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddSubRequirement(requirement.id)}
              className="text-xs"
            >
              <PlusIcon className="w-3 h-3 mr-1" />
              Add Sub-Requirement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
