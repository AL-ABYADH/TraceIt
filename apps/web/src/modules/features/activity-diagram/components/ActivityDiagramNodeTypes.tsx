import { NodeType } from "@repo/shared-schemas";
import { ActivityShape } from "./ActivityShape";
import { DecisionShape } from "./DecisionShape";
import { InitialShape } from "./InitialShape";
import { FinalShape } from "./FinalShape";
import { FlowFinalShape } from "./FlowFinalShape";
import { MergeShape } from "./MergeShape";
import { ForkShape } from "./ForkShape";
import { JoinShape } from "./JoinShape";

export default function ActivityDiagramNodeTypes({
  onClose,
  onClick,
}: {
  onClose: () => void;
  onClick: (nodeType: NodeType) => void;
}) {
  return (
    <>
      <div className="space-y-4">
        <ActivityShape
          name="Activity"
          onClick={() => {
            onClick(NodeType.ACTIVITY);
            onClose();
          }}
        />

        <DecisionShape
          name="Decision"
          onClick={() => {
            onClick(NodeType.DECISION_NODE);
            onClose();
          }}
        />

        <div className="grid grid-cols-2 gap-4 items-center">
          <InitialShape
            onClick={() => {
              onClick(NodeType.INITIAL_NODE);
              onClose();
            }}
          />

          <FinalShape
            onClick={() => {
              onClick(NodeType.FINAL_NODE);
              onClose();
            }}
          />

          <FlowFinalShape
            onClick={() => {
              onClick(NodeType.FLOW_FINAL_NODE);
              onClose();
            }}
          />

          <MergeShape
            onClick={() => {
              onClick(NodeType.MERGE_NODE);
              onClose();
            }}
          />

          <ForkShape
            onClick={() => {
              onClick(NodeType.FORK_NODE);
              onClose();
            }}
          />

          <JoinShape
            onClick={() => {
              onClick(NodeType.JOIN_NODE);
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
}
