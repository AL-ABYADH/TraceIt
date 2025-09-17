import { z } from "../zod-openapi-init";
import { actorSubTypeEvent, actorTypeVirtual } from "./fields";
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

export const eventActorSchema = actorSchema
  .omit({ type: true, subtype: true })
  .extend({
    type: actorTypeVirtual,
    subtype: actorSubTypeEvent,
  })
  .openapi("EventActor", {
    title: "Event Actor",
    description:
      "An actor representing a virtual event in the system. Must have type 'virtual' and subtype 'event'.",
    example: {
      id: "f9e1c8a4-5a68-4c79-86d9-abc123456789",
      name: "System Maintenance",
      type: "virtual",
      subtype: "event",
      createdAt: "2025-09-14T10:00:00.000Z",
      updatedAt: "2025-09-14T12:00:00.000Z",
    },
  });
