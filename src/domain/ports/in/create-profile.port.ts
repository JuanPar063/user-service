import { Profile } from '../../entities/profile.entity';

export interface CreateProfilePort {
  createProfile(userData: { 
    id_user: string;
    // REMOVEMOS id_profile de aquí
    first_name: string; 
    last_name: string; 
    document_type: string; 
    document_number: string; 
    phone: string; 
    address: string; 
  }): Promise<Profile>;
}
