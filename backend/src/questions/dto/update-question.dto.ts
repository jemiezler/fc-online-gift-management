// src/questions/dto/update-question.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  winner?: string;

  @IsOptional()
  @IsNumber()
  giftCorrect?: number;

  @IsOptional()
  @IsNumber()
  giftWrong?: number;
}
