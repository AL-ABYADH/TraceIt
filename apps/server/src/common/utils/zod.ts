import { ZodError } from "zod";
import { UnprocessableEntityException, InternalServerErrorException } from "@nestjs/common";

export function formatZodErrors(err: ZodError) {
  return err.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));
}

/**
 * Throws UnprocessableEntityException for request validation,
 * InternalServerErrorException for response validation (server bug).
 */
export function throwZodError(err: ZodError, { asResponse = false } = {}): never {
  const payload = {
    error: asResponse ? "ResponseValidationFailed" : "ValidationFailed",
    statusCode: asResponse ? 500 : 422,
    message: asResponse ? "Response schema validation failed" : "Validation failed",
    data: { errors: formatZodErrors(err) },
  };

  if (asResponse) throw new InternalServerErrorException(payload);
  throw new UnprocessableEntityException(payload);
}
