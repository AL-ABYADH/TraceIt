"use client";

import { renderRequirementText } from "@/utils/requirement_utils";
import { RequirementDto } from "@repo/shared-schemas";

interface RequirementItemProps {
  requirement: RequirementDto;
  number?: number;
}

export default function RequirementItem({ requirement, number }: RequirementItemProps) {
  return (
    <div className={`py-2 ml-6 bg-surface`}>
      <div className="flex items-start justify-between group hover:bg-card/30 rounded-lg p-3 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {number && (
              <span className="text-xs font-medium text-muted-foreground bg-surface px-2 py-1 rounded">
                {number}.
              </span>
            )}
            <p className="text-sm text-foreground leading-relaxed">
              {renderRequirementText(requirement)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
