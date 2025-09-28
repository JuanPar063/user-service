import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infrastructure/config/database.config';
import { ProfileService } from './application/services/profile.service';
import { ProfileController } from './infrastructure/adapters/in/profile.controller';
import { ProfileRepository } from './infrastructure/adapters/out/repositories/user.repository';
import { Profile } from './domain/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Profile]),
  ],
  providers: [
    ProfileService,
    ProfileRepository,
  ],
  controllers: [ProfileController],
})
export class AppModule {}