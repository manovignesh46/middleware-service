import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class ControllerLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ControllerLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;

    this.logger.log(
      `${method} ${originalUrl} handled by ${className}.${methodName}`,
    );

    return next.handle();
  }
}
