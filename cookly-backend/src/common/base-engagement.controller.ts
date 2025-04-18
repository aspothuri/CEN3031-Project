import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateLikeDto } from 'src/like/dtos/create-like.dto';

export abstract class BaseEngagementController<
  TCreateDto,
  TUpdateDto,
  TCreateLikeDto,
  TDeleteLikeDto,
  TGetLikesDto,
  TService extends {
    create(dto: TCreateDto): Promise<any>;
    findOne(id: string): Promise<any>;
    findAll(parentId: string): Promise<any>;
    update(id: string, dto: TUpdateDto): Promise<any>;
    remove(id: string): Promise<any>;
    getLikes(dto: TGetLikesDto): Promise<any>;
    addLike(dto: TCreateLikeDto): Promise<any>;
    removeLike(dto: TDeleteLikeDto): Promise<any>;
  },
> {
  constructor(protected readonly service: TService) {}

  @Post()
  create(@Body() createDto: TCreateDto) {
    return this.service.create(createDto);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.service.findOne(id);
  }

  /** Endpoint to find every like attached to the parent Id.
   *  The parent Id can be either the id of a Comment or Reply */
  @Get('/all')
  findAll(@Query('parentId') parentId: string) {
    return this.service.findAll(parentId);
  }

  @Patch()
  update(@Query('id') id: string, @Body() updateCommentDto: TUpdateDto) {
    return this.service.update(id, updateCommentDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.service.remove(id);
  }

  @Get('likes')
  getLikes(@Body() getLikesDto: TGetLikesDto) {
    return this.service.getLikes(getLikesDto);
  }

  @Post('like')
  addLike(@Body() createLikeDto: TCreateLikeDto) {
    return this.service.addLike(createLikeDto);
  }

  @Delete('like')
  removeLike(@Body() deleteLikeDto: TDeleteLikeDto) {
    return this.service.removeLike(deleteLikeDto);
  }
}
