import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { GiftsService } from './gifts.service';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) { }

  @Post('claim')
  async claimSelectedGifts(@Body() body: {
    wristBandNumber: string;
    questionIds: string[];
  }) {
    return this.giftsService.claim(body.wristBandNumber, body.questionIds);
  }

  @Get()
  async getAllGifts() {
    return this.giftsService.findAllGroupedByUser();
  }

}
