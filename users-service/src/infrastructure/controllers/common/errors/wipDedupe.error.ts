export class WipDedupeError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, WipDedupeError.prototype);
    this.name = 'WipDedupeError';
  }
}
