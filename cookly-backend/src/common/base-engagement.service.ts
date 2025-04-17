import { Logger } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { LikeService } from 'src/like/like.service';

export abstract class BaseEngagementService<T> {
  protected constructor(
    protected readonly model: Model<T>,
    protected readonly likeService: LikeService,
  ) {}

  async create(createDto: any) {
    return await this.model.create(createDto);
  }

  async findOne(id: string): Promise<any> {
    return await this.model.findById(id);
  }

  async findAll(parentId: string) {
    const objectId = new Types.ObjectId(parentId);
    let filter: FilterQuery<T>;

    if (this.model.modelName === 'Comment') {
      filter = { video: objectId };
    } else if (this.model.modelName === 'Reply') {
      filter = { comment: objectId };
    } else {
      throw new Error('Invalid Model Error');
    }
    return await this.model.find({});
  }

  async update(id: string, updateDto: any) {
    return await this.model.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}
