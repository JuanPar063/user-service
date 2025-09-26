import { User } from '../../entities/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  create(userData: { name: string; email: string; password: string; role: 'client' | 'admin' }): Promise<User>;

  findByEmail(email: string): Promise<User | null>;
}