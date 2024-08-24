import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const StatusMessageWrapper = <TModel extends Type<any>>(
  model: TModel,
  status?: number,
  message?: string,
  isArray?: boolean,
) => {
  return applyDecorators(
    model ? ApiExtraModels(model) : ApiExtraModels(),
    ApiOkResponse({
      schema: {
        properties: {
          status: {
            type: 'number',
            example: status || 2000,
          },
          message: {
            type: 'string',
            example: message || 'success',
          },
          data: model
            ? {
                type: 'array',
                items: isArray
                  ? {
                      $ref: getSchemaPath(model),
                    }
                  : null,
                $ref: isArray ? '' : getSchemaPath(isArray ? '' : model),
              }
            : null,
        },
      },
    }),
  );
};
