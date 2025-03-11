import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate('followers', 'username')
      .populate('following', 'username')
      .exec();
  }
}
