import {
  AbstractModelFactoryDefinition,
  AbstractNeogmaModel,
  defineAbstractModelFactory,
} from "@repo/custom-neogma";

export type ActorAttributes = {
  id: string;
  name: string;

  [key: string]: any;
};

export interface ActorRelationships {
  project: any;
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
    },
    relationships: {
      project: {
        model: "Project",
        direction: "out",
        name: "BELONGS_TO",
        cardinality: "one",
      },
    },
  });
