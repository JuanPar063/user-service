import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  // REMOVEMOS id_profile del DTO ya que se genera automáticamente
  
  @ApiProperty({
    description: 'Identificador único del usuario (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  id_user: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  first_name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  last_name: string;

  @ApiProperty({
    description: 'Tipo de documento de identidad',
    example: 'CC',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  document_type: string;

  @ApiProperty({
    description: 'Número del documento de identidad',
    example: '1020304050',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  document_number: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+573001112233',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;

  @ApiProperty({
    description: 'Dirección de residencia',
    example: 'Calle 123 #45-67, Bogotá',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  address: string;
}
