import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wargame, WargameDocument } from './schemas/wargame.schema';

@Injectable()
export class WargamesService {
  constructor(
    @InjectModel(Wargame.name) private readonly wargameModel: Model<WargameDocument>,
  ) {}

  findAll(): Promise<WargameDocument[]> {
    return this.wargameModel.find().lean().exec() as Promise<WargameDocument[]>;
  }
}
