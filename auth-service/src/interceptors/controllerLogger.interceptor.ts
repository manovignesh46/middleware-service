import tracer from 'dd-trace';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class ControllerLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ControllerLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;

    const span = tracer.scope().active();

    this.logger.log(
      `${method} ${originalUrl} handled by ${className}.${methodName}`,
    );

    if (span) {
      const traceId = span.context().toTraceId();
      const spanId = span.context().toSpanId();
      this.logger.log(
        `${method} ${originalUrl} handled by ${className}.${methodName} with traceId: ${traceId} and spanId: ${spanId}`,
      );
    } else {
      this.logger.log(
        `${method} ${originalUrl} handled by ${className}.${methodName} without trace`,
      );
    }

    return next.handle();
  }
}
