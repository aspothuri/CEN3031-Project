import { LoginDto } from './dtos/login.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get('login')
  login(@Body() loginDto: LoginDto): Promise<any> {
    return this.userService.login(loginDto);
  }

  @Get('profile/:username')
  getProfile(@Param('username') username: string): Promise<any> {
    return this.userService.getProfile(username);
  }

  @Patch('profile/:username/:targetUsername')
  followUser(
    @Param('username') username: string,
    @Param('targetUsername') targetUsername: string,
  ): Promise<any> {
    return this.userService.followUser(username, targetUsername);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
