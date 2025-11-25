// src/infrastructure/adapters/out/repositories/profile.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileRepositoryPort } from '../../../../domain/ports/out/profile-repository.port';
import { Profile } from '../../../../domain/entities/profile.entity';

@Injectable()
export class ProfileRepository implements ProfileRepositoryPort {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  async save(profile: Profile): Promise<Profile> {
    return this.repo.save(profile);
  }

  async findById(id: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { id_profile: id } });
  }

  async findAll(): Promise<Profile[]> {
    return this.repo.find({
      order: {
        first_name: 'ASC'
      }
    });
  }

  async findByPhone(phone: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { phone } });
  }

  /**
   * ✅ NUEVO: Busca un perfil por número de documento
   */
  async findByDocumentNumber(documentNumber: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { document_number: documentNumber } });
  }

  async create(profileData: { 
    id_user: string;
    first_name: string; 
    last_name: string; 
    document_type: string; 
    document_number: string; 
    phone: string; 
    address: string;  
  }): Promise<Profile> {
    const profile = this.repo.create({
      id_user: profileData.id_user,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      document_type: profileData.document_type,
      document_number: profileData.document_number,
      phone: profileData.phone,
      address: profileData.address
    });
    
    return this.repo.save(profile);
  }
}