import { CreateActivityDto, ActivityDto } from "@repo/shared-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activityClient } from "../api/clients/activityClient";
import { activityQueryKeys } from "../query/activity-query-key";

type UseCreateActivityOptions = {
  onSuccess?: (data: ActivityDto, variables: CreateActivityDto) => void;
  onError?: (error: unknown, variables?: CreateActivityDto) => void;
};

export function useCreateActivity(opts?: UseCreateActivityOptions) {
  const qc = useQueryClient();

  const mutation = useMutation<ActivityDto, unknown, CreateActivityDto>({
    mutationFn: (activity: CreateActivityDto) => activityClient.createActivity(activity),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: activityQueryKeys.list });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: activityQueryKeys.list });
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (activity: CreateActivityDto) => mutation.mutate(activity);
  const mutateAsync = (activity: CreateActivityDto) => mutation.mutateAsync(activity);

  return { ...mutation, mutate, mutateAsync };
}
