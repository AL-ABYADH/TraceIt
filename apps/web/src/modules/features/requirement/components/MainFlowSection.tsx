"use client";

import EllipsisMenu from "@/components/EllipsisMenu";
import { renderRequirementText } from "@/utils/requirement_utils";
import { RequirementDto } from "@repo/shared-schemas";
import { useState } from "react";
import { Plus } from "lucide-react";
import RequirementForm from "./RequirementForm";
import RequirementExceptionForm from "./RequirementExceptionForm";
import RequirementSection from "./RequirementSection";

interface MainFlowSectionProps {
  requirements: RequirementDto[];
  projectId: string;
  validatedUseCaseId: string;
}

export default function MainFlowSection({
  requirements,
  projectId,
  validatedUseCaseId,
}: MainFlowSectionProps) {
  const [openFormParentId, setOpenFormParentId] = useState<string | null>(null);
  const [openMainForm, setOpenMainForm] = useState(false);
  const [openExceptionParentId, setOpenExceptionParentId] = useState<string | null>(null);

  if (!requirements || requirements.length === 0) return null;

  return (
    <>
      <RequirementSection
        title={
          <div className="flex items-center gap-2">
            <span>Main Flow</span>
            <button
              type="button"
              className="p-1 rounded hover:bg-accent transition-colors"
              onClick={() => setOpenMainForm(true)}
              aria-label="Add Main Requirement"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        }
      >
        {requirements.map((req, idx) => (
          <div key={req.id} className="flex items-start justify-between">
            <p>
              {idx + 1}. {renderRequirementText(req)}
            </p>

            <EllipsisMenu
              actions={[
                { label: "Edit", onClick: () => console.log("Edit", req.id) },
                { label: "Delete", onClick: () => console.log("Delete", req.id) },
                { label: "Add Exception", onClick: () => setOpenExceptionParentId(req.id) },
                {
                  label: "Add Sub Requirement",
                  onClick: () => setOpenFormParentId(req.id),
                },
              ]}
            />
          </div>
        ))}
      </RequirementSection>

      {/* Main Requirement Creation Form */}
      {openMainForm && (
        <RequirementForm
          isOpen={openMainForm}
          onClose={() => setOpenMainForm(false)}
          projectId={projectId}
          useCaseId={validatedUseCaseId}
          validatedUseCaseId={validatedUseCaseId}
        />
      )}

      {openFormParentId && (
        <RequirementForm
          isOpen={!!openFormParentId}
          onClose={() => setOpenFormParentId(null)}
          projectId={projectId}
          parentRequirementId={openFormParentId}
          validatedUseCaseId={validatedUseCaseId}
        />
      )}

      {openExceptionParentId && (
        <RequirementExceptionForm
          isOpen={!!openExceptionParentId}
          onClose={() => setOpenExceptionParentId(null)}
          useCaseId={validatedUseCaseId}
          parentRequirementId={openExceptionParentId}
        />
      )}
    </>
  );
}
