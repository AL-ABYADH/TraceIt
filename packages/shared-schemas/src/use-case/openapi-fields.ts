import {
  useCaseNameField,
  useCaseDescriptionField,
  primaryActorIdsField,
  secondaryActorIdsField,
  initialStateField,
  finalStateField,
  useCaseIdsField,
  actorsIdsField,
  UseCaseImportanceLevelField,
  UseCaseImportanceLevel,
} from "./fields";
import { uuidField } from "../common";

// Primary identifiers

export const primaryUseCaseIdFieldDoc = uuidField.openapi({
  description:
    "The unique identifier of the primary use case this secondary use case belongs to",
  example: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
});

export const secondaryUseCaseIdFieldDoc = uuidField.openapi({
  description: "The unique identifier of the secondary use case",
  example: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
});
// Use case core fields
export const useCaseNameFieldDoc = useCaseNameField.openapi({
  description:
    "A clear, concise name that describes what the use case accomplishes",
  example: "Authenticate User Login",
});

export const useCaseDescriptionFieldDoc = useCaseDescriptionField.openapi({
  description:
    "A detailed explanation of the use case functionality, including its purpose and key behaviors",
  example:
    "This use case allows registered users to securely authenticate into the system using their email and password credentials. The system validates the credentials and grants access to authorized features upon successful authentication.",
});

export const UseCaseImportanceEnumDoc = UseCaseImportanceLevelField.openapi({
  description:
    "The importance level of this use case for prioritization purposes",
  example: UseCaseImportanceLevel.HIGH,
});

// Actor relationship fields
export const primaryActorIdsFieldDoc = primaryActorIdsField.openapi({
  description:
    "Array containing the UUID identifiers of all primary actors who directly initiate or participate in this use case",
  example: ["12345678-1234-1234-1234-123456789abc"],
});

export const secondaryActorIdsFieldDoc = secondaryActorIdsField.openapi({
  description:
    "Array containing the UUID identifiers of all secondary actors who provide support or receive notifications during this use case",
  example: [
    "11111111-2222-3333-4444-555555555555",
    "66666666-7777-8888-9999-000000000000",
  ],
});

// Diagram fields
export const initialStateFieldDoc = initialStateField.openapi({
  description: "The initial state description for the use case diagram",
  example: "User is not authenticated",
});

export const finalStateFieldDoc = finalStateField.openapi({
  description:
    "The final state description for the use case diagram (optional)",
  example: "User is authenticated and redirected to dashboard",
});

export const useCaseIdsFieldDoc = useCaseIdsField.openapi({
  description:
    "List of UUID identifiers for use cases to include in the diagram",
  example: [
    "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    "ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj",
  ],
});

export const actorsIdsFieldDoc = actorsIdsField.openapi({
  title: "ActorsDto",
  description: "A list of actor IDs to add or remove from a use case",
});
