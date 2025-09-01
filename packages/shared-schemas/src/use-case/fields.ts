import { createEnumField, createField } from "../common/field-factory";

export const addUseCaseFields = {
  name: createField("string", {
    min: 1,
    max: 100,
    description: "Use case name",
  }),

  projectId: createField("uuid", {
    description: "The ID of the project to which the use case belongs",
  }),

  subType: createEnumField(
    ["primary", "secondary", "actor", "diagram", "relationship"],
    {
      description: "Type of the use case",
    },
  ),
};

// Fields for updating a use case
export const updateUseCaseFields = {
  name: createField("string", {
    min: 1,
    max: 100,
    optional: true,
    description: "Use case name",
  }),

  briefDescription: createField("string", {
    max: 200,
    optional: true,
    description: "Brief description of the use case",
  }),
};
