import { NodeType } from "@repo/shared-schemas";
import ActorShape from "./ActorShape";
import { UseCaseShape } from "./UseCaseShape";

export default function UseCaseDiagramNodeTypes({
  onClose,
  onClick,
}: {
  onClose: () => void;
  onClick: (nodeType: NodeType) => void;
}) {
  return (
    <>
      <ActorShape
        name="Actor"
        onClick={() => {
          onClick(NodeType.ACTOR);
          onClose();
        }}
      />
      <UseCaseShape
        name="Use Case"
        onClick={() => {
          onClick(NodeType.USE_CASE);
          onClose();
        }}
      />
    </>
  );
}
