export class CustomerAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, CustomerAlreadyExistsError.prototype);
    this.name = 'CustomerAlreadyExistsError';
  }
}
