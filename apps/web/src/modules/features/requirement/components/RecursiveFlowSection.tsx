import EllipsisMenu from "@/components/EllipsisMenu";
import { renderRequirementText } from "@/utils/requirement_utils";
import { RequirementDto } from "@repo/shared-schemas";
import { useState } from "react";
import RequirementForm from "./RequirementForm";
import RequirementSection from "./RequirementSection";

interface RecursiveFlowSectionProps {
  requirements: RequirementDto[];
  type: "S" | "E";
  projectId: string;
  parentIndex?: string;
  isRoot?: boolean;
}

export default function RecursiveFlowSection({
  requirements,
  type,
  projectId,
  parentIndex = "",
  isRoot = true,
}: RecursiveFlowSectionProps) {
  const [openFormParentId, setOpenFormParentId] = useState<string | null>(null);

  if (!requirements || requirements.length === 0) return null;

  const flattenFlows = (
    baseIndex: string,
    reqs: RequirementDto[],
  ): { id: string; sectionId: string; requirements: RequirementDto[] }[] => {
    const flows: { id: string; sectionId: string; requirements: RequirementDto[] }[] = [];

    reqs.forEach((req, idx) => {
      const sectionId = baseIndex ? `${baseIndex}-${idx + 1}` : `${idx + 1}`;
      const children = type === "S" ? (req.nestedRequirements ?? []) : (req.exceptions ?? []);

      if (children.length > 0) {
        flows.push({ id: req.id, sectionId, requirements: children });

        flows.push(...flattenFlows(sectionId, children));
      }
    });

    return flows;
  };

  const flows = flattenFlows(parentIndex, requirements);

  if (flows.length === 0) return null;

  return (
    <>
      <RequirementSection title={isRoot ? (type === "S" ? "Sub Flow" : "Exceptional Flow") : ""}>
        {flows.map((flow) => (
          <RequirementSection key={flow.sectionId} title={`${type}${flow.sectionId}`}>
            {flow.requirements.map((child, idx) => (
              <div key={child.id} className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <p>
                    {idx + 1}. {renderRequirementText(child)}
                  </p>
                  <EllipsisMenu
                    actions={[
                      { label: "Edit", onClick: () => console.log("Edit", child.id) },
                      { label: "Delete", onClick: () => console.log("Delete", child.id) },
                      {
                        label: "Add Exception",
                        onClick: () => console.log("Add Exception", child.id),
                      },
                      {
                        label: "Add Sub Requirements",
                        onClick: () => setOpenFormParentId(child.id),
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </RequirementSection>
        ))}
      </RequirementSection>

      {openFormParentId && (
        <RequirementForm
          isOpen={!!openFormParentId}
          onClose={() => setOpenFormParentId(null)}
          projectId={projectId}
          parentRequirementId={openFormParentId} // only parent
        />
      )}
    </>
  );
}
