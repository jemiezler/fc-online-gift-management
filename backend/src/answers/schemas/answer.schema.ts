import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop({ required: true, ref: 'User' })
  wristBandNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Question' })
  questionId: Types.ObjectId;

  @Prop({ required: true })
  answer: string;

  @Prop({ required: true, default: false })
  isCorrect: boolean;

  @Prop({ required: false })
  giftNumber?: number;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

// 1 answer per wristBandNumber per question
AnswerSchema.index({ wristBandNumber: 1, questionId: 1 }, { unique: true });
