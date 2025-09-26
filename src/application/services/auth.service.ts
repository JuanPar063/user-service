import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser (email: string, password: string): Promise<User | null> {
    // Lógica: Buscar user y comparar password (inyecta repo aquí en prod)
    // Por simplicidad, asume inyección
    return null; // Implementa con repo
  }

  generateToken(user: User) {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }
}