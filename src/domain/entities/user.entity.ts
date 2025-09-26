export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'client' | 'admin';

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}