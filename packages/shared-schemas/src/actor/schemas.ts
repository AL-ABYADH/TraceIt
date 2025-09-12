import { z } from "../zod-openapi-init";
import {
  actorNameFieldDoc,
  updatedActorNameFieldDoc,
  actorSubTypeEnumDoc,
  actorProjectIdField,
  actorTypeEnumDoc,
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
