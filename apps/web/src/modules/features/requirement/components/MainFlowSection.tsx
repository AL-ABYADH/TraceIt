"use client";

import EllipsisMenu from "@/components/EllipsisMenu";
import { renderRequirementText } from "@/utils/requirement_utils";
import { RequirementDto } from "@repo/shared-schemas";
import { useState } from "react";
import RequirementForm from "./RequirementForm";
import RequirementSection from "./RequirementSection";

interface MainFlowSectionProps {
  requirements: RequirementDto[];
  projectId: string;
}

export default function MainFlowSection({ requirements, projectId }: MainFlowSectionProps) {
  const [openFormParentId, setOpenFormParentId] = useState<string | null>(null);

  if (!requirements || requirements.length === 0) return null;

  return (
    <>
      <RequirementSection title="Main Flow">
        {requirements.map((req, idx) => (
          <div key={req.id} className="flex items-start justify-between">
            <p>
              {idx + 1}. {renderRequirementText(req)}
            </p>

            <EllipsisMenu
              actions={[
                { label: "Edit", onClick: () => console.log("Edit", req.id) },
                { label: "Delete", onClick: () => console.log("Delete", req.id) },
                { label: "Add Exception", onClick: () => console.log("Add Exception", req.id) },
                {
                  label: "Add Sub Requirement",
                  onClick: () => setOpenFormParentId(req.id),
                },
                {
                  label: "Add Secondary Use Case",
                  onClick: () => console.log("Add Secondary", req.id),
                  disabled: !req.nestedRequirements?.length,
                },
              ]}
            />
          </div>
        ))}
      </RequirementSection>

      {openFormParentId && (
        <RequirementForm
          isOpen={!!openFormParentId}
          onClose={() => setOpenFormParentId(null)}
          projectId={projectId}
          parentRequirementId={openFormParentId} // Only parentRequirementId for main flow
        />
      )}
    </>
  );
}
