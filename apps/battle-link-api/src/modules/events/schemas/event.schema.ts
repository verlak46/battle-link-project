import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type EventDocument = HydratedDocument<EventEntity>;
export type CreationType = 'game' | 'tournament' | 'campaign' | 'league';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished';

const EventLocationSchema = new MongooseSchema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  { _id: false },
);

@Schema({ timestamps: true, versionKey: false })
export class EventEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ enum: ['game', 'tournament', 'campaign', 'league'], required: true })
  type: CreationType;

  @Prop({ required: true })
  game: string;

  @Prop()
  system?: string;

  @Prop({ required: true })
  startDate: string;

  @Prop()
  endDate?: string;

  @Prop()
  time?: string;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  contactUrl?: string;

  @Prop({ default: 0 })
  maxPlayers: number;

  @Prop({ default: 0 })
  currentPlayers: number;

  @Prop()
  city?: string;

  @Prop()
  address?: string;

  @Prop()
  placeId?: string;

  @Prop()
  placeName?: string;

  @Prop({ type: EventLocationSchema })
  location?: { type: string; coordinates: [number, number] };

  @Prop()
  locationRadius?: number;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ type: [String], default: [] })
  participants: string[];

  @Prop({ enum: ['draft', 'published', 'cancelled', 'finished'], default: 'published' })
  status: EventStatus;
}

export const EventEntitySchema = SchemaFactory.createForClass(EventEntity);
EventEntitySchema.index({ location: '2dsphere' }, { sparse: true });
EventEntitySchema.index({ startDate: 1 });
EventEntitySchema.index({ createdBy: 1 });
