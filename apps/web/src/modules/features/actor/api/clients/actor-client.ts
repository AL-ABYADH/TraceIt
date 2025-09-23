import { http } from "@/services/api/http";
import { ActorDto, AddActorDto, UpdateActorDto } from "@repo/shared-schemas";
import { actorEndpoints } from "../actor-endpoints";

async function listProjectActors(projectId: string): Promise<ActorDto[]> {
  return http.get(actorEndpoints.list, { params: { projectId } });
}

async function addActor(actor: AddActorDto): Promise<ActorDto> {
  return http.post(actorEndpoints.list, { body: actor });
}

async function updateActor(id: string, actor: UpdateActorDto): Promise<ActorDto> {
  return http.put(actorEndpoints.detail, { body: actor, pathParams: { id } });
}

async function removeActor(id: string) {
  return http.del(actorEndpoints.detail, { pathParams: { id } });
}

export const actorClient = {
  listProjectActors,
  addActor,
  updateActor,
  removeActor,
};
