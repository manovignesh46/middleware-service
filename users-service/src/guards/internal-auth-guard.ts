import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class InternalAuthGuard implements CanActivate {
  private logger = new Logger(InternalAuthGuard.name);
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const expectedApiKey =
      this.configService.get<string>('INTERNAL_API_KEY') || 'changeme';
    let apiKey: string;
    try {
      apiKey = request.headers['internal-api-key'];
    } catch (err) {
      this.logger.error(err.stack);
      return false;
    }
    return apiKey === expectedApiKey;
  }
}
