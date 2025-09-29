"use client";

import { RequirementListDto } from "@repo/shared-schemas";
import { formatRequirementText } from "@/utils/formatting-requirement-text";

interface RequirementItemProps {
  requirement: RequirementListDto;
  level?: number;
  number?: number;
}

export default function RequirementItem({ requirement, level = 0, number }: RequirementItemProps) {
  const indentClass = level > 0 ? `ml-${level * 6}` : "";

  return (
    <div className={`py-2 ${indentClass} bg-surface`}>
      <div className="flex items-start justify-between group hover:bg-card/30 rounded-lg p-3 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {number && (
              <span className="text-xs font-medium text-muted-foreground bg-surface px-2 py-1 rounded">
                {number}.
              </span>
            )}
            <p className="text-sm text-foreground leading-relaxed">
              {formatRequirementText(requirement)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
