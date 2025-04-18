import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from './like.schema';
import { CreateLikeDto } from './dtos/create-like.dto';
import { DeleteLikeDto } from './dtos/delete-like.dto';
import { ClearLikeDto } from './dtos/clear-like.dto';
import { GetLikesDto } from './dtos/get-likes.dto';

@Injectable()
export class LikeService {
  constructor(@InjectModel(Like.name) private likeModel: Model<Like>) {}

  async createLike(createLikeDto: CreateLikeDto) {
    return await this.likeModel.findOneAndUpdate(
      createLikeDto,
      {
        $setOnInsert: createLikeDto,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async deleteLike(deleteLikeDto: DeleteLikeDto) {
    return await this.likeModel.deleteOne(deleteLikeDto);
  }

  async clearLikes(clearLikeDto: ClearLikeDto) {
    return await this.likeModel.deleteMany(clearLikeDto);
  }

  async getLikes(getLikesDto: GetLikesDto) {
    return await this.likeModel.countDocuments(getLikesDto);
  }
}
