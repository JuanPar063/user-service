// src/domain/ports/out/profile-repository.port.ts

import { Profile } from '../../entities/profile.entity';

export interface ProfileRepositoryPort {
  save(profile: Profile): Promise<Profile>;
  findById(id: string): Promise<Profile | null>;
  findAll(): Promise<Profile[]>;
  findByPhone(phone: string): Promise<Profile | null>;
  
  /**
   * ✅ NUEVO: Busca un perfil por número de documento
   */
  findByDocumentNumber(documentNumber: string): Promise<Profile | null>;
  
  create(ProfileData: { 
    id_user: string;
    first_name: string; 
    last_name: string; 
    document_type: string; 
    document_number: string; 
    phone: string; 
    address: string; 
  }): Promise<Profile>;
}