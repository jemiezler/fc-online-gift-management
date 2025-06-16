import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Gift, GiftDocument } from './schemas/gift.schema';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionDocument } from 'src/questions/schemas/question.schema';
import { AnswerDocument } from 'src/answers/schemas/answer.schema';

@Injectable()
export class GiftsService {
  constructor(
    @InjectModel('Gift') private readonly giftModel: Model<GiftDocument>,
    @InjectModel('Question') private readonly questionModel: Model<QuestionDocument>,
    @InjectModel('Answer') private readonly answerModel: Model<AnswerDocument>
  ) { }
  async claim(wristBandNumber: string, questionIds: string[]) {
    if (!wristBandNumber || !Array.isArray(questionIds) || questionIds.length === 0) {
      throw new BadRequestException('Missing wristBandNumber or questionIds');
    }

    const updateResult = await this.giftModel.updateMany(
      {
        wristBandNumber,
        questionId: { $in: questionIds },
        isClaimed: false
      },
      { $set: { isClaimed: true } }
    );

    return {
      wristBandNumber,
      claimedCount: updateResult.modifiedCount,
      message: `${updateResult.modifiedCount} gift(s) claimed for selected questions`
    };
  }

  async findAllGroupedByUser(): Promise<
    {
      wristBandNumber: string;
      gifts: Array<{
        questionId: string;
        isClaimed: boolean;
        match: string;
        round: string;
        winner: string;
        answer?: string;
        isCorrect?: boolean;
        giftNumber?: number | string;
      }>;
    }[]
  > {
    const gifts = await this.giftModel.find().lean<GiftDocument[]>();
    const questions = await this.questionModel.find().lean<QuestionDocument[]>();
    const answers = await this.answerModel.find().lean<AnswerDocument[]>();

    const groupedMap = new Map<string, any[]>();

    for (const gift of gifts) {
      const giftQid = gift.questionId?.toString().trim();
      const giftWbn = gift.wristBandNumber?.toString().trim();

      const questionDetails = questions.find(q => q._id.toString() === giftQid);
      const answerDetails = answers.find(
        a =>
          a.questionId.toString().trim() === giftQid &&
          a.wristBandNumber.toString().trim() === giftWbn
      );

      const isCorrect = answerDetails?.isCorrect;
      const giftNumber =
        isCorrect === true
          ? questionDetails?.giftCorrect ?? ''
          : isCorrect === false
            ? questionDetails?.giftWrong ?? ''
            : '';

      const simpleGift = {
        questionId: giftQid,
        isClaimed: gift.isClaimed || false,
        match: questionDetails?.match || '',
        round: questionDetails?.round || '',
        winner: questionDetails?.winner || '',
        answer: answerDetails?.answer,
        isCorrect,
        giftNumber,
      };

      if (!groupedMap.has(giftWbn)) {
        groupedMap.set(giftWbn, []);
      }
      groupedMap.get(giftWbn)!.push(simpleGift);
    }

    return Array.from(groupedMap.entries()).map(([wbn, gifts]) => ({
      wristBandNumber: wbn,
      gifts,
    }));
  }

}
