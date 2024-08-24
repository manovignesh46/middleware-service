import { EndpointName } from './endpoint-name.enum';
import { IntegratorName } from './IntegratorName.enum';

export class IntegratorError extends Error {
  constructor(
    message: string,
    public integratorName: IntegratorName,
    public endpointName: EndpointName,
    public httpStatusCode: number,
    public responseBodyStatusCode: number,
    public rejectionOrErrorCode: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, IntegratorError.prototype);
    this.name = 'IntegratorError';
  }
}
