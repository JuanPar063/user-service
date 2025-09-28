import { Profile } from '../../entities/profile.entity';

export interface ProfileRepositoryPort {
  save(profile: Profile): Promise<Profile>;
  findById(id: string): Promise<Profile | null>;
  findAll(): Promise<Profile[]>;
  create(ProfileData: { 
    id_user: string
    id_profile: string;
    first_name: string; 
    last_name: string; 
    document_type: string; 
    document_number: string; 
    phone: string; 
    address: string; 
  }): Promise<Profile>;
  findByPhone(phone: string): Promise<Profile | null>;
}