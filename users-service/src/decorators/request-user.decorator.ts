import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export const User = createParamDecorator((data, req: ExecutionContext) => {
  const logger = new Logger(User.name);
  const httpReq: Request = req.switchToHttp().getRequest();
  const bearerToken = httpReq.headers?.authorization;
  if (bearerToken) {
    const token = bearerToken.split(' ')[1];
    const jwtService = new JwtService();
    const decodedToken = jwtService.decode(token);
    const clientId = decodedToken['custom:customerId'];
    if (clientId) {
      return clientId;
    }
  }
  /* Do not return null or undefined */
  logger.error('custom:customerId claim in JWT is not defined.');
  throw new Error('custom:customerId claim in JWT is not defined');
});
