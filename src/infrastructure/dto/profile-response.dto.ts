import { Profile } from '../../domain/entities/profile.entity';

export class ProfileResponseDto {
  id_user: string;
  first_name: string;
  last_name: string;
  name: string; // ✅ NUEVO: nombre completo
  document_type: string;
  document_number: string;
  phone: string;
  address: string;
  monthly_income: number; // ✅ NUEVO
  created_at: Date;
  updated_at: Date;

  constructor(profile: Profile) {
    this.id_user = profile.id_user;
    this.first_name = profile.first_name;
    this.last_name = profile.last_name;
    this.name = `${profile.first_name} ${profile.last_name}`; // ✅ Nombre completo
    this.document_type = profile.document_type;
    this.document_number = profile.document_number;
    this.phone = profile.phone;
    this.address = profile.address;
    this.monthly_income = Number(profile.monthly_income) || 0; // ✅ Ingreso mensual
  }
}