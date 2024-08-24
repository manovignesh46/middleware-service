import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { StatusMessagePresenter } from '../infrastructure/controllers/requests/presenters/statusMessage.presenter';

export const generateExceptionFilterResponse = (
  response: Response,
  internalStatusCode: number,
  message: string,
): Response => {
  return response
    .status(HttpStatus.OK)
    .json(new StatusMessagePresenter(internalStatusCode, message));
};
