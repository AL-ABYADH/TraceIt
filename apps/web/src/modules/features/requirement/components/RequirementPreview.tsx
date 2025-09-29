"use client";

import { formatRequirementText } from "@/utils/formatting-requirement-text";
import { RequirementListDto } from "@repo/shared-schemas";

interface RequirementPreviewProps {
  operation?: string;
  condition?: string;
  actorIds?: string[];
  actorsMap?: Record<string, string>;
}

export default function RequirementPreview({ operation, condition }: RequirementPreviewProps) {
  if (!operation?.trim()) {
    return (
      <div className="p-4 rounded-lg bg-card border border-border mt-4">
        <h4 className="font-medium text-foreground mb-2">Preview</h4>
        <p className="text-sm text-foreground leading-relaxed">
          Start typing to see a live preview...
        </p>
      </div>
    );
  }

  const fakeRequirement: Partial<RequirementListDto> = {
    operation,
    condition: condition?.trim() || undefined,
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-border mt-4">
      <h4 className="font-medium text-foreground mb-2">Preview</h4>
      <p className="text-sm text-foreground leading-relaxed mb-2">
        {formatRequirementText(fakeRequirement as RequirementListDto)}
      </p>
    </div>
  );
}
