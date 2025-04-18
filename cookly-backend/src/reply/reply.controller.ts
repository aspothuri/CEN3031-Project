import { Controller } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { BaseEngagementController } from 'src/common/base-engagement.controller';
import { CreateLikeDto } from 'src/like/dtos/create-like.dto';
import { GetLikesDto } from 'src/like/dtos/get-likes.dto';
import { DeleteLikeDto } from 'src/like/dtos/delete-like.dto';

@Controller('reply')
export class ReplyController extends BaseEngagementController<
  CreateReplyDto,
  UpdateReplyDto,
  CreateLikeDto,
  DeleteLikeDto,
  GetLikesDto,
  ReplyService
> {
  constructor(protected readonly replyService: ReplyService) {
    super(replyService);
  }
}
