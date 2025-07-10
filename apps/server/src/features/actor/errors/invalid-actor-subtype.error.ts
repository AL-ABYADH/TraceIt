export class InvalidActorSubtypeError extends Error {
  constructor(subtype: string) {
    super(`Invalid actor subtype: ${subtype}`);
    Object.setPrototypeOf(this, InvalidActorSubtypeError.prototype);
  }
}
