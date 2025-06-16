import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true, type: Object })
    name: {
        first: string;
        middle?: string;
        last?: string;
    }

    @Prop({ required: true, unique: true })
    wristBandNumber: string;

    @Prop({ required: true, index: true })
    seatNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);