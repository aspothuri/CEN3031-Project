import { Controller } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { BaseEngagementController } from 'src/common/base-engagement.controller';

@Controller('reply')
export class ReplyController extends BaseEngagementController<
  CreateReplyDto,
  UpdateReplyDto,
  ReplyService
> {
  constructor(protected readonly replyService: ReplyService) {
    super(replyService);
  }
}
