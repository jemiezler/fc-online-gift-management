import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gift, GiftSchema } from './schemas/gift.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { Answer, AnswerSchema } from 'src/answers/schemas/answer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gift.name, schema: GiftSchema },
      { name: Question.name, schema: QuestionSchema},
      { name: Answer.name, schema: AnswerSchema}
    ]), 
  ],
  controllers: [GiftsController],
  providers: [GiftsService],
})
export class GiftsModule {}
