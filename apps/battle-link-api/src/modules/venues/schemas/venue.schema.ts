import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VenueDocument = HydratedDocument<Venue>;
export type VenueStatus = 'pending' | 'approved' | 'rejected';
export type VenueType = 'store' | 'club';

@Schema({ _id: false })
export class VenueLocation {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: 'Point';

  @Prop({ type: [Number], required: true })
  coordinates: [number, number];
}

export const VenueLocationSchema = SchemaFactory.createForClass(VenueLocation);

@Schema({ timestamps: true, versionKey: false })
export class Venue {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['store', 'club'], required: true })
  type: VenueType;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  description?: string;

  @Prop()
  phone?: string;

  @Prop()
  website?: string;

  @Prop({ type: [String], default: [] })
  wargames: string[];

  @Prop({ type: VenueLocationSchema, required: true })
  location: VenueLocation;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: VenueStatus;
}

export const VenueSchema = SchemaFactory.createForClass(Venue);
VenueSchema.index({ location: '2dsphere' });
