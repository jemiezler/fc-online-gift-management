import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
    @Prop({ required: true })
    match: string;

    @Prop({ required: true })
    round: string;

    @Prop({ default: "" })
    winner: string;

    @Prop({ required: false })
    giftCorrect?: number;

    @Prop({ required: false })
    giftWrong?: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
