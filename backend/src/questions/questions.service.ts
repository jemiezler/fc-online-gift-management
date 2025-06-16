import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AnswerDocument } from 'src/answers/schemas/answer.schema';
import { GiftDocument } from 'src/gifts/schemas/gift.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<QuestionDocument>,
    @InjectModel('Answer') private readonly answerModel: Model<AnswerDocument>,
    @InjectModel('Gift') private readonly giftModel: Model<GiftDocument>,
  ) { }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().sort({ match: 1, round: 1 }).lean();
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const updated = await this.questionModel.findByIdAndUpdate(id, updateQuestionDto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException(`Question with id "${id}" not found`);
    }

    // --- Recheck answers if winner was changed ---
    if (updateQuestionDto.winner) {
      const correct = updateQuestionDto.winner.trim().toLowerCase();

      const answers = await this.answerModel.find({ questionId: id });

      for (const answer of answers) {
        const isCorrect = answer.answer.trim().toLowerCase() === correct;

        // Update isCorrect if changed
        if (answer.isCorrect !== isCorrect) {
          answer.isCorrect = isCorrect;
          await answer.save();
        }

        // Insert or update gift (both correct and wrong)
        const giftNumber = isCorrect ? updated.giftCorrect : updated.giftWrong;

        await this.giftModel.updateOne(
          { wristBandNumber: answer.wristBandNumber, questionId: id },
          {
            $setOnInsert: {
              isClaimed: false,
              giftNumber: giftNumber ?? null,
            }
          },
          { upsert: true }
        );
      }
    }

    return updated;
  }
}
