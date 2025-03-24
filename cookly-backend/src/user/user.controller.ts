import { LoginDto } from './dtos/login.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.schema';
import { Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
  @Delete(':username')
  deleteUser(@Param('username') username: string): Promise<{ message: string }> {
  return this.userService.deleteUser(username);
}


  @Post('login')
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

  @Get(':query')
  searchUsers(@Param('query') query: string): Promise<string[]> {
    return this.userService.searchUsers(query);
  }

  @Post('profile/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('username') username: string,
  ) {
    if (!file) {
      return { message: 'File is required' };
    }
    if (!username) {
      return { message: 'Username is required' };
    }

    return this.userService.uploadImageFile(file, username);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
