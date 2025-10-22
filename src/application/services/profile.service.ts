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
   * Crea un nuevo perfil con validaciones básicas y formato colombiano de teléfono (+57).
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
        // @ts-ignore
        const valor = profileData[campo];
        if (!valor || String(valor).trim() === '') {
          this.logger.warn(`Campo obligatorio faltante: ${campo}`);
          throw new BadRequestException(`El campo '${campo}' es obligatorio.`);
        }
      }

      // Normalizar el teléfono
      let phone = String(profileData.phone).trim();

      // Si no incluye el prefijo +57 y tiene 10 dígitos, se lo agrega
      if (/^\d{10}$/.test(phone)) {
        phone = `+57${phone}`;
        this.logger.debug(`Se normalizó el teléfono agregando +57 → ${phone}`);
      }

      // Validar formato colombiano (+57 seguido de 10 dígitos)
      const phoneRegex = /^\+57\d{10}$/;
      if (!phoneRegex.test(phone)) {
        this.logger.warn(`Formato de teléfono inválido: ${profileData.phone}`);
        throw new BadRequestException(
          'El número de teléfono debe tener el formato +57XXXXXXXXXX o 10 dígitos locales.',
        );
      }

      // Actualizar el valor normalizado en el DTO
      profileData.phone = phone;

      // Verificar si ya existe un perfil con ese número
      const existente = await this.profileRepository.findByPhone(profileData.phone);
      if (existente) {
        this.logger.warn(`Intento de crear perfil duplicado: ${profileData.phone}`);
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
   * Busca un perfil por número de teléfono (soporta formato con o sin +57).
   */
  async getProfileByPhone(phone: string): Promise<Profile | null> {
    if (!phone || phone.trim() === '') {
      throw new BadRequestException('El teléfono es obligatorio.');
    }

    let normalized = String(phone).trim();
    // Normalizar para búsquedas
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
}
