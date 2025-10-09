"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { renderRequirementText } from "@/utils/requirement_utils";
import RequirementForm from "./RequirementForm";
import RequirementExceptionForm from "./RequirementExceptionForm";
import { RequirementDto } from "@repo/shared-schemas";
import { useDeleteRequirement } from "../hooks/useDeleteRequirement";
import { useExpansion } from "../contexts/ExpansionContext";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // adjust import path

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

  // Highlight & scroll ref
  const headerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setHighlightedRequirementId] = useState<boolean>(false);

  useEffect(() => {
    setHighlightedRequirementId(requirement.id === highlightedRequirementId);
  }, [highlightedRequirementId, requirement.id]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isHighlighted && headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      headerRef.current.style.outline = "2px solid #4f9cf9";
      headerRef.current.style.backgroundColor = "rgba(59,130,246,0.15)";

      timer = setTimeout(() => {
        headerRef.current?.style.removeProperty("outline");
        headerRef.current?.style.removeProperty("background-color");

        setHighlightedRequirementId(false);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isHighlighted, setHighlightedRequirementId]);

  const deleteRequirement = useDeleteRequirement(requirement.id, validatedUseCaseId, {
    onSuccess: () => setIsDeleteOpen(false),
  });

  const hasNested = requirement.nestedRequirements
    ? requirement.nestedRequirements.length > 0
    : false;
  const hasExceptions = requirement.exceptions?.length ? requirement.exceptions.length > 0 : false;

  const actions = [
    { label: "Edit", onClick: () => setOpenEdit(true) },
    { label: "Delete", onClick: () => setIsDeleteOpen(true), danger: true },
    { label: "Add Exception", onClick: () => setOpenExceptionForm(true) },
    { label: "Add Sub Requirement", onClick: () => setOpenForm(true) },
  ];

  // Right-click context menu state
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent parent menu
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuPosition(null);

  return (
    <div
      style={{ marginLeft: level * 28, borderRadius: "2rem" }}
      ref={itemRef} // outer wrapper, just for margin
    >
      {/* Requirement Header */}
      <div
        className={cn(
          "flex items-start justify-between rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer",
          "bg-muted/40 hover:bg-muted/60",
          isHighlighted && "bg-blue-500/20 ring-2 ring-blue-400 rounded-xl",
        )}
        ref={headerRef} // header-specific ref
        onMouseEnter={(e) => {
          if (!isHighlighted) e.currentTarget.style.backgroundColor = "rgba(107,114,128,0.1)";
        }}
        onMouseLeave={(e) => {
          if (!isHighlighted) e.currentTarget.style.backgroundColor = "";
        }}
        onClick={() => {
          if (headerRef.current) headerRef.current.style.outline = "none";
          setHighlightedRequirementId(false);
        }}
        onContextMenu={handleContextMenu}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-5 flex justify-center" style={{ borderRadius: "2rem" }}>
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
            <span className="flex items-center justify-center w-2 h-6 text-xs font-semibold rounded-full bg-accent/60 text-accent-foreground flex-shrink-0">
              {number}
            </span>
          )}

          <p
            className="truncate p-2 text-sm text-foreground leading-relaxed flex-1 min-w-0 text-ellipsis"
            title={renderRequirementText(requirement)}
          >
            {renderRequirementText(requirement)}
          </p>
        </div>
      </div>

      {/* Nested content */}
      {expanded && (
        <div className="mt-2 space-y-3">
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
                      <span className="inline-flex items-center py-3 px-2 rounded-lg bg-muted text-muted-foreground text-sm font-mono">
                        E{eIdx + 1}
                      </span>
                      <span className="text-sm text-foreground/80">{exception.name}</span>
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
                      <div
                        className="ml-6 text-xs text-muted-foreground italic"
                        style={{ marginLeft: 132 }}
                      >
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

      {/* Forms */}
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

      {/* Right-click dropdown */}
      {menuPosition && (
        <DropdownMenu open onOpenChange={(open) => !open && closeMenu()}>
          <DropdownMenuContent
            sideOffset={0}
            className="min-w-48 bg-card text-popover-foreground border border-border shadow-lg rounded-xl p-1"
            style={{ position: "fixed", top: menuPosition.y, left: menuPosition.x }}
          >
            {actions.map((action, idx) => (
              <DropdownMenuItem
                key={idx}
                onSelect={() => {
                  action.onClick();
                  closeMenu();
                }}
                danger={action.danger}
              >
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
