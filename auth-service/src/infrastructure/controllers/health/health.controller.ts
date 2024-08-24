import { Controller, Dependencies, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
@Dependencies(HealthCheckService, HttpHealthIndicator)
export class HealthController {
  constructor(private health, private http) {}

  @Get()
  @ApiOkResponse({ schema: { type: 'boolean', example: true } })
  healthCheck() {
    return 'true';
  }
}
