import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideoFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('username') username: string,
  ) {
    if (!file) {
      return { message: 'File is required' };
    }
    if (!username) {
      return { message: 'Username is required' };
    }

    return this.videoService.uploadVideoFile(file, username);
  }
}
