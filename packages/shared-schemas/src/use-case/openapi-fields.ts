import { addUseCaseFields, updateUseCaseFields } from "./fields";

export const addUseCaseFieldsDoc = {
  name: addUseCaseFields.name.openapi({
    example: "Login",
  }),
  projectId: addUseCaseFields.projectId.openapi({
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  subType: addUseCaseFields.subType.openapi({
    example: "primary",
  }),
};

export const updateUseCaseFieldsDoc = {
  name: updateUseCaseFields.name?.openapi({
    example: "Updated Login",
  }),
  briefDescription: updateUseCaseFields.briefDescription?.openapi({
    example: "Allows the user to log into the system using email and password",
  }),
};
