import { useQuery } from "@tanstack/react-query";
import { requirementClient as requirementExceptionClient } from "../api/clients/requirement-exception-client";

export function useRequirementExceptionDetail(exceptionId?: string, enabled = true) {
  return useQuery({
    queryKey: ["requirement-exception", "detail", exceptionId],
    queryFn: () => requirementExceptionClient.getRequirementException(exceptionId as string),
    enabled: enabled && !!exceptionId,
  });
}
