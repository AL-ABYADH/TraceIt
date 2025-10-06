"use client";

import { renderRequirementText } from "@/utils/requirement_utils";
import { RequirementDto, ActorType, ActorSubtype, ActorDto } from "@repo/shared-schemas";

interface RequirementPreviewProps {
  operation?: string;
  condition?: string;
  actors?: ActorDto[];
}

export default function RequirementPreview({
  operation,
  condition,
  actors,
}: RequirementPreviewProps) {
  if (!operation?.trim()) {
    return (
      <div className="p-4 rounded-lg bg-card border border-border my-4">
        <h4 className="font-medium text-foreground mb-2">Preview</h4>
        <p className="text-sm text-foreground leading-relaxed">
          Start typing to see a live preview...
        </p>
      </div>
    );
  }

  const fakeRequirement: Partial<RequirementDto> = {
    operation,
    condition: condition?.trim() || undefined,
    actors: actors || undefined,
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-border mt-4">
      <h4 className="font-medium text-foreground mb-2">Preview</h4>
      <p className="text-sm text-foreground leading-relaxed mb-2">
        {renderRequirementText(fakeRequirement as RequirementDto)}
      </p>
    </div>
  );
}
