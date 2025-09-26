import { IsEmail, IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['client', 'admin'])
  role: 'client' | 'admin';
}