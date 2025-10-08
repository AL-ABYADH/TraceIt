"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronRightIcon, Plus } from "lucide-react";
import EllipsisMenu from "@/components/EllipsisMenu";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { renderRequirementText } from "@/utils/requirement_utils";
import RequirementForm from "./RequirementForm";
import RequirementExceptionForm from "./RequirementExceptionForm";
import { RequirementDto } from "@repo/shared-schemas";
import { useDeleteRequirement } from "../hooks/useDeleteRequirement";
import { useExpansion } from "../contexts/ExpansionContext";
import { cn } from "@/lib/utils";

interface RequirementItemProps {
  requirement: RequirementDto;
  number?: number;
  level?: number;
  projectId: string;
  validatedUseCaseId: string;
  highlightedRequirementId: string | null;
}

export default function RequirementItem({
  requirement,
  number,
  level = 0,
  projectId,
  validatedUseCaseId,
  highlightedRequirementId,
}: RequirementItemProps) {
  const [openForm, setOpenForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openExceptionForm, setOpenExceptionForm] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { expandedItems, toggleItem } = useExpansion();
  const expanded = expandedItems.has(requirement.id);
  const itemRef = useRef<HTMLDivElement>(null);

  const isHighlighted = requirement.id === highlightedRequirementId;

  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  const deleteRequirement = useDeleteRequirement(requirement.id, validatedUseCaseId, {
    onSuccess: () => setIsDeleteOpen(false),
  });

  let hasNested = false;
  let hasExceptions = false;

  if (requirement.nestedRequirements) {
    hasNested = requirement.nestedRequirements?.length > 0;
  }
  if (requirement.exceptions) {
    hasExceptions = requirement.exceptions?.length > 0;
  }
  const actions = [
    {
      label: "Edit",
      onClick: () => setOpenEdit(true),
    },
    {
      label: "Delete",
      onClick: () => setIsDeleteOpen(true),
      danger: true,
    },
    {
      label: "Add Exception",
      onClick: () => setOpenExceptionForm(true),
    },
    {
      label: "Add Sub Requirement",
      onClick: () => setOpenForm(true),
    },
  ];

  return (
    <div style={{ marginLeft: level * 28 }} ref={itemRef}>
      {/* Requirement Header */}
      <div
        className={cn(
          "flex items-start justify-between rounded-xl bg-muted/40 px-3 py-2 hover:bg-muted/60 transition-all duration-200",
          isHighlighted && "bg-blue-500/20 animate-pulse",
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-5 flex justify-center">
            {hasNested || hasExceptions ? (
              <button
                className="p-1 rounded hover:bg-accent transition-colors"
                onClick={() => toggleItem(requirement.id)}
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            ) : null}
          </div>

          {number !== undefined && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-accent/60 text-accent-foreground flex-shrink-0">
              {number}
            </span>
          )}

          <p className="truncate text-sm text-foreground leading-relaxed whitespace-pre-line">
            {renderRequirementText(requirement)}
          </p>
        </div>

        <EllipsisMenu actions={actions} />
      </div>

      {/* Nested content */}
      {expanded && (
        <div className="mt-2 space-y-3">
          {/* Sub Flow */}
          {hasNested && (
            <div className="relative ml-8 border-l border-indigo-300/50 pl-3">
              <div className="flex items-center gap-1 mb-1">
                <div style={{ marginLeft: 56 }} />
                <span className="m-6 text-[11px] tracking-wide font-medium text-indigo-500/90">
                  Sub Flow
                </span>
              </div>
              <div className="space-y-2">
                {requirement.nestedRequirements?.map((nested, idx) => (
                  <RequirementItem
                    key={nested.id}
                    requirement={nested}
                    number={idx + 1}
                    level={level + 1}
                    projectId={projectId}
                    validatedUseCaseId={validatedUseCaseId}
                    highlightedRequirementId={highlightedRequirementId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Exceptional Flow */}
          {hasExceptions && (
            <div className="relative ml-8 border-l border-border pl-3">
              <div className="flex items-center gap-1 mb-1">
                <div style={{ marginLeft: 56 }} />
                <span className="pl-2xl text-[11px] tracking-wide font-medium text-foreground/70">
                  Exceptional Flow
                </span>
              </div>
              <div className="space-y-2">
                {requirement.exceptions?.map((exception, eIdx) => (
                  <div key={exception.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <div style={{ marginLeft: 84 }} />
                      <span className="inline-flex items-center py-3 px-2 rounded-md bg-muted text-muted-foreground text-xs font-mono">
                        E{eIdx + 1}
                      </span>
                      <span className="text-xs text-foreground/80">{exception.name}</span>
                    </div>

                    {exception.requirements?.length ? (
                      exception.requirements.map((exReq, exIdx) => (
                        <RequirementItem
                          key={exReq.id}
                          requirement={exReq as any}
                          number={exIdx + 1}
                          level={level + 2}
                          projectId={projectId}
                          validatedUseCaseId={validatedUseCaseId}
                          highlightedRequirementId={highlightedRequirementId}
                        />
                      ))
                    ) : (
                      <div className="ml-6 text-xs text-muted-foreground italic">
                        No requirements in this exception yet.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Forms and dialogs stay the same */}
      {openForm && (
        <RequirementForm
          isOpen={openForm}
          onClose={() => setOpenForm(false)}
          projectId={projectId}
          validatedUseCaseId={validatedUseCaseId}
          parentRequirementId={requirement.id}
        />
      )}

      {openEdit && (
        <RequirementForm
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          projectId={projectId}
          validatedUseCaseId={validatedUseCaseId}
          mode="edit"
          requirementId={requirement.id}
          initialData={{
            operation: requirement.operation,
            condition: requirement.condition,
            actorIds: (requirement.actors ?? []).map((a: any) => a.id),
          }}
        />
      )}

      {openExceptionForm && (
        <RequirementExceptionForm
          isOpen={openExceptionForm}
          onClose={() => setOpenExceptionForm(false)}
          useCaseId={validatedUseCaseId}
          parentRequirementId={requirement.id}
        />
      )}

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        title="Delete Requirement"
        message="Are you sure you want to delete this requirement? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => deleteRequirement.mutate()}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteRequirement.isPending}
      />
    </div>
  );
}
