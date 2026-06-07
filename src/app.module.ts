import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

import { typeOrmConfig } from './infrastructure/config/database.config';
import { ProfileService } from './application/services/profile.service';
import { ProfileController } from './infrastructure/adapters/in/profile.controller';
import { HealthController } from './infrastructure/health/health.controller';
import { ProfileRepository } from './infrastructure/adapters/out/repositories/profile.repository';
import { Profile } from './domain/entities/profile.entity';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        genReqId: (req) =>
          (req.headers['x-request-id'] as string) ||
          (req.headers['traceparent'] as string) ||
          randomUUID(),
        redact: ['req.headers.authorization'],
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
      },
    ]),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Profile]),
    TerminusModule,
  ],
  providers: [
    ProfileService,
    ProfileRepository,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  controllers: [ProfileController, HealthController],
})
export class AppModule {}
