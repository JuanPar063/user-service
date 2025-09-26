import { User } from '../../entities/user.entity';

export interface GetUserPort {
  getUser (id: string): Promise<User | null>;
}