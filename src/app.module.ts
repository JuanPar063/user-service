import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { typeOrmConfig } from './infrastructure/config/database.config';
import { UserService } from './application/services/user.service';
import { AuthService } from './application/services/auth.service';
import { UserController } from './infrastructure/adapters/in/user.controller';
import { UserRepository } from './infrastructure/adapters/out/repositories/user.repository';
import { User } from './domain/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'mysecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService, AuthService, UserRepository],
  controllers: [UserController],
})
export class AppModule {}