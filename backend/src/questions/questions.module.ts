import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import { Answer, AnswerSchema } from 'src/answers/schemas/answer.schema';
import { Gift, GiftSchema } from 'src/gifts/schemas/gift.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema
      },
      {
        name: Answer.name,
        schema: AnswerSchema
      },
      {
        name: Gift.name,
        schema: GiftSchema
      }
    ])
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule { }
