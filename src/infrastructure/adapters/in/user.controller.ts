import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from '../../../application/services/user.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CreateUserPort } from '../../../domain/ports/in/create-user.port';
import { GetUserPort } from '../../../domain/ports/in/get-user.port';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<any> {
    const user = await (this.userService as CreateUserPort).createUser(dto);
    return user;
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<any> {
    const user = await (this.userService as GetUserPort).getUser(id);
    return user;
  }
}