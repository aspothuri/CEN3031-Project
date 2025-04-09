import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema()
export class Video {
  @Prop({ required: true, unique: true })
  link: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: '' })
  description: string;

  @Prop({
    type: [
      {
        user: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: { type: String, required: true },
        likes: { type: Number, default: 0 },
        replies: [
          {
            user: {
              type: MongooseSchema.Types.ObjectId,
              ref: 'User',
              required: true,
            },
            text: { type: String, required: true },
            likes: { type: Number, default: 0 },
          },
        ],
      },
    ],
    default: [],
  })
  comments: Array<{
    user: Types.ObjectId;
    text: string;
    likes: number;
    replies: Array<{
      user: Types.ObjectId;
      text: string;
      likes: number;
    }>;
  }>;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
