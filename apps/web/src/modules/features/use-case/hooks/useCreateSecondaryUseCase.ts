import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSecondaryUseCaseDto } from "@repo/shared-schemas";
import { secondaryUseCaseClient } from "../api/clients/secondary-use-case-client";
import { requirementQueryKeys } from "../../requirement/query/requirement-query-keys";
import { useCaseQueryKeys } from "../query/use-case-query-keys";

export function useCreateSecondaryUseCase(
  useCaseIdToInvalidate: string,
  opts?: {
    onSuccess?: (data: unknown, variables: CreateSecondaryUseCaseDto) => void;
    onError?: (error: unknown, variables?: CreateSecondaryUseCaseDto) => void;
  },
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSecondaryUseCaseDto) =>
      secondaryUseCaseClient.createSecondaryUseCase(payload),
    onSettled: () => {
      // Refresh requirements of the primary use case so E/S show their secondary use cases
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
