import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseEngagementService } from 'src/common/base-engagement.service';
import { LikeService } from 'src/like/like.service';
import { Reply } from './reply.schema';

@Injectable()
export class ReplyService extends BaseEngagementService<Reply> {
  constructor(
    @InjectModel(Reply.name) replyModel: Model<Reply>,
    protected likeService: LikeService,
  ) {
    super(replyModel, likeService);
  }
}
