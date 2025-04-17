import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema()
export class Video {
  @Prop({ required: true, unique: true })
  link: string;

  @Prop({ default: 0, required: true })
  likes: number;

  @Prop({ default: 0, required: true })
  views: number;

  @Prop({ default: '', required: true })
  description: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
