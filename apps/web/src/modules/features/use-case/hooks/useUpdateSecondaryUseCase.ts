import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateSecondaryUseCaseDto } from "@repo/shared-schemas";
import { secondaryUseCaseClient } from "../api/clients/secondary-use-case-client";
import { requirementQueryKeys } from "../../requirement/query/requirement-query-keys";

export function useUpdateSecondaryUseCase(
  secondaryUseCaseId: string,
  useCaseIdToInvalidate: string,
  opts?: {
    onSuccess?: (data: unknown, variables: UpdateSecondaryUseCaseDto) => void;
    onError?: (error: unknown, variables?: UpdateSecondaryUseCaseDto) => void;
  },
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSecondaryUseCaseDto) =>
      secondaryUseCaseClient.updateSecondaryUseCase(secondaryUseCaseId, payload),
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
      });
    },
    onSuccess: (data, variables) => {
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });
}
