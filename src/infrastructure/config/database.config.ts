import { Profile } from '../../domain/entities/profile.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'mydb',
  entities: [Profile],
  // En dev se sincroniza el esquema (crea la tabla profiles automáticamente);
  // en producción NO (usar migraciones).
  synchronize: process.env.NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource({
  ...typeOrmConfig,
  type: 'postgres' as const, // ← Especifica el tipo aquí
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
});
