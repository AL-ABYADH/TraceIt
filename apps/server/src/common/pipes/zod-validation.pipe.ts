import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
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
    const errorMessages = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    throw new BadRequestException({
      errors: errorMessages,
    });
  }
}
