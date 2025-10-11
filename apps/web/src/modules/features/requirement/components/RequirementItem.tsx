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
import { useDeleteRequirementException } from "../hooks/useDeleteRequirementException";
import EllipsisMenu from "@/components/EllipsisMenu";

interface RequirementItemProps {
  requirement: RequirementDto;
  number?: number;
  level?: number;
  parentNumber?: string;
  projectId: string;
  validatedUseCaseId: string;
  highlightedRequirementId: string | null;
  highlightedExceptionId: string | null;
}

function isDescendant(requirement: RequirementDto, highlightedId: string): boolean {
  if (requirement.id === highlightedId) return true;
  if (requirement.nestedRequirements?.some((r) => isDescendant(r, highlightedId))) return true;
  if (
    requirement.exceptions?.some((e) => e.requirements?.some((r) => isDescendant(r, highlightedId)))
  )
    return true;
  return false;
}

export default function RequirementItem({
  requirement,
  number,
  level = 0,
  parentNumber,
  projectId,
  validatedUseCaseId,
  highlightedRequirementId,
  highlightedExceptionId,
}: RequirementItemProps) {
  const [openForm, setOpenForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openExceptionForm, setOpenExceptionForm] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { expandedItems, toggleItem, expandItems } = useExpansion();
  const [isDeleteExceptionOpen, setIsDeleteExceptionOpen] = useState(false);
  const [deleteExceptionId, setDeleteExceptionId] = useState<string | null>(null);
  const [openRequirementExceptionForm, setOpenRequirementExceptionForm] = useState<{
    exceptionId: string;
  } | null>(null);
  const [openEditException, setOpenEditException] = useState<null | {
    id: string;
    initial: { name: string };
  }>(null);
  const exceptionRef = useRef<HTMLDivElement>(null);

  const expanded = expandedItems.has(requirement.id);

  // Highlight & scroll ref
  const headerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setHighlightedRequirementId] = useState<boolean>(false);

  const requirementNumber = parentNumber ? `${parentNumber}.${number}` : number;

  const highlightedRequirementIdRef = useRef(highlightedRequirementId);

  useEffect(() => {
    if (
      highlightedExceptionId &&
      requirement.exceptions?.some((e) => e.id === highlightedExceptionId)
    ) {
      expandItems([requirement.id]);
    }
  }, [highlightedExceptionId, requirement, expandItems]);

  useEffect(() => {
    if (
      highlightedExceptionId &&
      requirement.exceptions?.some((e) => e.id === highlightedExceptionId)
    ) {
      expandItems([requirement.id]);
    }
  }, [highlightedExceptionId, requirement, expandItems]);

  useEffect(() => {
    if (highlightedRequirementId && isDescendant(requirement, highlightedRequirementId)) {
      if (!expandedItems.has(requirement.id)) {
        expandItems([requirement.id]);
      }
    }
    if (
      highlightedExceptionId &&
      requirement.exceptions?.some((e) => e.id === highlightedExceptionId)
    ) {
      if (!expandedItems.has(requirement.id)) {
        expandItems([requirement.id]);
      }
    }
  }, [highlightedRequirementId, highlightedExceptionId, requirement, expandItems, expandedItems]);

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

  useEffect(() => {
    if (highlightedExceptionId && exceptionRef.current) {
      const exception = requirement.exceptions?.find((e) => e.id === highlightedExceptionId);
      if (exception) {
        exceptionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        exceptionRef.current.style.outline = "2px solid #4f9cf9";
        exceptionRef.current.style.backgroundColor = "rgba(59,130,246,0.15)";

        const timer = setTimeout(() => {
          exceptionRef.current?.style.removeProperty("outline");
          exceptionRef.current?.style.removeProperty("background-color");
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [highlightedExceptionId, requirement.exceptions]);

  const deleteRequirement = useDeleteRequirement(requirement.id, validatedUseCaseId, {
    onSuccess: () => setIsDeleteOpen(false),
  });

  const deleteException = useDeleteRequirementException(
    deleteExceptionId ?? "",
    validatedUseCaseId,
    {
      onSuccess: () => {
        setIsDeleteExceptionOpen(false);
        setDeleteExceptionId(null);
      },
      onError: () => {
        // Handle error as needed
      },
    },
  );

  const hasNested = requirement.nestedRequirements
    ? requirement.nestedRequirements.length > 0
    : false;
  const hasExceptions = requirement.exceptions?.length ? requirement.exceptions.length > 0 : false;

  const actions = [
    { label: "Add Sub Requirement", onClick: () => setOpenForm(true) },
    { label: "Add Exception", onClick: () => setOpenExceptionForm(true) },
    { label: "Edit", onClick: () => setOpenEdit(true) },
    { label: "Delete", onClick: () => setIsDeleteOpen(true), danger: true },
  ];

  // Right-click context menu state
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent parent menu
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuPosition(null);

  const baseIndent = 28; // base indentation step
  const nestedIndent = 1 * baseIndent;

  return (
    <div style={{ marginLeft: nestedIndent, borderRadius: "2rem" }} ref={itemRef}>
      {/* Requirement Header */}
      <div
        className={cn(
          "flex items-start justify-between rounded-xl px-3  transition-all duration-200 cursor-pointer",
          "bg-muted/40 hover:bg-muted/60",
          isHighlighted && "bg-blue-500/20 ring-2 ring-blue-400 rounded-xl",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
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

          {requirementNumber !== undefined && (
            <span className="flex items-center justify-center w-auto px-2 h-6 text-xs font-semibold rounded-full bg-accent/60 text-accent-foreground flex-shrink-0">
              {requirementNumber}
            </span>
          )}

          <p
            className="truncate text-sm text-foreground leading-relaxed flex-1 min-w-0"
            title={renderRequirementText(requirement)}
            style={{ overflowX: "auto", borderRadius: "2rem", padding: 10 }}
            ref={headerRef}
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
            {renderRequirementText(requirement)}
          </p>
        </div>
      </div>

      {/* Nested content */}
      {expanded && (
        <div className="mt-2 space-y-3">
          {/* Sub Flow */}
          {hasNested && (
            <div className="relative border-l border-indigo-300/50">
              {/* Requirements under Sub Flow */}
              <div className="space-y-2">
                {requirement.nestedRequirements?.map((nested, idx) => (
                  <RequirementItem
                    key={nested.id}
                    requirement={nested}
                    number={idx + 1}
                    parentNumber={requirementNumber?.toString()}
                    level={level + 1}
                    projectId={projectId}
                    validatedUseCaseId={validatedUseCaseId}
                    highlightedRequirementId={highlightedRequirementId}
                    highlightedExceptionId={highlightedExceptionId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Exceptional Flow */}
          {hasExceptions && (
            <div className="relative border-l border-border">
              {/* Exceptions */}
              <div className="space-y-2">
                {requirement.exceptions?.map((exception, eIdx) => {
                  const isExceptionHighlighted = exception.id === highlightedExceptionId;

                  return (
                    <div key={exception.id}>
                      <div className="flex items-center gap-2 my-1" style={{ marginLeft: 56 }}>
                        <span className="inline-flex items-center py-1 px-2 rounded-lg bg-muted text-muted-foreground text-sm font-mono">
                          E{eIdx + 1}
                        </span>

                        {/* Only highlight the name */}
                        <span
                          ref={isExceptionHighlighted ? exceptionRef : null}
                          className="text-sm text-foreground/80 transition-colors duration-300"
                          style={
                            isExceptionHighlighted
                              ? {
                                  backgroundColor: "rgba(59,130,246,0.15)",
                                  outline: "2px solid #4f9cf9",
                                  borderRadius: "2rem",
                                  padding: "0.1rem 0.5rem",
                                }
                              : {}
                          }
                        >
                          {exception.name}
                        </span>

                        <EllipsisMenu
                          actions={(() => {
                            const actions: {
                              label: string;
                              onClick: () => void;
                              danger?: boolean;
                            }[] = [];

                            actions.push({
                              label: "Add Requirement",
                              onClick: () =>
                                setOpenRequirementExceptionForm({ exceptionId: exception.id }),
                            });
                            actions.push({
                              label: "Edit",
                              onClick: () =>
                                setOpenEditException({
                                  id: exception.id,
                                  initial: { name: exception.name },
                                }),
                            });

                            actions.push({
                              label: "Delete",
                              onClick: () => {
                                setDeleteExceptionId(exception.id);
                                setIsDeleteExceptionOpen(true);
                              },
                              danger: true,
                            });

                            return actions;
                          })()}
                        />
                      </div>

                      {/* Exception Requirements */}
                      <div style={{ marginLeft: 64 }}>
                        {exception.requirements?.length ? (
                          exception.requirements
                            .toReversed()
                            .map((exReq, exIdx) => (
                              <RequirementItem
                                key={exReq.id}
                                requirement={exReq as any}
                                number={exIdx + 1}
                                level={level + 2}
                                projectId={projectId}
                                validatedUseCaseId={validatedUseCaseId}
                                highlightedRequirementId={highlightedRequirementId}
                                highlightedExceptionId={highlightedExceptionId}
                              />
                            ))
                        ) : (
                          <div
                            className="text-xs text-muted-foreground italic"
                            style={{ marginLeft: 23 }}
                          >
                            No requirements in this exception yet.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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

      {openEditException && (
        <RequirementExceptionForm
          isOpen={!!openEditException}
          onClose={() => setOpenEditException(null)}
          useCaseId={validatedUseCaseId}
          mode="edit"
          exceptionId={openEditException.id}
          initialData={openEditException.initial}
        />
      )}

      {openRequirementExceptionForm && (
        <RequirementForm
          isOpen={!!openRequirementExceptionForm}
          onClose={() => setOpenRequirementExceptionForm(null)}
          projectId={projectId}
          validatedUseCaseId={validatedUseCaseId}
          exceptionId={openRequirementExceptionForm.exceptionId}
        />
      )}

      <ConfirmationDialog
        isOpen={isDeleteExceptionOpen}
        title="Delete Exception"
        message="Are you sure you want to delete this exception? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteExceptionId) deleteException.mutate();
        }}
        onCancel={() => {
          setIsDeleteExceptionOpen(false);
          setDeleteExceptionId(null);
        }}
        loading={deleteException.isPending}
      />
    </div>
  );
}
