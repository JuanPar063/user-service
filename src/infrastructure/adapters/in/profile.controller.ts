import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  Query,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ProfileService } from '../../../application/services/profile.service';
import { CreateProfileDto } from '../../dto/create-profile.dto';
import { ProfileResponseDto } from '../../dto/profile-response.dto';
import { CreateProfilePort } from '../../../domain/ports/in/create-profile.port';
import { GetProfilePort } from '../../../domain/ports/in/get-profile.port';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  /**
   * Valida si un número de teléfono ya está registrado.
   */
  @Get('validate/phone/:phone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar si un teléfono ya está registrado' })
  @ApiParam({ name: 'phone', type: String, example: '+573001112233' })
  @ApiOkResponse({
    description: 'Resultado de validación',
    schema: {
      type: 'object',
      properties: {
        available: { type: 'boolean', example: true },
        message: { type: 'string', example: 'El teléfono está disponible' },
      },
    },
  })
  async validatePhone(
    @Param('phone') phone: string,
  ): Promise<{ available: boolean; message: string }> {
    try {
      if (!phone || phone.trim() === '') {
        throw new BadRequestException('Debe proporcionar un número de teléfono.');
      }

      const existingProfile = await this.profileService.getProfileByPhone(phone);
      if (existingProfile) {
        this.logger.warn(`Teléfono duplicado detectado: ${phone}`);
        return {
          available: false,
          message: 'Este número de teléfono ya está registrado',
        };
      }

      return {
        available: true,
        message: 'El teléfono está disponible',
      };
    } catch (error) {
      this.logger.debug(`Teléfono disponible: ${phone}`);
      return {
        available: true,
        message: 'El teléfono está disponible',
      };
    }
  }

  /**
   * Crea un nuevo perfil de usuario.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo perfil de usuario' })
  @ApiCreatedResponse({
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario registrado exitosamente' },
        data: { type: 'object' },
      },
    },
  })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<{ message: string; data: ProfileResponseDto }> {
    this.logger.log(`Solicitud de creación de perfil: ${createProfileDto.phone}`);
    const profile = await (this.profileService as CreateProfilePort).createProfile(createProfileDto);
    this.logger.log(`Perfil creado para usuario ${profile.id_user}`);
    return {
      message: 'Usuario registrado exitosamente',
      data: new ProfileResponseDto(profile),
    };
  }

  /**
   * Obtiene todos los perfiles registrados (paginación opcional).
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles (con paginación opcional)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({
    description: 'Usuarios obtenidos exitosamente',
    schema: { type: 'object' },
  })
  async getAllProfiles(
    @Query('page') _page?: string,
    @Query('limit') _limit?: string,
  ): Promise<{ message: string; data: ProfileResponseDto[] }> {
    const profiles = await (this.profileService as GetProfilePort).getAllProfiles();
    this.logger.log(`Se listaron ${profiles.length} perfiles`);
    return {
      message: 'Usuarios obtenidos exitosamente',
      data: profiles.map((p) => new ProfileResponseDto(p)),
    };
  }

  /**
   * Obtiene un perfil por su ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perfil por ID' })
  @ApiParam({ name: 'id', type: String, example: 'a1b2c3' })
  @ApiOkResponse({
    description: 'Usuario obtenido exitosamente',
    schema: { type: 'object' },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: ProfileResponseDto }> {
    this.logger.debug(`Buscando perfil con ID: ${id}`);
    const profile = await (this.profileService as GetProfilePort).getProfile(id);
    return {
      message: 'Usuario obtenido exitosamente',
      data: new ProfileResponseDto(profile),
    };
  }

  /**
   * Obtiene un perfil por número de teléfono.
   */
  @Get('phone/:phone')
  @ApiOperation({ summary: 'Obtener un perfil por número de teléfono' })
  @ApiParam({ name: 'phone', type: String, example: '+573001112233' })
  @ApiOkResponse({
    description: 'Usuario obtenido exitosamente',
    schema: { type: 'object' },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserByPhone(
    @Param('phone') phone: string,
  ): Promise<{ message: string; data: ProfileResponseDto }> {
    this.logger.debug(`Buscando perfil por teléfono: ${phone}`);
    const user = await (this.profileService as GetProfilePort).getProfileByPhone(phone);
    return {
      message: 'Usuario obtenido exitosamente',
      data: new ProfileResponseDto(user),
    };
  }
}
