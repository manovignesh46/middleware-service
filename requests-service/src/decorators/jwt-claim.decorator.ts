import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export const JWTClaim = createParamDecorator((data, req: ExecutionContext) => {
  const logger = new Logger(JWTClaim.name);
  if (typeof data != 'string') {
    logger.error(`You cannot pass ${data} into the @Claim() decorator`);
    throw new Error('You can only pass a string value into @Claim() Decorator');
  }
  const httpReq: Request = req.switchToHttp().getRequest();
  const bearerToken = httpReq.headers?.authorization;
  if (bearerToken) {
    const token = bearerToken.split(' ')[1];
    const jwtService = new JwtService();
    const decodedToken = jwtService.decode(token);
    const claimValue = decodedToken[data];
    if (claimValue) {
      return claimValue;
    }
  }
  /* Do not return null or undefined */
  logger.error(`${data} claim in JWT is not defined.`);
  throw new Error(`${data} claim in JWT is not defined.`);
});
