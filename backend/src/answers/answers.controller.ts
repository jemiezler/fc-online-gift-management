import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnswersService } from './answers.service';
import * as csv from 'csv-parser';
import { Readable } from 'stream'; // ✅ use memory buffer stream
import type { File as MulterFile } from 'multer';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAnswers(
    @UploadedFile() file: MulterFile,
    @Body('match') match: string,
    @Body('round') round: string
  ) {
    if (!file?.buffer || !match || !round) {
      console.log(file, match, round);
      throw new BadRequestException('Missing file, match, or round');
    }

    const results: any[] = [];

    return new Promise((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (row) => {
          results.push({
            wristBandNumber: row.wristBandNumber?.trim(),
            answer: row.answer?.trim(),
            name: row.name?.trim(),
            seatNumber: row.seatNumber?.trim() || 'Unknown',
          });
        })
        .on('end', async () => {
          try {
            const report = await this.answersService.bulkInsert({
              match,
              round: Number(round),
              answers: results,
            });
            resolve(report);
          } catch (err) {
            reject(err);
          }
        })
        .on('error', reject);
    });
  }
}
