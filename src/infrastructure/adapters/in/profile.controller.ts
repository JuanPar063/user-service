import { 
  Controller, Post, Body, Get, Param, HttpStatus, HttpCode 
} from '@nestjs/common';
import { ProfileService } from '../../../application/services/profile.service';
import { CreateProfileDto } from '../../dto/create-profile.dto';
import { ProfileResponseDto } from '../../dto/profile-response.dto';
import { CreateProfilePort } from '../../../domain/ports/in/create-profile.port';
import { GetProfilePort } from '../../../domain/ports/in/get-profile.port';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiCreatedResponse 
} from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo perfil de usuario' })
  @ApiCreatedResponse({
    description: 'Usuario registrado exitosamente',
    type: ProfileResponseDto,
  })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<{
    message: string;
    data: ProfileResponseDto;
  }> {
    const profile = await (this.profileService as CreateProfilePort).createProfile(createProfileDto);
    
    return {
      message: 'Usuario registrado exitosamente',
      data: new ProfileResponseDto(profile),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios obtenidos exitosamente',
    type: [ProfileResponseDto],
  })
  async getAllProfiles(): Promise<{
    message: string;
    data: ProfileResponseDto[];
  }> {
    const profiles = await (this.profileService as GetProfilePort).getAllProfiles();
    
    return {
      message: 'Usuarios obtenidos exitosamente',
      data: profiles.map(profile => new ProfileResponseDto(profile)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perfil por ID' })
  @ApiParam({ name: 'id', type: String, example: 'a1b2c3' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido exitosamente',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserById(
    @Param('id') id: string,
  ): Promise<{
    message: string;
    data: ProfileResponseDto;
  }> {
    const profile = await (this.profileService as GetProfilePort).getProfile(id);
    
    return {
      message: 'Usuario obtenido exitosamente',
      data: new ProfileResponseDto(profile),
    };
  }

  @Get('phone/:phone')
  @ApiOperation({ summary: 'Obtener un perfil por número de teléfono' })
  @ApiParam({ name: 'phone', type: String, example: '+573001112233' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido exitosamente',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserByPhone(
    @Param('phone') phone: string,
  ): Promise<{
    message: string;
    data: ProfileResponseDto;
  }> {
    const user = await (this.profileService as GetProfilePort).getProfileByPhone(phone);
    
    return {
      message: 'Usuario obtenido exitosamente',
      data: new ProfileResponseDto(user),
    };
  }
}
