import { z } from "../zod-openapi-init";
import {
  actorNameFieldDoc,
  updatedActorNameFieldDoc,
  subTypeEnumDoc,
  actorProjectIdField,
} from "./openapi-fields";

/**
 * =========================
 * CREATE ACTOR SCHEMA
 * =========================
 */
export const addActorSchema = z
  .object({
    name: actorNameFieldDoc,
    projectId: actorProjectIdField,
    subType: subTypeEnumDoc,
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
