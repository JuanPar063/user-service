import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileRepository } from '../../infrastructure/adapters/out/repositories/profile.repository';
import { CreateProfilePort } from '../../domain/ports/in/create-profile.port';
import { GetProfilePort } from '../../domain/ports/in/get-profile.port';

@Injectable()
export class ProfileService implements CreateProfilePort, GetProfilePort {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async createProfile(profileData: { 
    id_user: string
    id_profile: string;
    first_name: string; 
    last_name: string; 
    document_type: string; 
    document_number: string; 
    phone: string; 
    address: string; 
  }): Promise<Profile> {
    // Verificar si el teléfono ya existe
    const existingProfile = await this.profileRepository.findByPhone(profileData.phone);
    if (existingProfile) {
      throw new ConflictException('Ya existe un usuario con este número de teléfono');
    }

    return this.profileRepository.create(profileData);
  }

  async getProfile(id: string): Promise<Profile | null> {
    const profile = await this.profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return profile;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.profileRepository.findAll();
  }

  async getProfileByPhone(phone: string): Promise<Profile | null> {
    const profile = await this.profileRepository.findByPhone(phone);
    if (!profile) {
      throw new NotFoundException(`Usuario con teléfono ${phone} no encontrado`);
    }
    return profile;
  }
}