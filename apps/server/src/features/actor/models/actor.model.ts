import {
  defineAbstractModelFactory,
  AbstractNeogmaModel,
  AbstractModelFactoryDefinition,
} from "@repo/custom-neogma";
import { ActorType } from "../enums/actor-type.enum";
import { ActorSubtype } from "../enums/actor-subtype.enum";
import { UseCaseAttributes } from "../../use-case/models/use-case.model";
import { ProjectAttributes } from "../../project/models/project.model";

export type ActorAttributes = {
  id: string;
  name: string;
  type: ActorType;
  subtype: ActorSubtype;
  createdAt: string;
  updatedAt: string;
};

export interface ActorRelationships {
  project: ProjectAttributes;
  primaryUseCases: UseCaseAttributes[];
  secondaryUseCases: UseCaseAttributes[];
}

export type ActorModelType = AbstractNeogmaModel<ActorAttributes, ActorRelationships>;

export const ActorModel: AbstractModelFactoryDefinition<ActorAttributes, ActorRelationships> =
  defineAbstractModelFactory<ActorAttributes, ActorRelationships>({
    name: "Actor",
    label: ["Actor"],
    schema: {
      name: {
        type: "string",
        required: true,
        minLength: 1,
        maxLength: 50,
        pattern: "^(?! )[A-Za-z0-9 _-]*(?<! )$", // Only allow alphanumeric characters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces
        message:
          "is not a valid name. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
      },
      type: {
        type: "string",
        required: true,
        enum: Object.values(ActorType),
        message: "must be a valid actor type.",
      },
      subtype: {
        type: "string",
        required: true,
        enum: Object.values(ActorSubtype),
        message: "must be a valid actor subtype.",
      },
    },
    relationships: {
      project: {
        model: "Project",
        direction: "out",
        name: "BELONGS_TO",
        cardinality: "one",
      },
      primaryUseCases: {
        model: "PrimaryUseCase",
        direction: "in",
        name: "HAS_PRIMARY_ACTOR",
        cardinality: "many",
      },
      secondaryUseCases: {
        model: "PrimaryUseCase",
        direction: "in",
        name: "HAS_SECONDARY_ACTOR",
        cardinality: "many",
      },
    },
  });
