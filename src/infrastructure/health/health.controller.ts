import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get('liveness')
  @HealthCheck()
  @ApiOperation({ summary: 'Liveness probe (el proceso está vivo)' })
  liveness() {
    return this.health.check([]);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe (dependencias listas)' })
  readiness() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
