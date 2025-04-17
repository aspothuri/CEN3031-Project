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
import { CreateUserDto } from './dtos/createUser.dto';
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
  deleteUser(
    @Param('username') username: string,
  ): Promise<{ message: string }> {
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
  uploadImageFile(
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

  @Get('/:username/videos')
  getPersonalVideos(@Param('username') username: string): Promise<string[]> {
    return this.userService.getPersonalVideos(username);
  }

  @Get('/:username/likedVideos')
  getLikedVideos(@Param('username') username: string): Promise<string[]> {
    return this.userService.getLikedVideos(username);
  }

  @Delete('/:username/:videoId')
  deleteVideoFile(
    @Param('videoId') videoId: string,
    @Param('username') username: string,
  ): Promise<{ message: string }> {
    return this.userService.deleteVideoFile(videoId, username);
  }

  @Patch('/:username/:videoId/like')
  likeVideo(
    @Param('videoId') videoId: string,
    @Param('username') username: string,
  ): Promise<any> {
    return this.userService.likeVideo(videoId, username);
  }

  @Patch('/:username/:videoId/unlike')
  unlikeVideo(
    @Param('videoId') videoId: string,
    @Param('username') username: string,
  ): Promise<any> {
    return this.userService.unlikeVideo(videoId, username);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
