export const idField = {
  type: "string",
  required: true,
  pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
  message: "is not a valid UUID v4",
};
