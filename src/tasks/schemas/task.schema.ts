import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
