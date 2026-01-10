// src/infrastructure/dto/update-profile.dto.ts

import { IsString, IsOptional, MinLength, MaxLength, Matches, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Juan' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  first_name?: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  last_name?: string;

  @ApiPropertyOptional({ example: '+573001234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+57\d{10}$|^\d{10}$/, {
    message: 'El teléfono debe tener formato +57XXXXXXXXXX o 10 dígitos',
  })
  phone?: string;

  @ApiPropertyOptional({ example: 'Calle 123 #45-67' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address?: string;

  @ApiPropertyOptional({
    description: 'Ingreso mensual en COP',
    example: 2500000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthly_income?: number;
}