import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlaceDocument = HydratedDocument<Place>;
export type PlaceStatus = 'pending' | 'approved' | 'rejected';
export type PlaceType = 'store' | 'club';

@Schema({ _id: false })
export class PlaceLocation {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: 'Point';

  @Prop({ type: [Number], required: true })
  coordinates: [number, number];
}

export const PlaceLocationSchema = SchemaFactory.createForClass(PlaceLocation);

@Schema({ timestamps: true, versionKey: false })
export class Place {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['store', 'club'], required: true })
  type: PlaceType;

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

  @Prop()
  imageUrl?: string;

  @Prop({ type: [String], default: [] })
  wargames: string[];

  @Prop({ type: PlaceLocationSchema, required: true })
  location: PlaceLocation;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: PlaceStatus;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
PlaceSchema.index({ location: '2dsphere' });
