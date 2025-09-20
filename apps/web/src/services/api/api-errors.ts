export class ApiError extends Error {
  error: string;
  statusCode: number;
  data?: any;

  constructor(error: string, message: string, statusCode: number, data?: any) {
    super(message);
    this.name = error;
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
  }
}

export class ApiValidationError extends ApiError {
  data: { errors: ApiFieldValidationError[] };

  constructor(message: string, statusCode: number, data: { errors: ApiFieldValidationError[] }) {
    super("ApiValidationError", message, statusCode, data);
    this.data = data;
  }
}

export type ApiFieldValidationError = { field: string; message: string };

export const isApiValidationError = (
  err: any,
): err is { statusCode: number; data: { errors: ApiFieldValidationError[] } } => {
  if (!err || typeof err !== "object") return false;
  return (
    err.name === "ApiValidationError" ||
    (err.statusCode === 422 && Array.isArray(err?.data?.errors))
  );
};
