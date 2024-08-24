export class OtpNotExpiredError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, OtpNotExpiredError.prototype);
    this.name = 'OtpNotExpiredError';
  }
}
