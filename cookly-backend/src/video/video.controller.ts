import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
    @Body('description') description: string,
  ): Promise<any> | { message: string } {
    if (!file) {
      return { message: 'File is required' };
    }
    if (!username) {
      return { message: 'Username is required' };
    }

    return this.videoService.uploadVideoFile(file, username, description);
  }

  @Get('search/:query')
  searchVideos(@Param('query') query: string): Promise<any> {
    return this.videoService.searchVideos(query);
  }

  @Patch(':id/view')
  viewVideo(@Param('id') id: string): Promise<any> {
    return this.videoService.viewVideo(id);
  }
}
