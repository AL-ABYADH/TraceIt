import { z } from "../zod-openapi-init";
import {
  actorNameFieldDoc,
  updatedActorNameFieldDoc,
  actorSubTypeEnumDoc,
  actorProjectIdField,
  actorTypeEnumDoc,
  actorIdFieldDoc,
  actorUpdatedAtFieldDoc,
  actorCreatedAtFieldDoc,
} from "./openapi-fields";

/**
 * =========================
 * CREATE ACTOR SCHEMA
 * =========================
 */

export const actorSubtypeSchema = z
  .object({
    subtype: actorSubTypeEnumDoc,
  })
  .openapi({ title: "SubTypeActorDto" });

export const actorTypeSchema = z
  .object({
    type: actorTypeEnumDoc,
  })
  .openapi({ title: "ActorTypeDto" });

export const addActorSchema = z
  .object({
    name: actorNameFieldDoc,
    projectId: actorProjectIdField,
    subType: actorSubTypeEnumDoc,
  })
  .openapi({ title: "CreateActorDto" });

/**
 * =========================
 * UPDATE ACTOR SCHEMA
 * =========================
 */
export const updateActorSchema = z
  .object({
    name: updatedActorNameFieldDoc,
  })
  .openapi({ title: "UpdateActorDto" });

  export const actorSchema = z
  .object({
    id: actorIdFieldDoc,
    name: actorNameFieldDoc,
    type: actorTypeEnumDoc,
    subtype: actorSubTypeEnumDoc, 
    createdAt: actorCreatedAtFieldDoc,
    updatedAt: actorUpdatedAtFieldDoc,
  })
  .openapi({ title: "ActorResponse" });