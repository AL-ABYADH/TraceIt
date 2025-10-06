import EllipsisMenu from "@/components/EllipsisMenu";
import { renderRequirementText } from "@/utils/requirement_utils";
import { RequirementDto } from "@repo/shared-schemas";
import { useState } from "react";
import RequirementForm from "./RequirementForm";
import RequirementExceptionForm from "./RequirementExceptionForm";
import RequirementSection from "./RequirementSection";
import SecondaryUseCaseForm from "../../use-case/components/SecondaryUseCaseForm";
import Chip from "@/components/Chip";

interface RecursiveFlowSectionProps {
  requirements: RequirementDto[];
  type: "S" | "E";
  projectId: string;
  validatedUseCaseId: string;
  parentIndex?: string; // numeric S path without the leading "S" (e.g., "5-1")
  isRoot?: boolean;
}

export default function RecursiveFlowSection({
  requirements,
  type,
  projectId,
  validatedUseCaseId,
  parentIndex = "",
  isRoot = true,
}: RecursiveFlowSectionProps) {
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
      requirements: RequirementDto[];
      secondaryUseCaseName?: string;
      secondaryUseCaseId?: string;
    }[] => {
      const flows: {
        id: string;
        sectionId: string;
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
          });
          flows.push(...flattenFlows(sectionId, children));
        }
      });
      return flows;
    };

    const flows = flattenFlows(parentIndex, requirements);

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

    // Helper to render a single exception block with its requirements and nested flows
    function renderExceptionSection(exception: any, label: string, baseSRef: string) {
      const exceptionReqs = exception.requirements ?? [];
      // Normalize numeric S path (drop leading 'S' if present) for computing child S refs
      const baseIndex = baseSRef.startsWith("S") ? baseSRef.slice(1) : baseSRef;

      return (
        <RequirementSection
          key={exception.id || label}
          title={
            <>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 rounded-md bg-muted text-muted-foreground text-xs font-mono">
                  {label}
                </span>
                <Chip label="Exception" value={exception.name} color="amber" />
                {(() => {
                  const s = (exception as any)?.secondaryUseCase;
                  const x = Array.isArray(s) ? s[0] : s;
                  return x?.name ? <Chip label="Secondary" value={x.name} color="indigo" /> : null;
                })()}
                <EllipsisMenu
                  actions={(() => {
                    const actions: { label: string; onClick: () => void }[] = [];
                    const rawSec = (exception as any)?.secondaryUseCase;
                    const normSec = Array.isArray(rawSec) ? rawSec[0] : rawSec;
                    const hasSecondary = Boolean(normSec?.id);
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
                      label: "Add Requirement",
                      onClick: () => setOpenExceptionForm({ exceptionId: exception.id }),
                    });
                    return actions;
                  })()}
                />
              </div>
            </>
          }
        >
          {exceptionReqs.length > 0 ? (
            exceptionReqs.map((child: RequirementDto, idx: number) => {
              const childNumericS = baseIndex ? `${baseIndex}-${idx + 1}` : `${idx + 1}`;
              const childSRef = `S${childNumericS}`;
              return (
                <div key={child.id} className="flex flex-col">
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 ">
                    <p>
                      {idx + 1}. {renderRequirementText(child)}
                    </p>
                    <EllipsisMenu
                      actions={[
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
                        { label: "Delete", onClick: () => console.log("Delete", child.id) },
                        {
                          label: "Add Exception",
                          onClick: () => setOpenExceptionParentId(child.id),
                        },
                        {
                          label: "Add Sub Requirement",
                          onClick: () => setOpenFormParentId(child.id),
                        },
                      ]}
                    />
                  </div>

                  {/* Render S (sub flow) for this child */}
                  {child.nestedRequirements && child.nestedRequirements.length > 0 && (
                    <RecursiveFlowSection
                      requirements={[child]}
                      type="S"
                      projectId={projectId}
                      validatedUseCaseId={validatedUseCaseId}
                      parentIndex={childNumericS}
                      isRoot={false}
                    />
                  )}

                  {/* Inline render E (exceptions) for this child, using E(E...) naming based on parent exception label */}
                  {Array.isArray(child.exceptions) && child.exceptions.length > 0 && (
                    <div>
                      {child.exceptions.map((cEx: any, cEIdx: number) => {
                        const base = `E(${label})`;
                        const nestedLabel = cEIdx === 0 ? base : `${base}-${cEIdx}`;
                        return renderExceptionSection(cEx, nestedLabel, childSRef);
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-sm text-muted-foreground italic px-2 py-1">
              No requirements in this exception. Add requirements to this exception.
            </div>
          )}
        </RequirementSection>
      );
    }

    return (
      <>
        {/* Sub Flow sections */}
        {flows.length > 0 && (
          <div className=" mb-6">
            <RequirementSection title={isRoot ? "Sub Flow" : ""}>
              {flows.map((flow) => (
                <RequirementSection
                  key={flow.sectionId}
                  title={
                    <>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-mono">
                          S{flow.sectionId}
                        </span>
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
                              label: "Add Sub Requirement",
                              onClick: () => setOpenFormParentId(flow.id),
                            });
                            return actions;
                          })()}
                        />
                      </div>
                    </>
                  }
                >
                  {flow.requirements.map((child, idx) => (
                    <div key={child.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                        <p>
                          {idx + 1}. {renderRequirementText(child)}
                        </p>
                        <EllipsisMenu
                          actions={(() => {
                            const actions: { label: string; onClick: () => void }[] = [];
                            if (flow.secondaryUseCaseId) {
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
                              label: "Add Sub Requirement",
                              onClick: () => setOpenFormParentId(flow.id),
                            });
                            return actions;
                          })()}
                        />
                      </div>
                    </div>
                  ))}
                </RequirementSection>
              ))}
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

  // If not S, do not render anything here (Exceptional flow is aggregated in the S branch)
  return null;
}
