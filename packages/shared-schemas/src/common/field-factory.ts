import { z } from "../zod-openapi-init";
import {
  stringField,
  numberField,
  booleanField,
  dateField,
  uuidField,
  emailField,
  // Assuming these would be added to fields.ts
  urlField,
  integerField,
  arrayField,
} from "./fields";

import { ZodEnum, ZodNativeEnum, ZodTypeAny } from "zod";

// Expanded field type list with additional types
type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "uuid"
  | "email"
  | "url"
  | "integer"
  | "array";
// Enhanced options interface with more validation capabilities
interface FieldOptions<T extends ZodTypeAny = ZodTypeAny> {
  min?: number;
  max?: number;
  regex?: RegExp;
  message?: string;
  nullable?: boolean;
  optional?: boolean;
  default?: unknown;
  enum?: readonly [string, ...string[]];
  description?: string;
  elementType?: T; // Now typed
}

/* -------------------------
   Type-level mapping
   ------------------------- */
type BaseSchemaFor<
  T extends FieldType,
  E extends ZodTypeAny = ZodTypeAny,
> = T extends "array"
  ? z.ZodArray<E>
  : T extends "string"
    ? typeof stringField
    : T extends "number"
      ? typeof numberField
      : T extends "boolean"
        ? typeof booleanField
        : T extends "date"
          ? typeof dateField
          : T extends "uuid"
            ? typeof uuidField
            : T extends "email"
              ? typeof emailField
              : T extends "url"
                ? typeof urlField
                : T extends "integer"
                  ? typeof integerField
                  : z.ZodTypeAny;

// Helper to determine if a field type supports min/max validation
const supportsMinMax = (type: FieldType): boolean =>
  ["string", "number", "email", "uuid", "url", "integer"].includes(type);

// Helper to determine if a field is a string type
const isStringType = (type: FieldType): boolean =>
  ["string", "email", "uuid", "url"].includes(type);

/**
 * Creates a strongly-typed Zod schema field based on type and options
 */
export function createField<
  T extends FieldType,
  E extends ZodTypeAny = ZodTypeAny,
>(type: T, options: FieldOptions<E> = {}): BaseSchemaFor<T, E> {
  let field: ZodTypeAny;

  // Start with base field type
  switch (type) {
    case "string":
      field = stringField;
      break;
    case "number":
      field = numberField;
      break;
    case "boolean":
      field = booleanField;
      break;
    case "date":
      field = dateField;
      break;
    case "uuid":
      field = uuidField;
      break;
    case "email":
      field = emailField;
      break;
    case "url":
      field = urlField;
      break;
    case "integer":
      field = integerField;
      break;
    case "array":
      if (!options.elementType) {
        throw new Error("Element type must be provided for array fields");
      }
      field = arrayField(options.elementType);
      break;

    default:
      const exhaustiveCheck: never = type;
      throw new Error(`Unsupported field type: ${exhaustiveCheck}`);
  }

  // Apply min/max if applicable
  if (options.min !== undefined && supportsMinMax(type)) {
    field = (field as any).min(options.min, {
      message:
        options.message ??
        `Must be at least ${options.min} ${isStringType(type) ? "characters" : ""}`,
    });
  }

  if (options.max !== undefined && supportsMinMax(type)) {
    field = (field as any).max(options.max, {
      message:
        options.message ??
        `Cannot exceed ${options.max} ${isStringType(type) ? "characters" : ""}`,
    });
  }

  // Apply regex for string fields
  if (isStringType(type) && options.regex) {
    field = (field as any).regex(options.regex, {
      message: options.message || "Invalid format",
    });
  }

  // Apply enum validation if applicable
  if (isStringType(type) && options.enum) {
    field = field.refine((val) => options.enum!.includes(val as string), {
      message:
        options.message || `Value must be one of: ${options.enum.join(", ")}`,
    });
  }

  // Apply optional/nullable transformations
  if (options.nullable) {
    field = field.nullable();
  }

  if (options.optional) {
    field = field.optional();
  }

  if (options.default !== undefined) {
    field = field.default(options.default);
  }

  if (options.description) {
    field = field.describe(options.description);
  }

  return field as BaseSchemaFor<T, E>;
}

// Interface for enum field options
// interface EnumFieldOptions<T extends readonly string[]> {
//   message?: string;
//   nullable?: boolean;
//   optional?: boolean;
//   default?: T[number]; // Type ensures default is one of the enum values
//   description?: string;
// }

/**
 * Creates a strongly-typed Zod enum schema based on provided values and options
 */
// export function createEnumField<T extends readonly [string, ...string[]]>(
//   values: [...T],
//   options: EnumFieldOptions<T> = {},
// ) {
//   let field = z.enum(values);

//   // Apply optional/nullable transformations
//   if (options.nullable) {
//     field = (field as any).nullable();
//   }

//   if (options.optional) {
//     field = (field as any).optional();
//   }

//   if (options.default !== undefined) {
//     field = (field as any).default(options.default);
//   }

//   if (options.description) {
//     field = field.describe(options.description);
//   }

//   return field;
// }


type MutableTuple<T extends readonly any[]> = { -readonly [P in keyof T]: T[P] };

interface EnumFieldOptions<T extends string = string> {
  message?: string;
  nullable?: boolean;
  optional?: boolean;
  default?: T;
  description?: string;
}

// Overload: readonly tuple input -> ZodEnum of mutable tuple
export function createEnumField<T extends readonly [string, ...string[]]>(
  values: T,
  options?: EnumFieldOptions<T[number]>
): ZodEnum<MutableTuple<T>>;

// Overload: object-style enum -> ZodNativeEnum
export function createEnumField<T extends { [key: string]: string }>(
  values: T,
  options?: EnumFieldOptions<T[keyof T]>
): ZodNativeEnum<T>;

// Implementation signature must be the union of the overload input types so TS can narrow:
export function createEnumField(
  values: readonly string[] | { [key: string]: string },
  options: EnumFieldOptions = {}
): ZodTypeAny {
  let field: ZodTypeAny;

  if (Array.isArray(values)) {
    if (values.length === 0) {
      throw new Error("Enum array must have at least one value.");
    }
    // cast to tuple type that z.enum expects
    field = z.enum(values as unknown as [string, ...string[]]);
  } else if (
    typeof values === "object" &&
    Object.values(values).every((v) => typeof v === "string")
  ) {
    // nativeEnum works with objects whose values are strings (your `as const` object)
    field = z.nativeEnum(values as any);
  } else {
    throw new Error(
      "Enum must be a non-empty array of strings or a string-valued object."
    );
  }

  if (options.nullable) field = field.nullable();
  if (options.optional) field = field.optional();
  if (options.default !== undefined) field = field.default(options.default);
  if (options.description) field = field.describe(options.description);

  return field;
}
