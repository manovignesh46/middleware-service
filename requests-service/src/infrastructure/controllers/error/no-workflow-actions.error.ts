export class NoWorkflowActionsError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, NoWorkflowActionsError.prototype);
    this.name = 'NoWorkflowActionsError';
  }
}
