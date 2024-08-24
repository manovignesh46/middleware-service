import { IBase } from '../../domain/model/base.interface';
import { IntegratorErrorType } from './integrator-error-type.enum';
import { IntegratorName } from './IntegratorName.enum';

export interface IIntegratorErrorMapping extends IBase {
  id: string;
  integratorName: IntegratorName;
  endpointName: string;
  receivedHttpCode: number;
  receivedResponseStatusCode: number;
  receivedRejectionOrErrorCode: string;
  receivedErrorDescription: string;
  mappedErrorCode: string;
  mappedErrorMessage: string;
  errorType: IntegratorErrorType;
}
