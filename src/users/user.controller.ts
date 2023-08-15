import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeStatusDto } from './dto/changeStatus.dto';
import { ChangeAdminPermissionsDto } from './dto/changeAdminPermissions.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async createUser(@Body(new ValidationPipe()) userData: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | undefined> {
    return this.userService.findUserById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const objectId = new ObjectId(id);
    await this.userService.deleteUserById(objectId);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    try {
      return this.userService.updateOne(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) changeStatusDto: ChangeStatusDto
  ) {
    return this.userService.changeStatus(id, changeStatusDto.status);
  }

  @Patch(':id/admin-permissions')
  async changeAdminPermissions(
    @Param('id') id: string,
    @Body(new ValidationPipe()) changeAdminPermissionsDto: ChangeAdminPermissionsDto
  ) {
    return this.userService.changeAdminPermissions(id, changeAdminPermissionsDto.permissions);
  }
}
