import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './video.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/user.schema';
import { SearchVideoEntity } from './entities/searchVideo.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
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
}
