import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../../../domain/ports/out/user-repository.port';
import { User } from '../../../../domain/entities/user.entity'; // Asume User es @Entity

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  // Implementación requerida por el port
  async create(userData: { name: string; email: string; password: string; role: 'client' | 'admin' }): Promise<User> {
    // Mapear a la entidad. Aquí se guarda la contraseña tal cual en passwordHash;
    // idealmente el hashing se hace en la capa de servicio (UserService).
    const user = this.repo.create({
      name: userData.name,
      email: userData.email,
      passwordHash: userData.password,
      role: userData.role,
    } as Partial<User>);
    return this.repo.save(user);
  }
}
