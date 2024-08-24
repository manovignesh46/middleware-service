export class OtpExpiredError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, OtpExpiredError.prototype);
    this.name = 'OtpExpiredError';
  }
}
