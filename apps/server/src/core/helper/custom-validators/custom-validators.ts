import {
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  getMetadataStorage,
} from "class-validator";

/**
 * Custom validator constraint to ensure that at least one specified field has a value.
 */
@ValidatorConstraint({ name: "atLeastOneOf", async: false })
export class AtLeastOneOfConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as Record<string, any>;
    const fields = args.constraints[0] as string[];

    return fields.some((field) => {
      const fieldValue = object[field];
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
    });
  }

  defaultMessage(args: ValidationArguments): string {
    const fields = (args.constraints[0] as string[]).join(", ");
    return `At least one of the following fields must be provided: ${fields}`;
  }
}

/**
 * Decorator to validate that at least one field in the specified list is present (non-empty).
 *
 * @param fields - An array of field names to validate.
 * @param validationOptions - Optional validation options.
 *
 * @example
 * ```ts
 * @AtLeastOneOf(['email', 'phone', 'username'], {
 *   message: 'Please provide either email, phone, or username.',
 * })
 * class UserDTO {
 *   @IsOptional()
 *   email?: string;
 *
 *   @IsOptional()
 *   phone?: string;
 *
 *   @IsOptional()
 *   username?: string;
 * }
 * ```
 */
export function AtLeastOneOf(
  fields: string[],
  validationOptions?: ValidationOptions,
): ClassDecorator {
  return function (target: Function): void {
    const optionalFields = getOptionalFields(target);
    const missingOptional = fields.filter((field) => !optionalFields.includes(field));

    if (missingOptional.length > 0) {
      throw new Error(
        `AtLeastOneOf validation failed: the following fields must be marked with @IsOptional(): ${missingOptional.join(", ")}`,
      );
    }

    registerDecorator({
      name: "atLeastOneOf",
      target: target,
      propertyName: "__atLeastOneOf__",
      options: validationOptions,
      constraints: [fields],
      validator: AtLeastOneOfConstraint,
    });
  };
}

/**
 * Helper function to retrieve all properties marked with @IsOptional on a class.
 *
 * @param targetClass - The class to inspect.
 * @returns An array of property names that are marked with @IsOptional.
 */
function getOptionalFields(targetClass: Function): string[] {
  const metadataStorage = getMetadataStorage();
  const allMetadata = metadataStorage.getTargetValidationMetadatas(
    targetClass,
    targetClass.name,
    true,
    false,
  );

  return allMetadata
    .filter((metadata) => metadata.name === "isOptional")
    .map((metadata) => metadata.propertyName);
}
