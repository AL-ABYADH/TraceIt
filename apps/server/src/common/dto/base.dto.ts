/**
 * A generic base DTO (Data Transfer Object) class.
 * Provides a method to convert the DTO into a plain object of type T.
 */
export class BaseDto<T extends object> {
  /**
   * Converts the DTO instance to a plain object of type T.
   * ⚠️ This assumes that the field names in the DTO and the target interface T are identical.
   */
  toInterface(): T {
    return Object.assign({} as T, this);
  }
}
