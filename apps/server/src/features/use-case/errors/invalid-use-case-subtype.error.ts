export class InvalidUseCaseSubtypeError extends Error {
  constructor(subtype: string) {
    super(`Invalid use case subtype: ${subtype}`);
    Object.setPrototypeOf(this, InvalidUseCaseSubtypeError.prototype);
  }
}
