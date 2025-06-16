import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GiftDocument } from 'src/gifts/schemas/gift.schema';
import { QuestionDocument } from 'src/questions/schemas/question.schema';
import { AnswerDocument } from './schemas/answer.schema';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel('Answer') private readonly answerModel: Model<AnswerDocument>,
    @InjectModel('Question') private readonly questionModel: Model<QuestionDocument>,
    @InjectModel('Gift') private readonly giftModel: Model<GiftDocument>,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) { }
  async bulkInsert(body: {
    match: string;
    round: number;
    answers: (CreateAnswerDto & { name?: string })[];
  }) {
    const { match, round, answers } = body;
    const report = { inserted: 0, skipped: 0, createdUsers: 0 };
    const userCache = new Set<string>();

    let question = await this.questionModel.findOne({ match, round });

    if (!question) {
      question = await this.questionModel.create({
        match,
        round,
        winner: "",
      });
    }

    const questionId = question._id.toString();
    const correctAnswer = (question.winner ?? "").trim().toLowerCase();


    for (const row of answers) {
      try {
        const { wristBandNumber, answer, name } = row;
        if (!wristBandNumber || !answer) {
          report.skipped++;
          continue;
        }

        if (!userCache.has(wristBandNumber)) {
          const exists = await this.userModel.exists({ wristBandNumber });
          if (!exists) {
            const parsedName = parseName(name || wristBandNumber);

            await this.userModel.create({
              name: parsedName,
              wristBandNumber,
              seatNumber: row.seatNumber || 'Unknown',
            });

            report.createdUsers++;
          }
          userCache.add(wristBandNumber);
        }


        const isCorrect = answer.trim().toLowerCase() === correctAnswer;

        await this.answerModel.create({
          wristBandNumber,
          questionId,
          answer,
          isCorrect,
        });

        if (isCorrect) {
          await this.giftModel.updateOne(
            { wristBandNumber, questionId },
            { $setOnInsert: { isClaimed: false } },
            { upsert: true }
          );
        }

        report.inserted++;
      } catch {
        report.skipped++;
      }
    }

    return report;
  }


}

function parseName(fullName: string): {
  first: string;
  middle?: string;
  last?: string;
} {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 2) {
    return {
      first: parts[0],
      last: parts[1],
    };
  }

  if (parts.length === 3) {
    return {
      first: parts[0],
      middle: parts[1],
      last: parts[2],
    };
  }

  return {
    first: parts[0],
    last: parts.slice(1).join(' '),
  };
}

