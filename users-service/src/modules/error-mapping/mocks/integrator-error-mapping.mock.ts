import { IIntegratorErrorMapping } from '../integrator-error-mapping.interface';
import { IntegratorName } from '../IntegratorName.enum';
import { EndpointName } from '../endpoint-name.enum';
import { IntegratorErrorType } from '../integrator-error-type.enum';
export const mockIntegratorErrorMapping: IIntegratorErrorMapping = {
  id: 'id123',
  integratorName: IntegratorName.PEGPAY,
  endpointName: EndpointName.GET_STUDENT_DETAILS,
  receivedHttpCode: 200,
  receivedResponseStatusCode: 100,
  receivedRejectionOrErrorCode: null,
  receivedErrorDescription: 'Student Not Found',
  mappedErrorCode: '3099',
  mappedErrorMessage: 'Please input a valid student number',
  errorType: IntegratorErrorType.TECHINICAL,
  createdAt: new Date(),
  updatedAt: new Date(),
};
