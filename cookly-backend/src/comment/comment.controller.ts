import { Controller } from '@nestjs/common';
import { BaseEngagementController } from 'src/common/base-engagement.controller';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { CreateLikeDto } from 'src/like/dtos/create-like.dto';
import { GetLikesDto } from 'src/like/dtos/get-likes.dto';
import { DeleteLikeDto } from 'src/like/dtos/delete-like.dto';

@Controller('comment')
export class CommentController extends BaseEngagementController<
  CreateCommentDto,
  UpdateCommentDto,
  CreateLikeDto,
  DeleteLikeDto,
  GetLikesDto,
  CommentService
> {
  constructor(protected readonly commentService: CommentService) {
    super(commentService);
  }
}
