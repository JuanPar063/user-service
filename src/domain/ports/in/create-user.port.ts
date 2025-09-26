import { User } from '../../entities/user.entity';

export interface CreateUserPort {
  createUser (userData: { name: string; email: string; password: string; role: 'client' | 'admin' }): Promise<User>;
}