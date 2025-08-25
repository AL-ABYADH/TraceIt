import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ZodSchema, ZodError } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    console.log(value);

    if (result.success) {
      return result.data;
    }

    const formatted = result.error.format();

    // Flatten the errors into field-message pairs (optional for Nest-style errors)
    const errorMessages = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    throw new BadRequestException({
      message: "Validation failed",
      // errors: errorMessages,
      errors: formatted, // You can remove this key if you only want flat errors
    });
  }
}
