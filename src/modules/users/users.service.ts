import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { OnboardingDto } from './dto/onboarding.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .lean()
      .exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user as unknown as UserDocument;
  }

  async findByEmail(email: string, withPassword = false): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email });
    if (withPassword) query.select('+password');
    return query.exec();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async createUser(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async completeOnboarding(id: string, dto: OnboardingDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { ...dto, onboardingCompleted: true } },
        { new: true },
      )
      .select('-password')
      .lean()
      .exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user as unknown as UserDocument;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .select('-password')
      .lean()
      .exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user as unknown as UserDocument;
  }
}
