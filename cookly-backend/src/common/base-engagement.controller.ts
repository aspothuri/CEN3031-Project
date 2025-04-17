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

export abstract class BaseEngagementController<
  TCreateDto,
  TUpdateDto,
  TService extends {
    create(dto: TCreateDto): Promise<any>;
    findOne(id: string): Promise<any>;
    findAll(parentId: string): Promise<any>;
    update(id: string, dto: TUpdateDto): Promise<any>;
    remove(id: string): Promise<any>;
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: TUpdateDto) {
    return this.service.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
