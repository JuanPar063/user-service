import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1620000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crea schema si no existe
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS user_service;`);
    // Cambia search_path para esta conexión
    await queryRunner.query(`SET search_path TO user_service, public;`);
    // Crea tabla
    await queryRunner.query(`
      CREATE TABLE "user" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'admin'))
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_service."user";`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS user_service CASCADE;`);
  }
}