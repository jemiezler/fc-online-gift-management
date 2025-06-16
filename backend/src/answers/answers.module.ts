import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './schemas/answer.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { Gift, GiftSchema } from 'src/gifts/schemas/gift.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Answer.name, schema: AnswerSchema },
      { name: Gift.name, schema: GiftSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: User.name, schema: UserSchema },])
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule { }
