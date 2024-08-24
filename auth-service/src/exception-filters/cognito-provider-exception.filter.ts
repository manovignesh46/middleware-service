// import {
//   CognitoIdentityProviderServiceException,
//   InvalidPasswordException,
//   TooManyRequestsException,
//   UsernameExistsException,
//   UserNotConfirmedException,
//   UserNotFoundException,
// } from '@aws-sdk/client-cognito-identity-provider';
// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { generateExceptionFilterResponse } from './helper';

// @Catch(CognitoIdentityProviderServiceException)
// export class CognitoProviderServiceExceptionFilter implements ExceptionFilter {
//   private logger = new Logger(CognitoProviderServiceExceptionFilter.name);
//   catch(exception: Error, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     let response = ctx.getResponse<Response>();
//     this.logger.log(exception);
//     //sign up
//     if (exception instanceof UsernameExistsException) {
//       //add custom response
//     } else if (exception instanceof InvalidPasswordException) {
//       //add custom response
//     } else if (exception instanceof TooManyRequestsException) {
//       //add custom response
//     }

//     //login
//     else if (exception instanceof UserNotConfirmedException) {
//       //ad custom response
//     } else if (exception instanceof UserNotFoundException) {
//       //add custom response
//     }
//     response = generateExceptionFilterResponse(
//       response,
//       HttpStatus.INTERNAL_SERVER_ERROR,
//       exception.message,
//     );
//   }
// }
