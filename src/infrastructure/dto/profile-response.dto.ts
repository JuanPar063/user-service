import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Identificador único del perfil',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  id_profile: string;

  @ApiProperty({
    description: 'Identificador único del usuario (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id_user: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Juan',
  })
  first_name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  last_name: string;

  @ApiProperty({
    description: 'Tipo de documento de identidad',
    example: 'CC',
  })
  document_type: string;

  @ApiProperty({
    description: 'Número del documento de identidad',
    example: '1020304050',
  })
  document_number: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+573001112233',
  })
  phone: string;

  @ApiProperty({
    description: 'Dirección de residencia',
    example: 'Calle 123 #45-67, Bogotá',
  })
  address: string;

  constructor(user: any) {
    this.id_profile = user.id_profile;
    this.id_user = user.id_user;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.document_type = user.document_type;
    this.document_number = user.document_number;
    this.phone = user.phone;
    this.address = user.address;
  }
}
