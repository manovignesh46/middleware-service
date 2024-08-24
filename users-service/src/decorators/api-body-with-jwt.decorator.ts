import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiBodyOptions } from '@nestjs/swagger';

export const ApiBodyWithJWTBearerToken = (apiBodyOptions: ApiBodyOptions) => {
  return applyDecorators(
    ApiBearerAuth('jwt-access-token'),
    ApiBody(apiBodyOptions),
  );
};
