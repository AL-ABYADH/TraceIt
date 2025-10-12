// hooks/useUpdateRequirementLabels.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { requirementClient } from "../api/clients/requirement-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";
import { diagramQueryKeys } from "../../use-case-diagram/query/diagram-query-keys";
import {
  updateNode,
  selectIsDirty,
  selectDiagramId,
  selectFlowDataForSaving,
  markAsSaved,
} from "@/modules/core/flow/store/flow-slice";
import { useUpdateDiagram } from "@/modules/core/flow/hooks/useUpdateDiagram";
import { RequirementListDto, UpdateRequirementLabelsDto } from "@repo/shared-schemas";
import { showErrorNotification } from "@/components/notifications";

export function useUpdateRequirementLabels(
  requirementId: string,
  useCaseIdToInvalidate: string,
  opts?: {
    onSuccess?: (data: unknown, variables: UpdateRequirementLabelsDto) => void;
    onError?: (error: unknown, variables?: UpdateRequirementLabelsDto) => void;
  },
) {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  // Get diagram state
  const diagramId = useSelector(selectDiagramId);
  const flowData = useSelector(selectFlowDataForSaving);
  const isDirty = useSelector(selectIsDirty);
  const { mutateAsync: updateDiagramAsync } = useUpdateDiagram();

  return useMutation({
    mutationFn: async (payload: UpdateRequirementLabelsDto) => {
      // First save the diagram if there are unsaved changes
      if (diagramId && isDirty) {
        try {
          await updateDiagramAsync({
            diagramId,
            diagram: {
              nodes: flowData.nodes as any,
              edges: flowData.edges as any,
            },
          });
          dispatch(markAsSaved()); // Mark as saved in Redux
          console.log("Diagram saved successfully before requirement label update");
        } catch (error) {
          showErrorNotification(`Failed to save diagram before requirement label update: ${error}`);
          // Continue with requirement update even if diagram save fails
        }
      }

      // Then update the requirement labels
      return requirementClient.updateRequirementLabels(requirementId, payload);
    },
    onMutate: async (payload) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await qc.cancelQueries({
        queryKey: requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
      });

      // Snapshot the previous value
      const previousRequirements = qc.getQueryData<RequirementListDto[]>(
        requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
      );

      // Optimistically update the React Query cache
      if (previousRequirements) {
        qc.setQueryData<RequirementListDto[]>(
          requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
          previousRequirements.map((req) =>
            req.id === requirementId ? { ...req, ...payload } : req,
          ),
        );
      }

      // Update the Redux store for immediate UI update in the flow
      dispatch(
        updateNode({
          id: requirementId,
          updates: {
            data: {
              ...payload,
            },
          },
        }),
      );

      return { previousRequirements };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousRequirements) {
        qc.setQueryData(
          requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
          context.previousRequirements,
        );
      }
      opts?.onError?.(error, variables);
    },
    onSettled: () => {
      // Invalidate requirement queries
      qc.invalidateQueries({
        queryKey: requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
      });

      // Now safely invalidate diagram queries since we've saved any changes
      if (diagramId) {
        // Pattern 1: Invalidate all diagrams list
        qc.invalidateQueries({
          queryKey: diagramQueryKeys.list,
        });

        // Pattern 2: Invalidate by relation with useCaseId (most likely)
        qc.invalidateQueries({
          queryKey: diagramQueryKeys.byRelation(useCaseIdToInvalidate),
        });

        // Pattern 3: Invalidate specific diagram
        qc.invalidateQueries({
          queryKey: diagramQueryKeys.detail(diagramId),
        });
        qc.invalidateQueries({
          queryKey: ["diagrams"],
        });
        // Pattern 4: Broad invalidation for any diagram-related queries
        qc.invalidateQueries({
          queryKey: ["activityDiagram"],
        });
      }
    },
    onSuccess: (data, variables) => {
      opts?.onSuccess?.(data, variables);
    },
  });
}
