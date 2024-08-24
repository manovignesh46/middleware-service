export class SchoolAggregatorConnectionError extends Error {
  constructor(message, public httpStatus?: number) {
    super(message);
    Object.setPrototypeOf(this, SchoolAggregatorConnectionError.prototype);
    this.name = 'SchoolAggregatorConnectionError';
  }
}
