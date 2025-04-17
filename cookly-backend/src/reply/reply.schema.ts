import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ReplyDocument = HydratedDocument<Reply>;

@Schema()
export class Reply {
  @Prop({ required: true })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment', required: true })
  comment: string;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);

ReplySchema.index({ comment: 1 });
