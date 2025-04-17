import { Controller } from '@nestjs/common';
import { BaseEngagementController } from 'src/common/base-engagement.controller';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController extends BaseEngagementController<
  CreateCommentDto,
  UpdateCommentDto,
  CommentService
> {
  constructor(protected readonly commentService: CommentService) {
    super(commentService);
  }
}
