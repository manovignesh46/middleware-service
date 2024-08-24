export class IncorrectWorkflowActionError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, IncorrectWorkflowActionError.prototype);
    this.name = 'IncorrectWorkflowActionError';
  }
}
