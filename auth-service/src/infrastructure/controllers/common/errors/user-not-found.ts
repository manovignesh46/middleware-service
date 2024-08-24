export class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
    this.name = 'UserNotFoundError';
  }
}
