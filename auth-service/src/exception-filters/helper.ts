import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { StatusMessagePresenter } from '../infrastructure/controllers/common/statusMessage.presenter';
export const generateExceptionFilterResponse = (
  response: Response,
  internalStatusCode: number,
  message: string,
): Response => {
  return response
    .status(HttpStatus.OK)
    .json(new StatusMessagePresenter(internalStatusCode, message));
};

export function getTimeToUnlockMinutes(
  otpStatusAt: Date,
  otpLockedCooloffSeconds: number,
) {
  const timeDiff = Date.now() - otpStatusAt.getTime();
  if (timeDiff < 0) {
    return 0;
  } else {
    return Math.ceil((otpLockedCooloffSeconds - timeDiff / 1000) / 60);
  }
}
