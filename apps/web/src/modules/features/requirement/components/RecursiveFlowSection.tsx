import EllipsisMenu from "@/components/EllipsisMenu";
import { renderRequirementText } from "@/utils/requirement_utils";
import { RequirementDto } from "@repo/shared-schemas";
import { useState } from "react";
import RequirementForm from "./RequirementForm";
import RequirementExceptionForm from "./RequirementExceptionForm";
import RequirementSection from "./RequirementSection";
import SecondaryUseCaseForm from "../../use-case/components/SecondaryUseCaseForm";
import Chip from "@/components/Chip";
import { useDeleteRequirement } from "../hooks/useDeleteRequirement";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeleteRequirementException } from "../hooks/useDeleteRequirementException";
import * as React from "react";
import { route } from "nextjs-routes";
import { useRouter } from "next/navigation";

interface RecursiveFlowSectionProps {
  requirements: RequirementDto[];
  type: "S" | "E";
  projectId: string;
  validatedUseCaseId: string;
  parentIndex?: string; // numeric S path without the leading "S" (e.g., "5-1")
  isRoot?: boolean;
  parentContextLabel?: string;
}

export default function RecursiveFlowSection({
  requirements,
  type,
  projectId,
  validatedUseCaseId,
  parentContextLabel = "",
  parentIndex = "",
  isRoot = true,
}: RecursiveFlowSectionProps) {
  const router = useRouter();

  const [openEditRequirement, setOpenEditRequirement] = useState<null | {
    id: string;
    initial: { operation: string; condition?: string; actorIds: string[] };
  }>(null);
  const [openSecondaryForRequirement, setOpenSecondaryForRequirement] = useState<{
    requirementId: string;
  } | null>(null);
  const [openSecondaryForException, setOpenSecondaryForException] = useState<{
    exceptionId: string;
  } | null>(null);
  const [openEditSecondary, setOpenEditSecondary] = useState<{
    secondaryUseCaseId: string;
    initialName?: string;
  } | null>(null);
  const [openFormParentId, setOpenFormParentId] = useState<string | null>(null);
  const [openExceptionParentId, setOpenExceptionParentId] = useState<string | null>(null);
  const [openExceptionForm, setOpenExceptionForm] = useState<{ exceptionId: string } | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteExceptionOpen, setIsDeleteExceptionOpen] = useState(false);
  const [deleteExceptionId, setDeleteExceptionId] = useState<string | null>(null);
  const [openEditException, setOpenEditException] = useState<null | {
    id: string;
    initial: { name: string };
  }>(null);

  // Use the hook with the validated use case id for invalidation
  const deleteRequirement = useDeleteRequirement(deleteId ?? "", validatedUseCaseId, {
    onSuccess: () => {
      setIsDeleteOpen(false);
      setDeleteId(null);
    },
    onError: () => {
      // Handle error as needed
    },
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

  // helper to build S display label; respects exception context if present
  // REPLACE existing buildSDisplayLabel with this
  function buildSDisplayLabel(sectionId: string, parentCtx?: string) {
    if (parentCtx) {
      const lastSegment = String(sectionId).split("-").slice(-1)[0];
      return `S(${parentCtx}-${lastSegment})`;
    }
    return `S${sectionId}`;
  }

  if (!requirements || requirements.length === 0) return null;

  // Only use the S branch for rendering flows. E is aggregated into one section.
  if (type === "S") {
    // Flatten to all sub-flow sections (each node that has children becomes an S section)
    const flattenFlows = (
      baseIndex: string,
      reqs: RequirementDto[],
    ): {
      id: string;
      sectionId: string;
      parentRequirement: RequirementDto;
      requirements: RequirementDto[];
      secondaryUseCaseName?: string;
      secondaryUseCaseId?: string;
    }[] => {
      const flows: {
        id: string;
        sectionId: string;
        parentRequirement: RequirementDto;
        requirements: RequirementDto[];
        secondaryUseCaseName?: string;
        secondaryUseCaseId?: string;
      }[] = [];
      reqs.forEach((req, idx) => {
        const sectionId = baseIndex ? `${baseIndex}-${idx + 1}` : `${idx + 1}`;
        const children = req.nestedRequirements ?? [];
        if (children.length > 0) {
          const rawSecUC = (req as any)?.secondaryUseCase;
          const secUC = Array.isArray(rawSecUC) ? rawSecUC[0] : rawSecUC;
          flows.push({
            id: req.id,
            sectionId,
            requirements: children,
            secondaryUseCaseName: secUC?.name,
            secondaryUseCaseId: secUC?.id,
            parentRequirement: req,
          });
          flows.push(...flattenFlows(sectionId, children));
        }
      });
      return flows;
    };

    const rawFlows = flattenFlows(parentIndex, requirements);

    // Deduplicate flows by sectionId + parentRequirement.id
    const flowsMap = new Map<string, (typeof rawFlows)[number]>();
    rawFlows.forEach((f) => {
      const key = `${f.sectionId}::${f.parentRequirement.id}`;
      if (!flowsMap.has(key)) flowsMap.set(key, f);
    });
    const flows = Array.from(flowsMap.values());
    flows.sort((fa, fb) => compareSectionIdStrings(fa.sectionId, fb.sectionId));

    // --- sort helpers (compare numeric segments of sectionId like "1-5-2")
    function sectionIdToNumbers(id: string) {
      return String(id)
        .split("-")
        .map((s) => {
          const n = parseInt(s, 10);
          return Number.isFinite(n) ? n : -1;
        });
    }
    function compareSectionIdStrings(a: string, b: string) {
      const an = sectionIdToNumbers(a);
      const bn = sectionIdToNumbers(b);
      const len = Math.max(an.length, bn.length);
      for (let i = 0; i < len; i++) {
        const av = an[i] ?? -1;
        const bv = bn[i] ?? -1;
        if (av !== bv) return av - bv;
      }
      return 0;
    }

    // Aggregate ALL exceptions (main + sub + deeper) into a single list with proper labels
    type AggregatedException = { exception: any; label: string; baseSRef: string };
    const aggregated: AggregatedException[] = [];

    // 1) Root/main requirement exceptions: E5, E7-1, ...
    if (isRoot) {
      requirements.forEach((req, rIdx) => {
        if (Array.isArray(req.exceptions) && req.exceptions.length > 0) {
          req.exceptions.forEach((ex: any, eIdx: number) => {
            const base = `E${rIdx + 1}`;
            const label = eIdx === 0 ? base : `${base}-${eIdx}`; // additional exceptions: -1, -2, ...
            aggregated.push({ exception: ex, label, baseSRef: String(rIdx + 1) });
          });
        }
      });
    }

    // 2) Exceptions from all sub requirements using their S path: E(S5-1), E(S5-1)-1, ...
    flows.forEach((flow) => {
      flow.requirements.forEach((child, cIdx) => {
        if (Array.isArray(child.exceptions) && child.exceptions.length > 0) {
          const sRef = `${flow.sectionId}-${cIdx + 1}`; // numeric S path e.g. 5-1-2
          child.exceptions.forEach((ex: any, eIdx: number) => {
            const base = `E(S${sRef})`;
            const label = eIdx === 0 ? base : `${base}-${eIdx}`;
            aggregated.push({ exception: ex, label, baseSRef: `S${sRef}` });
          });
        }
      });
    });

    // --------------------
    // Build exceptionFlows: flows coming from requirements that are inside exceptions
    // (so nested requirements of an exception appear in Sub Flow as S(E...))
    // --------------------
    type FlowWithContext = {
      id: string;
      sectionId: string;
      parentRequirement: RequirementDto;
      requirements: RequirementDto[];
      secondaryUseCaseName?: string;
      secondaryUseCaseId?: string;
      contextLabel?: string; // <-- exception label like 'E1' or 'E(S5-1)'
    };

    const exceptionFlows: FlowWithContext[] = [];

    // For every aggregated exception, check its requirements and collect nestedRequirements as flows.
    // Use flattenFlows to get deeper nested flows and mark them with the exception label (context).
    aggregated.forEach(({ exception, label, baseSRef }) => {
      const exReqs = exception.requirements ?? [];
      const baseIndex = baseSRef.startsWith("S") ? baseSRef.slice(1) : baseSRef;

      exReqs.forEach((child: RequirementDto, childIdx: number) => {
        const childNumericS = baseIndex ? `${baseIndex}-${childIdx + 1}` : `${childIdx + 1}`;
        // if this child has nested requirements, add it as a flow under the exception context
        if (child.nestedRequirements && child.nestedRequirements.length > 0) {
          const rawSecUC = (child as any)?.secondaryUseCase;
          const secUC = Array.isArray(rawSecUC) ? rawSecUC[0] : rawSecUC;
          exceptionFlows.push({
            id: child.id,
            sectionId: childNumericS,
            parentRequirement: child,
            requirements: child.nestedRequirements,
            secondaryUseCaseName: secUC?.name,
            secondaryUseCaseId: secUC?.id,
            contextLabel: label,
          });

          // also flatten deeper nested flows and tag them with the same context
          const deeper = flattenFlows(childNumericS, child.nestedRequirements).map((f) => ({
            ...f,
            contextLabel: label,
          }));
          exceptionFlows.push(...deeper);
        }
      });
    });

    // Helper to render a single exception block with its requirements and nested flows
    function renderExceptionSection(exception: any, label: string, baseSRef: string) {
      const exceptionReqs = exception.requirements ?? [];
      const baseIndex = baseSRef.startsWith("S") ? baseSRef.slice(1) : baseSRef;

      // collect exceptions that belong to requirements inside this exception
      type CollectedChildException = {
        exception: any;
        childSRef: string;
        childNumber: number;
        childExceptionIndex: number;
      };
      const collectedChildExceptions: CollectedChildException[] = [];

      return (
        <RequirementSection
          key={`${exception.id ?? label}::${baseSRef}`}
          title={
            <>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 rounded-md bg-muted text-muted-foreground text-xs font-mono">
                  {label}
                </span>
                <Chip label="Exception" value={exception.name} color="rose" />
                {(() => {
                  const s = (exception as any)?.secondaryUseCase;
                  const x = Array.isArray(s) ? s[0] : s;
                  return x?.name ? <Chip label="Secondary" value={x.name} color="indigo" /> : null;
                })()}
                <EllipsisMenu
                  actions={(() => {
                    const actions: { label: string; onClick: () => void; danger?: boolean }[] = [];
                    const rawSec = (exception as any)?.secondaryUseCase;
                    const normSec = Array.isArray(rawSec) ? rawSec[0] : rawSec;
                    const hasSecondary = Boolean(normSec?.id);

                    actions.push({
                      label: "Add Requirement",
                      onClick: () => setOpenExceptionForm({ exceptionId: exception.id }),
                    });

                    if (hasSecondary) {
                      actions.push({
                        label: "Edit Secondary Use Case",
                        onClick: () =>
                          setOpenEditSecondary({
                            secondaryUseCaseId: normSec.id,
                            initialName: normSec.name,
                          }),
                      });
                    } else {
                      actions.push({
                        label: "Add Secondary Use Case",
                        onClick: () => setOpenSecondaryForException({ exceptionId: exception.id }),
                      });
                    }

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
                    actions.push({
                      label: "View in Requirements",
                      onClick: () =>
                        router.push(
                          route({
                            pathname: "/projects/[project-id]/requirements",
                            query: {
                              "project-id": projectId,
                              useCaseId: validatedUseCaseId,
                              exceptionId: exception.id,
                            },
                          }),
                        ),
                    });

                    return actions;
                  })()}
                />
              </div>
            </>
          }
        >
          {exceptionReqs.length > 0 ? (
            <>
              {exceptionReqs.toReversed().map((child: RequirementDto, idx: number) => {
                const childNumericS = baseIndex ? `${baseIndex}-${idx + 1}` : `${idx + 1}`;
                const childSRef = `S${childNumericS}`;

                // collect child's exceptions to render AFTER this exception's requirements
                // include childNumber and childExceptionIndex so we can form E(E1-<req#>)-<exIdx>
                if (Array.isArray(child.exceptions) && child.exceptions.length > 0) {
                  child.exceptions.forEach((ce: any, ceIdx: number) => {
                    collectedChildExceptions.push({
                      exception: ce,
                      childSRef,
                      childNumber: idx + 1,
                      childExceptionIndex: ceIdx,
                    } as any);
                  });
                }

                return (
                  <div key={child.id} className="flex flex-col">
                    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 ">
                      <div className="flex items-center gap-3 p-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-muted text-muted-foreground">
                          {idx + 1}
                        </span>
                        <p>{renderRequirementText(child)}</p>
                      </div>

                      <EllipsisMenu
                        actions={[
                          {
                            label: "Add Exception",
                            onClick: () => setOpenExceptionParentId(child.id),
                          },
                          {
                            label: "Add Sub Requirement",
                            onClick: () => setOpenFormParentId(child.id),
                          },
                          {
                            label: "Edit",
                            onClick: () =>
                              setOpenEditRequirement({
                                id: child.id,
                                initial: {
                                  operation: child.operation,
                                  condition: child.condition,
                                  actorIds: (child.actors ?? []).map((a: any) => a.id),
                                },
                              }),
                          },
                          {
                            label: "Delete",
                            onClick: () => {
                              setDeleteId(child.id);
                              setIsDeleteOpen(true);
                            },
                            danger: true,
                          },
                          {
                            label: "View in Requirements",
                            onClick: () =>
                              router.push(
                                route({
                                  pathname: "/projects/[project-id]/requirements",
                                  query: {
                                    "project-id": projectId,
                                    useCaseId: validatedUseCaseId,
                                    requirementId: child.id,
                                  },
                                }),
                              ),
                          },
                        ]}
                      />
                    </div>

                    {/* NOTE: DO NOT render child's nestedRequirements inline here.
              Those nested requirements are moved to `exceptionFlows` above and
              will appear in Sub Flow as S(<exception>-<path>) */}
                  </div>
                );
              })}

              {/* Render collected child exceptions AFTER all parent-exception requirements.
        We built collectedChildExceptions with both childNumber and childExceptionIndex so
        the naming becomes: E(<parentLabel>-<childNumber>) and E(<parentLabel>-<childNumber>)-1 ... */}
              {collectedChildExceptions.length > 0 &&
                collectedChildExceptions.map((col: any) => {
                  const base = `E(${label}-${col.childNumber})`;
                  const nestedLabel =
                    col.childExceptionIndex === 0 ? base : `${base}-${col.childExceptionIndex}`;
                  return renderExceptionSection(col.exception, nestedLabel, col.childSRef);
                })}
            </>
          ) : (
            <div className="text-sm text-muted-foreground italic px-2 py-1">
              No requirements in this exception. Add requirements to this exception.
            </div>
          )}
        </RequirementSection>
      );
    }
    const allFlows: FlowWithContext[] = [...flows, ...exceptionFlows];

    return (
      <>
        {/* Sub Flow sections */}
        {flows.length > 0 && (
          <div className=" mb-6">
            <RequirementSection title={isRoot ? "Sub Flow" : ""}>
              {allFlows.map((flow) => {
                // composite key includes context so exception-derived flows don't collide
                const uniqueKey = `${flow.sectionId}::${flow.parentRequirement.id}::${flow.contextLabel ?? ""}`;
                // prefer flow.contextLabel (comes from exceptionFlows) and fallback to parentContextLabel
                const ctx = flow.contextLabel ?? parentContextLabel;
                const displaySLabel = buildSDisplayLabel(flow.sectionId, ctx);

                return (
                  <RequirementSection
                    key={uniqueKey}
                    title={
                      <>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-mono">
                            {displaySLabel}
                          </span>

                          <Chip
                            label="Operation"
                            value={flow.parentRequirement.operation}
                            color="emerald"
                          />
                          {flow.secondaryUseCaseName && (
                            <Chip
                              label="Secondary"
                              value={flow.secondaryUseCaseName}
                              color="indigo"
                            />
                          )}
                          <EllipsisMenu
                            actions={(() => {
                              const actions: { label: string; onClick: () => void }[] = [];
                              if (flow.secondaryUseCaseId) {
                                actions.push({
                                  label: "Add Sub Requirement",
                                  onClick: () => setOpenFormParentId(flow.id),
                                });
                                actions.push({
                                  label: "Edit Secondary Use Case",
                                  onClick: () =>
                                    setOpenEditSecondary({
                                      secondaryUseCaseId: flow.secondaryUseCaseId!,
                                      initialName: flow.secondaryUseCaseName,
                                    }),
                                });
                              } else {
                                actions.push({
                                  label: "Add Secondary Use Case",
                                  onClick: () =>
                                    setOpenSecondaryForRequirement({ requirementId: flow.id }),
                                });
                              }
                              actions.push({
                                label: "View in Requirements",
                                onClick: () =>
                                  router.push(
                                    route({
                                      pathname: "/projects/[project-id]/requirements",
                                      query: {
                                        "project-id": projectId,
                                        useCaseId: validatedUseCaseId,
                                        requirementId: flow.id,
                                      },
                                    }),
                                  ),
                              });
                              return actions;
                            })()}
                          />
                        </div>
                      </>
                    }
                  >
                    {flow.requirements.map((child, idx) => (
                      <div
                        key={`${child.id}::${flow.sectionId}::${idx}`}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                          <div className="flex items-center gap-3 p-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-muted text-muted-foreground">
                              {idx + 1}
                            </span>
                            <p>{renderRequirementText(child)}</p>
                          </div>

                          <EllipsisMenu
                            actions={[
                              {
                                label: "Add Exception",
                                onClick: () => setOpenExceptionParentId(child.id),
                              },
                              {
                                label: "Add Sub Requirement",
                                onClick: () => setOpenFormParentId(child.id),
                              },
                              {
                                label: "Edit",
                                onClick: () =>
                                  setOpenEditRequirement({
                                    id: child.id,
                                    initial: {
                                      operation: child.operation,
                                      condition: child.condition,
                                      actorIds: (child.actors ?? []).map((a: any) => a.id),
                                    },
                                  }),
                              },
                              {
                                label: "Delete",
                                onClick: () => {
                                  setDeleteId(child.id);
                                  setIsDeleteOpen(true);
                                },
                                danger: true,
                              },

                              {
                                label: "View in Requirements",
                                onClick: () =>
                                  router.push(
                                    route({
                                      pathname: "/projects/[project-id]/requirements",
                                      query: {
                                        "project-id": projectId,
                                        useCaseId: validatedUseCaseId,
                                        requirementId: child.id,
                                      },
                                    }),
                                  ),
                              },
                            ]}
                          />
                        </div>

                        {/* NOTE: DO NOT render child's nestedRequirements inline here.
                    Nested sub-flows are rendered as their own entries in `flows`. */}

                        {/* DO NOT render inline child.exceptions here — Exceptional Flow section handles them. */}
                      </div>
                    ))}
                  </RequirementSection>
                );
              })}
            </RequirementSection>
          </div>
        )}

        {/* Single Exceptional Flow section */}
        {isRoot && aggregated.length > 0 && (
          <div>
            <RequirementSection title="Exceptional Flow">
              {aggregated.map(({ exception, label, baseSRef }) =>
                renderExceptionSection(exception, label, baseSRef),
              )}
            </RequirementSection>
          </div>
        )}

        {openFormParentId && (
          <RequirementForm
            isOpen={!!openFormParentId}
            onClose={() => setOpenFormParentId(null)}
            projectId={projectId}
            validatedUseCaseId={validatedUseCaseId}
            parentRequirementId={openFormParentId}
          />
        )}

        {openExceptionForm && (
          <RequirementForm
            isOpen={!!openExceptionForm}
            onClose={() => setOpenExceptionForm(null)}
            projectId={projectId}
            validatedUseCaseId={validatedUseCaseId}
            exceptionId={openExceptionForm.exceptionId}
          />
        )}

        {openSecondaryForRequirement && (
          <SecondaryUseCaseForm
            isOpen={!!openSecondaryForRequirement}
            onClose={() => setOpenSecondaryForRequirement(null)}
            mode="create"
            projectId={projectId}
            primaryUseCaseId={validatedUseCaseId}
            requirementId={openSecondaryForRequirement.requirementId}
            invalidateUseCaseId={validatedUseCaseId}
          />
        )}

        {openSecondaryForException && (
          <SecondaryUseCaseForm
            isOpen={!!openSecondaryForException}
            onClose={() => setOpenSecondaryForException(null)}
            mode="create"
            projectId={projectId}
            primaryUseCaseId={validatedUseCaseId}
            exceptionId={openSecondaryForException.exceptionId}
            invalidateUseCaseId={validatedUseCaseId}
          />
        )}

        {openEditSecondary && (
          <SecondaryUseCaseForm
            isOpen={!!openEditSecondary}
            onClose={() => setOpenEditSecondary(null)}
            mode="edit"
            projectId={projectId}
            primaryUseCaseId={validatedUseCaseId}
            secondaryUseCaseId={openEditSecondary.secondaryUseCaseId}
            initialName={openEditSecondary.initialName}
            invalidateUseCaseId={validatedUseCaseId}
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

        {openExceptionParentId && (
          <RequirementExceptionForm
            isOpen={!!openExceptionParentId}
            onClose={() => setOpenExceptionParentId(null)}
            useCaseId={validatedUseCaseId}
            parentRequirementId={openExceptionParentId}
          />
        )}

        {/* Confirmation Dialog for Delete */}
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          title="Delete Requirement"
          message="Are you sure you want to delete this requirement? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          onConfirm={() => {
            if (deleteId) deleteRequirement.mutate();
          }}
          onCancel={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          loading={deleteRequirement.isPending}
        />

        {/* Confirmation Dialog for Delete Exception */}
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
      </>
    );
  }

  // If not S, do not render anything here (Exceptional flow is aggregated in the S branch)
  return null;
}
