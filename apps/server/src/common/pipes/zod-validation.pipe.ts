import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    console.log(value);

    if (result.success) {
      return result.data;
    }

    // Flatten the errors into field-message pairs (optional for Nest-style errors)
    const errorMessages = result.error.issues.map((err) => {
      const path = err.path.join(".");
      const invalidValue = (err as any).params?.value;

      return {
        field: invalidValue !== undefined ? String(invalidValue) : path,
        message: err.message,
      };
    });
    throw new UnprocessableEntityException({
      error: "ValidationFailed",
      statusCode: 422,
      message: "Validation failed",
      data: { errors: errorMessages },
    });
  }
}
