import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type ExperienceLevel = 'beginner' | 'casual' | 'competitive';
export type AuthProvider = 'local' | 'google';

@Schema({ _id: false })
export class UserLocation {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: 'Point';

  @Prop({ type: [Number], required: true })
  coordinates: [number, number];
}

export const UserLocationSchema = SchemaFactory.createForClass(UserLocation);

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ unique: true, sparse: true })
  googleId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ select: false })
  password?: string;

  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop({ type: [String], default: [] })
  favoriteGames: string[];

  @Prop({ enum: ['beginner', 'casual', 'competitive'] })
  experienceLevel: ExperienceLevel;

  @Prop({ type: UserLocationSchema })
  location: UserLocation;

  @Prop({ default: false })
  onboardingCompleted: boolean;

  @Prop({ enum: ['local', 'google'], default: 'local' })
  provider: AuthProvider;

  @Prop({ select: false })
  resetPasswordToken?: string;

  @Prop({ select: false })
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ location: '2dsphere' });
