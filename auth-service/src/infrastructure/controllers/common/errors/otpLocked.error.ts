export class OtpLockedError extends Error {
  constructor(message, public timeToUnlockMinutes: number) {
    super(message);
    Object.setPrototypeOf(this, OtpLockedError.prototype);
    this.name = 'OtpLockedError';
  }
}
