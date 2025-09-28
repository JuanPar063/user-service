import { Controller, Post, Body, Get, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { ProfileService } from '../../../application/services/profile.service';
import { CreateProfileDto } from '../../dto/create-profile.dto';
import { ProfileResponseDto } from '../../dto/profile-response.dto';
import { CreateProfilePort } from '../../../domain/ports/in/create-profile.port';
import { GetProfilePort } from '../../../domain/ports/in/get-profile.port';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProfile(@Body() createProfileDto: CreateProfileDto): Promise<{
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
  async getUserById(@Param('id') id: string): Promise<{
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
  async getUserByPhone(@Param('phone') phone: string): Promise<{
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