import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class LOSAuthGuard implements CanActivate {
  private logger = new Logger(LOSAuthGuard.name);
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const expectedApiKey =
      this.configService.get<string>('LOS_CALLBACK_API_KEY') || 'changeme';
    let apiKey: string;
    try {
      apiKey = request.headers['api-key'];
    } catch (err) {
      this.logger.error(err.stack);
      return false;
    }
    return apiKey === expectedApiKey;
  }
}
