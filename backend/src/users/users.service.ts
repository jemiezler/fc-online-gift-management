import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) { }
  async create(createUserDtos: CreateUserDto[]) {
    if (!Array.isArray(createUserDtos)) {
      throw new Error('Input must be an array of CreateUserDto');
    }

    const validated = createUserDtos.filter(dto =>
      dto &&
      typeof dto.name === 'object' &&
      dto.name.first &&
      dto.wristBandNumber &&
      dto.seatNumber
    );

    const seen = new Set<string>();
    const deduplicated: CreateUserDto[] = [];

    for (const dto of validated) {
      if (!seen.has(dto.wristBandNumber)) {
        seen.add(dto.wristBandNumber);
        deduplicated.push(dto);
      }
    }

    if (deduplicated.length === 0) {
      return { inserted: 0, skipped: createUserDtos.length };
    }

    const existing = await this.userModel.find({
      wristBandNumber: { $in: deduplicated.map(u => u.wristBandNumber) }
    }).select('wristBandNumber').lean();

    const existingSet = new Set(existing.map(u => u.wristBandNumber));
    const filtered = deduplicated.filter(u => !existingSet.has(u.wristBandNumber));

    if (filtered.length > 0) {
      await this.userModel.insertMany(filtered);
    }

    return {
      inserted: filtered.length,
      skipped: createUserDtos.length - filtered.length,
    };
  }



  findAll() {
    return  this.userModel.find().select('-__v').lean();
  }

  findOne(id: string) {
    return  this.userModel.findById(id).select('-__v').lean();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    }).select('-__v').lean();
  }

  remove(id: number) {
    return this.userModel.findByIdAndDelete(id).select('-__v').lean();
  }
}
