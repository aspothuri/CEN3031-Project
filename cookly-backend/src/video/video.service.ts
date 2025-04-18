import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './video.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/user.schema';
import { SearchVideoEntity } from './entities/searchVideo.entity';
import { Reply } from 'src/reply/reply.schema';
import { Like } from 'src/like/like.schema';
import { Comment } from 'src/comment/comment.schema';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadVideoFile(
    file: Express.Multer.File,
    username: string,
    description: string,
  ): Promise<any> {
    if (description.length > 4000) {
      throw new Error('Video Description Way Too Long');
    }

    const result = await this.cloudinaryService.uploadMedia(file);
    if (!result) {
      throw new Error('Image Could Not Be Uploaded');
    }

    const createdVideo = await this.videoModel.create({
      link: result.secure_url,
      description: description,
    });
    const videoId = createdVideo._id.toString();

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { username: username },
        { $push: { personalVideoIds: videoId } },
        { new: true },
      )
      .exec();

    return updatedUser;
  }

  async searchVideos(query: string) {
    const result = await this.videoModel
      .find({
        description: { $regex: query, $options: 'i' },
      })
      .exec();

    if (!result) {
      throw new Error('Video Search Could Not Be Completed');
    }

    return result.map(
      (video) =>
        new SearchVideoEntity({
          link: video.link,
          likes: video.likes,
          description: video.description,
          views: video.views,
        }),
    );
  }

  async viewVideo(id: string) {
    const result = await this.videoModel
      .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .exec();

    if (!result) {
      throw new Error('Could Not Find Video To View');
    }

    return { views: result.views };
  }

  async getMainFeed() {
    return await this.videoModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'video',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
        },
      },
      {
        $addFields: {
          score: { $add: ['$likes', '$commentCount', '$views'] },
        },
      },
      { $sort: { score: -1 } },
      { $project: { likes: 0, comments: 0, views: 0 } },
    ]);
  }
}
