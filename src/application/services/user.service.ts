import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { UserRepositoryPort } from '../../domain/ports/out/user-repository.port';
import { CreateUserPort } from '../../domain/ports/in/create-user.port';
import { GetUserPort } from '../../domain/ports/in/get-user.port';

@Injectable()
export class UserService implements CreateUserPort, GetUserPort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async createUser(userData: { name: string; email: string; password: string; role: 'client' | 'admin' }): Promise<User> {
    return this.userRepository.create(userData);
  }

  async getUser(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}