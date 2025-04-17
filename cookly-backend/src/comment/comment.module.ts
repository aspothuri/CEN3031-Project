import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { Video, VideoSchema } from 'src/video/video.schema';
import { Comment, CommentSchema } from './comment.schema';
import { Like, LikeSchema } from 'src/like/like.schema';
import { LikeService } from 'src/like/like.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  controllers: [CommentController],
  providers: [CommentService, LikeService],
})
export class CommentModule {}
