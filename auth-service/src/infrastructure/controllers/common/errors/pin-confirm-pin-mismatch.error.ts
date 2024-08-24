export class PinConfirmPinMismatchError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, PinConfirmPinMismatchError.prototype);
    this.name = 'PinConfirmPinMismatchError';
  }
}
