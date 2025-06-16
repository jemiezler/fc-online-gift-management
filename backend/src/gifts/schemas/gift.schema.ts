import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type GiftDocument = HydratedDocument<Gift>;

@Schema()
export class Gift {
  @Prop({ required: false, ref: "User" })
  wristBandNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: "Question" })
  questionId: Types.ObjectId;

  @Prop({ required: true, default: false })
  isClaimed: boolean;

  // Optional: for better tracking
  @Prop()
  match?: string;

  @Prop()
  round?: number;

  @Prop()
  giftNumber?: string;
}

export const GiftSchema = SchemaFactory.createForClass(Gift);

// ✅ Composite Unique Index: One gift per user per question
GiftSchema.index({ wristBandNumber: 1, questionId: 1 }, { unique: true });
