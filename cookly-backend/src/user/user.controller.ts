import { UserService } from './user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
