import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './video.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/user.schema';

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
  ): Promise<any> {
    const result = await this.cloudinaryService.uploadMedia(file);
    if (!result) {
      throw new Error('Image Could Not Be Uploaded');
    }

    const createdVideo = await this.videoModel.create({
      link: result.secure_url,
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
}
