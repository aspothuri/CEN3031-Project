import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Video } from 'src/video/video.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists.');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user;
      }
      throw new UnauthorizedException('Password Incorrect');
    }
    throw new NotFoundException('User Not Found');
  }

  async getProfile(username: string): Promise<any> {
    const user = await this.userModel
      .findOne({ username })
      .populate('followers', 'username')
      .populate('following', 'username')
      .exec();
    if (user) {
      return user;
    }
    throw new NotFoundException('User Not Found');
  }

  async followUser(username: string, targetUsername: string): Promise<any> {
    if (username === targetUsername) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const follower = await this.userModel
      .findOne({
        username: username,
      })
      .exec();
    const following = await this.userModel
      .findOne({
        username: targetUsername,
      })
      .exec();

    console.log(following);
    console.log(follower);

    if (!follower || !following) {
      throw new NotFoundException('One or both users not found.');
    }

    const followerId = follower._id.toString();
    const followingId = following._id.toString();
    const isFollowing = follower.following.includes(followingId);

    if (isFollowing) {
      await this.userModel
        .updateOne(
          {
            _id: followerId,
          },
          { $pull: { following: followingId } },
        )
        .exec();

      await this.userModel
        .updateOne(
          {
            _id: followingId,
          },
          { $pull: { followers: followerId } },
        )
        .exec();

      return { message: `${username} has unfollowed ${targetUsername}` };
    } else {
      await this.userModel
        .updateOne(
          {
            _id: followerId,
          },
          { $addToSet: { following: followingId } },
        )
        .exec();

      await this.userModel
        .updateOne(
          {
            _id: followingId,
          },
          { $addToSet: { followers: followerId } },
        )
        .exec();

      return { message: `${username} is now following ${targetUsername}` };
    }
  }

  async searchUsers(query: string): Promise<string[]> {
    const users = await this.userModel
      .find({ username: { $regex: query, $options: 'i' } })
      .select('username')
      .exec();
    return users.map((user) => user.username);
  }

  async uploadImageFile(
    file: Express.Multer.File,
    username: string,
  ): Promise<any> {
    const result = await this.cloudinaryService.uploadMedia(file);
    if (!result) {
      throw new Error('Image Could Not Be Uploaded');
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { username: username },
        { image: result.secure_url },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User Not Found');
    }

    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate('followers', 'username')
      .populate('following', 'username')
      .exec();
  }

  async deleteUser(username: string): Promise<{ message: string }> {
    const deleted = await this.userModel.findOneAndDelete({ username }).exec();

    if (!deleted) {
      throw new NotFoundException(`User "${username}" not found.`);
    }

    return { message: `User "${username}" has been deleted.` };
  }

  async getPersonalVideos(username: string): Promise<string[]> {
    const user = await this.userModel
      .findOne({ username: username })
      .populate('personalVideoIds', 'link views likes description')
      .exec();

    if (!user) {
      throw new NotFoundException(`${username} not found`);
    }

    return user.personalVideoIds;
  }

  async getLikedVideos(username: string): Promise<string[]> {
    const user = await this.userModel
      .findOne({ username: username })
      .populate('likedVideoIds', 'link views likes description')
      .exec();

    if (!user) {
      throw new NotFoundException(`${username} not found`);
    }

    return user.likedVideoIds;
  }

  async deleteVideoFile(
    videoId: string,
    username: string,
  ): Promise<{ message: string }> {
    const userDeleted = await this.userModel
      .findOneAndUpdate(
        { username: username },
        { $pull: { personalVideoIds: videoId } },
      )
      .exec();

    if (!userDeleted) {
      throw new NotFoundException(`User "${username}" not found.`);
    }

    const videoDeleted = await this.videoModel
      .findByIdAndDelete({
        _id: videoId,
      })
      .exec();

    if (!videoDeleted) {
      throw new NotFoundException(`Video Id not found.`);
    }

    const cloudinaryDelete = await this.cloudinaryService.deleteMedia(
      videoDeleted.link,
      'video',
    );

    if (!cloudinaryDelete) {
      throw new NotFoundException(`Video not found in cloudinary.`);
    }

    return { message: `${username}'s video has been deleted.` };
  }

  async likeVideo(videoId: string, username: string): Promise<any> {
    const userLike = await this.userModel
      .updateOne(
        {
          username: username,
        },
        { $addToSet: { likedVideoIds: videoId } },
      )
      .exec();

    if (!userLike) {
      throw new Error('Could Not Add Like To User');
    }

    if (userLike.modifiedCount == 0) {
      const videoLike = await this.videoModel.findById(videoId);

      if (!videoLike) {
        throw new Error('Could Not Find Video');
      }
      return { likes: videoLike.likes };
    }

    const videoLike = await this.videoModel
      .findByIdAndUpdate(videoId, { $inc: { likes: 1 } }, { new: true })
      .exec();

    if (!videoLike) {
      this.userModel
        .findOneAndUpdate(
          {
            username: username,
          },
          { $pull: { likedVideoIds: videoId } },
        )
        .exec();
      throw new Error('Could Not Add Like To Video');
    }

    return { likes: videoLike.likes };
  }

  async unlikeVideo(videoId: string, username: string): Promise<any> {
    const userLike = await this.userModel
      .updateOne(
        {
          username: username,
        },
        { $pull: { likedVideoIds: videoId } },
      )
      .exec();

    if (!userLike) {
      throw new Error('Could Not Unlike User');
    }

    if (userLike.modifiedCount == 0) {
      const videoLike = await this.videoModel.findById(videoId);

      if (!videoLike) {
        throw new Error('Could Not Find Video');
      }
      return { likes: videoLike.likes };
    }

    const videoLike = await this.videoModel
      .findByIdAndUpdate(videoId, { $inc: { likes: -1 } }, { new: true })
      .exec();

    if (!videoLike) {
      this.userModel
        .findOneAndUpdate(
          {
            username: username,
          },
          { $addToSet: { likedVideoIds: videoId } },
        )
        .exec();
      throw new Error('Could Not Unlike Video');
    }

    return { likes: videoLike.likes };
  }
}
