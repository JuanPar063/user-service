import { Profile } from '../../entities/profile.entity';

export interface GetProfilePort {
  getProfile(id: string): Promise<Profile | null>;
  getAllProfiles(): Promise<Profile[]>;
  getProfileByPhone(phone: string): Promise<Profile | null>;
}