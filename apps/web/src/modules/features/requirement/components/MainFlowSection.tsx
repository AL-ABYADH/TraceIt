"use client";

import EllipsisMenu from "@/components/EllipsisMenu";
import { renderRequirementText } from "@/utils/requirement_utils";
import { RequirementDto } from "@repo/shared-schemas";
import { useState } from "react";
import { Plus } from "lucide-react";
import RequirementExceptionForm from "./RequirementExceptionForm";
import RequirementSection from "./RequirementSection";
import RequirementForm from "./RequirementForm";
import ConfirmationDialog from "@/components/ConfirmationDialog";

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
  const [openEditRequirement, setOpenEditRequirement] = useState<null | {
    id: string;
    initial: { operation: string; condition?: string; actorIds: string[] };
  }>(null);
  const [openFormParentId, setOpenFormParentId] = useState<string | null>(null);
  const [openMainForm, setOpenMainForm] = useState(false);
  const [openExceptionParentId, setOpenExceptionParentId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!requirements) return null;

  return (
    <>
      <RequirementSection
        title={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2">
              <span className="text-base text-xl">Main Flow</span>
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-muted text-muted-foreground">
                {requirements.length}
              </span>
            </span>
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
          <div
            key={req.id}
            className="flex items-start justify-between rounded-lg border border-border bg-card/40 px-3 py-2 hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-muted text-muted-foreground">
                {idx + 1}
              </span>
              <p>{renderRequirementText(req)}</p>
            </div>

            <EllipsisMenu
              actions={[
                {
                  label: "Edit",
                  onClick: () =>
                    setOpenEditRequirement({
                      id: req.id,
                      initial: {
                        operation: req.operation,
                        condition: req.condition,
                        actorIds: (req.actors ?? []).map((a: any) => a.id),
                      },
                    }),
                },
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

      {openEditRequirement && (
        <RequirementForm
          isOpen={!!openEditRequirement}
          onClose={() => setOpenEditRequirement(null)}
          projectId={projectId}
          validatedUseCaseId={validatedUseCaseId}
          mode="edit"
          requirementId={openEditRequirement.id}
          initialData={openEditRequirement.initial}
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

      {/* <ConfirmationDialog
        isOpen={isDeleteOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteProject.isPending}
      /> */}
    </>
  );
}
