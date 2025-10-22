import { 
  Controller, Post, Body, Get, Param, HttpStatus, HttpCode, Query 
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
  ApiResponse
} from '@nestjs/swagger';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ✅ NUEVO: Endpoint para validar teléfono antes de registrar
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
        message: { type: 'string', example: 'El teléfono está disponible' }
      }
    }
  })
  async validatePhone(
    @Param('phone') phone: string,
  ): Promise<{ available: boolean; message: string }> {
    try {
      const existingProfile = await this.profileService.getProfileByPhone(phone);
      
      if (existingProfile) {
        return {
          available: false,
          message: 'Este número de teléfono ya está registrado'
        };
      }
      
      return {
        available: true,
        message: 'El teléfono está disponible'
      };
    } catch (error) {
      // Si no se encuentra, significa que está disponible
      return {
        available: true,
        message: 'El teléfono está disponible'
      };
    }
  }

  // POST /profiles
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo perfil de usuario' })
  @ApiCreatedResponse({
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario registrado exitosamente' },
        data: {
          type: 'object',
          properties: {
            id_profile: { type: 'string', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
            id_user:    { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            first_name: { type: 'string', example: 'Juan' },
            last_name:  { type: 'string', example: 'Pérez' },
            document_type:   { type: 'string', example: 'CC' },
            document_number: { type: 'string', example: '1020304050' },
            phone:      { type: 'string', example: '+573001112233' },
            address:    { type: 'string', example: 'Calle 123 #45-67, Bogotá' },
          }
        }
      }
    }
  })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<{ message: string; data: ProfileResponseDto }> {
    const profile = await (this.profileService as CreateProfilePort).createProfile(createProfileDto);
    return {
      message: 'Usuario registrado exitosamente',
      data: new ProfileResponseDto(profile),
    };
  }

  // GET /profiles?page=&limit=
  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles (con paginación opcional)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Página (opcional)' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Tamaño de página (opcional)' })
  @ApiOkResponse({
    description: 'Usuarios obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuarios obtenidos exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id_profile: { type: 'string', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
              id_user:    { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
              first_name: { type: 'string', example: 'Juan' },
              last_name:  { type: 'string', example: 'Pérez' },
              document_type:   { type: 'string', example: 'CC' },
              document_number: { type: 'string', example: '1020304050' },
              phone:      { type: 'string', example: '+573001112233' },
              address:    { type: 'string', example: 'Calle 123 #45-67, Bogotá' },
            }
          }
        }
      }
    }
  })
  async getAllProfiles(
    @Query('page') _page?: string,
    @Query('limit') _limit?: string,
  ): Promise<{ message: string; data: ProfileResponseDto[] }> {
    const profiles = await (this.profileService as GetProfilePort).getAllProfiles();
    return {
      message: 'Usuarios obtenidos exitosamente',
      data: profiles.map(p => new ProfileResponseDto(p)),
    };
  }

  // GET /profiles/:id
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perfil por ID' })
  @ApiParam({ name: 'id', type: String, example: 'a1b2c3' })
  @ApiOkResponse({
    description: 'Usuario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario obtenido exitosamente' },
        data: {
          type: 'object',
          properties: {
            id_profile: { type: 'string', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
            id_user:    { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            first_name: { type: 'string', example: 'Juan' },
            last_name:  { type: 'string', example: 'Pérez' },
            document_type:   { type: 'string', example: 'CC' },
            document_number: { type: 'string', example: '1020304050' },
            phone:      { type: 'string', example: '+573001112233' },
            address:    { type: 'string', example: 'Calle 123 #45-67, Bogotá' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: ProfileResponseDto }> {
    const profile = await (this.profileService as GetProfilePort).getProfile(id);
    return {
      message: 'Usuario obtenido exitosamente',
      data: new ProfileResponseDto(profile),
    };
  }

  // GET /profiles/phone/:phone
  @Get('phone/:phone')
  @ApiOperation({ summary: 'Obtener un perfil por número de teléfono' })
  @ApiParam({ name: 'phone', type: String, example: '+573001112233' })
  @ApiOkResponse({
    description: 'Usuario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario obtenido exitosamente' },
        data: {
          type: 'object',
          properties: {
            id_profile: { type: 'string', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
            id_user:    { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            first_name: { type: 'string', example: 'Juan' },
            last_name:  { type: 'string', example: 'Pérez' },
            document_type:   { type: 'string', example: 'CC' },
            document_number: { type: 'string', example: '1020304050' },
            phone:      { type: 'string', example: '+573001112233' },
            address:    { type: 'string', example: 'Calle 123 #45-67, Bogotá' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserByPhone(
    @Param('phone') phone: string,
  ): Promise<{ message: string; data: ProfileResponseDto }> {
    const user = await (this.profileService as GetProfilePort).getProfileByPhone(phone);
    return {
      message: 'Usuario obtenido exitosamente',
      data: new ProfileResponseDto(user),
    };
  }
}