import { Profile } from '../../entities/profile.entity';

export interface CreateProfilePort {
  createProfile(profileData: { 
    id_profile: string
    id_user: string;
    first_name: string; 
    last_name: string; 
    document_type: string; 
    document_number: string; 
    phone: string; 
    address: string; 
  }): Promise<Profile>;
}