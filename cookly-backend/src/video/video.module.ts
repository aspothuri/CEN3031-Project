import { Video, VideoSchema } from './video.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User, UserSchema } from 'src/user/user.schema';
import { Reply, ReplySchema } from 'src/reply/reply.schema';
import { Comment, CommentSchema } from 'src/comment/comment.schema';
import { Like, LikeSchema } from 'src/like/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  controllers: [VideoController],
  providers: [VideoService, CloudinaryService],
})
export class VideoModule {}
