import { Injectable } from '@nestjs/common';
import { BaseEngagementService } from 'src/common/base-engagement.service';
import { Comment } from './comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeService } from 'src/like/like.service';

@Injectable()
export class CommentService extends BaseEngagementService<Comment> {
  constructor(
    @InjectModel(Comment.name) commentModel: Model<Comment>,
    protected likeService: LikeService,
  ) {
    super(commentModel, likeService);
  }
}
