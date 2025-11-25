// src/application/services/profile.service.ts (user-service)

import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileRepository } from '../../infrastructure/adapters/out/repositories/profile.repository';
import { CreateProfilePort } from '../../domain/ports/in/create-profile.port';
import { GetProfilePort } from '../../domain/ports/in/get-profile.port';

@Injectable()
export class ProfileService implements CreateProfilePort, GetProfilePort {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly profileRepository: ProfileRepository) {}

  /**
   * ✅ NUEVO: Valida si un número de documento ya está registrado
   */
  async validateDocumentNumber(documentNumber: string): Promise<{ 
    available: boolean; 
    message: string 
  }> {
    try {
      const existingProfile = await this.profileRepository.findByDocumentNumber(documentNumber);
      
      if (existingProfile) {
        this.logger.warn(`Documento duplicado detectado: ${documentNumber}`);
        return {
          available: false,
          message: 'Este número de documento ya está registrado',
        };
      }

      return {
        available: true,
        message: 'El número de documento está disponible',
      };
    } catch (error) {
      this.logger.debug(`Documento disponible: ${documentNumber}`);
      return {
        available: true,
        message: 'El número de documento está disponible',
      };
    }
  }

  /**
   * Crea un nuevo perfil con validaciones mejoradas
   */
  async createProfile(profileData: {
    id_user: string;
    first_name: string;
    last_name: string;
    document_type: string;
    document_number: string;
    phone: string;
    address: string;
  }): Promise<Profile> {
    try {
      // Validar campos obligatorios
      const camposObligatorios = [
        'id_user',
        'first_name',
        'last_name',
        'document_type',
        'document_number',
        'phone',
        'address',
      ];

      for (const campo of camposObligatorios) {
        const valor = profileData[campo as keyof typeof profileData];
        if (!valor || String(valor).trim() === '') {
          this.logger.warn(`Campo obligatorio faltante: ${campo}`);
          throw new BadRequestException(`El campo '${campo}' es obligatorio.`);
        }
      }

      // ✅ VALIDACIÓN: Verificar si el documento ya existe
      const documentValidation = await this.validateDocumentNumber(profileData.document_number);
      if (!documentValidation.available) {
        this.logger.warn(`Intento de crear perfil con documento duplicado: ${profileData.document_number}`);
        throw new ConflictException(`Ya existe un usuario con el número de documento ${profileData.document_number}`);
      }

      // Normalizar el teléfono
      let phone = String(profileData.phone).trim();

      if (/^\d{10}$/.test(phone)) {
        phone = `+57${phone}`;
        this.logger.debug(`Se normalizó el teléfono agregando +57 → ${phone}`);
      }

      const phoneRegex = /^\+57\d{10}$/;
      if (!phoneRegex.test(phone)) {
        this.logger.warn(`Formato de teléfono inválido: ${profileData.phone}`);
        throw new BadRequestException(
          'El número de teléfono debe tener el formato +57XXXXXXXXXX o 10 dígitos locales.',
        );
      }

      profileData.phone = phone;

      // ✅ VALIDACIÓN: Verificar si el teléfono ya existe
      const existente = await this.profileRepository.findByPhone(profileData.phone);
      if (existente) {
        this.logger.warn(`Intento de crear perfil con teléfono duplicado: ${profileData.phone}`);
        throw new ConflictException('Ya existe un usuario con este número de teléfono.');
      }

      // Crear el perfil
      const creado = await this.profileRepository.create(profileData);
      this.logger.log(`Perfil creado correctamente para el usuario ${profileData.id_user}`);
      return creado;
    } catch (error) {
      this.logger.error('Error al crear el perfil', error.stack || error);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Ocurrió un error al crear el perfil.');
    }
  }

  /**
   * Obtiene un perfil por ID.
   */
  async getProfile(id: string): Promise<Profile | null> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('El ID del perfil es obligatorio.');
    }

    try {
      const perfil = await this.profileRepository.findById(id);
      if (!perfil) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
      }
      this.logger.log(`Perfil obtenido correctamente: ${id}`);
      return perfil;
    } catch (error) {
      this.logger.error('Error al obtener perfil por ID', error.stack || error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Error al consultar el perfil.');
    }
  }

  /**
   * Obtiene todos los perfiles registrados.
   */
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const perfiles = await this.profileRepository.findAll();
      this.logger.log(`Se encontraron ${perfiles.length} perfiles.`);
      return perfiles;
    } catch (error) {
      this.logger.error('Error al obtener todos los perfiles', error.stack);
      throw new BadRequestException('Ocurrió un error al listar los perfiles.');
    }
  }

  /**
   * Busca un perfil por número de teléfono
   */
  async getProfileByPhone(phone: string): Promise<Profile | null> {
    if (!phone || phone.trim() === '') {
      throw new BadRequestException('El teléfono es obligatorio.');
    }

    let normalized = String(phone).trim();
    if (/^\d{10}$/.test(normalized)) {
      normalized = `+57${normalized}`;
    }

    try {
      const perfil = await this.profileRepository.findByPhone(normalized);
      if (!perfil) {
        throw new NotFoundException(
          `Usuario con teléfono ${normalized} no encontrado.`,
        );
      }
      this.logger.log(`Perfil encontrado para teléfono: ${normalized}`);
      return perfil;
    } catch (error) {
      this.logger.error('Error al obtener perfil por teléfono', error.stack || error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Error al consultar el perfil por teléfono.');
    }
  }

  /**
   * ✅ NUEVO: Busca un perfil por número de documento
   */
  async getProfileByDocumentNumber(documentNumber: string): Promise<Profile | null> {
    if (!documentNumber || documentNumber.trim() === '') {
      throw new BadRequestException('El número de documento es obligatorio.');
    }

    try {
      const perfil = await this.profileRepository.findByDocumentNumber(documentNumber);
      if (!perfil) {
        throw new NotFoundException(
          `Usuario con documento ${documentNumber} no encontrado.`,
        );
      }
      this.logger.log(`Perfil encontrado para documento: ${documentNumber}`);
      return perfil;
    } catch (error) {
      this.logger.error('Error al obtener perfil por documento', error.stack || error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Error al consultar el perfil por documento.');
    }
  }
  /**
   * ✅ NUEVO: Actualiza un perfil existente
   */
  async updateProfile(
    id_user: string,
    updateData: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      address?: string;
    },
  ): Promise<Profile> {
    try {
      // Verificar que el perfil existe
      const existingProfile = await this.profileRepository.findById(id_user);
      if (!existingProfile) {
        throw new NotFoundException(`Perfil con ID ${id_user} no encontrado.`);
      }

      // Validar y normalizar teléfono si se proporciona
      if (updateData.phone) {
        let phone = String(updateData.phone).trim();

        if (/^\d{10}$/.test(phone)) {
          phone = `+57${phone}`;
          this.logger.debug(`Se normalizó el teléfono agregando +57 → ${phone}`);
        }

        const phoneRegex = /^\+57\d{10}$/;
        if (!phoneRegex.test(phone)) {
          throw new BadRequestException(
            'El número de teléfono debe tener el formato +57XXXXXXXXXX o 10 dígitos locales.',
          );
        }

        // Verificar que el teléfono no esté en uso por otro usuario
        if (phone !== existingProfile.phone) {
          const phoneExists = await this.profileRepository.findByPhone(phone);
          if (phoneExists && phoneExists.id_user !== id_user) {
            throw new ConflictException(
              'Este número de teléfono ya está registrado por otro usuario.',
            );
          }
        }

        updateData.phone = phone;
      }

      // Actualizar el perfil
      const updatedProfile = await this.profileRepository.update(id_user, updateData);
      this.logger.log(`Perfil actualizado correctamente para usuario ${id_user}`);
      return updatedProfile;
    } catch (error) {
      this.logger.error('Error al actualizar el perfil', error.stack || error);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Ocurrió un error al actualizar el perfil.');
    }
  }
}