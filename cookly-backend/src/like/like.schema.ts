import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  parent_id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  user_id: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
