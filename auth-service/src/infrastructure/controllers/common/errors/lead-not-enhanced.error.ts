export class LeadNotEnhancedError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, LeadNotEnhancedError.prototype);
    this.name = 'LeadNotEnhancedError';
  }
}
