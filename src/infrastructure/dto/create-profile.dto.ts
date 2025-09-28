import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';

export class CreateProfileDto {
  // REMOVEMOS id_profile del DTO ya que se genera automáticamente
  
  @IsUUID()
  @IsNotEmpty()
  id_user: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  document_type: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  document_number: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  address: string;
}