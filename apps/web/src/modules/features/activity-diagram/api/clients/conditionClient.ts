// api/clients/conditionClient.ts
import { http } from "@/services/api/http";
import { CreateConditionDto, ConditionDto } from "@repo/shared-schemas";
import { conditionEndpoint } from "../condition-endpoint";

async function listConditions(useCaseId?: string): Promise<ConditionDto[]> {
  const params = useCaseId ? { useCaseId } : undefined;
  return http.get(conditionEndpoint.list, { params });
}

async function createCondition(condition: CreateConditionDto): Promise<ConditionDto> {
  return http.post(conditionEndpoint.list, { body: condition });
}

export const conditionClient = {
  listConditions,
  createCondition,
};
