import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WargameDocument = HydratedDocument<Wargame>;

@Schema({ versionKey: false })
export class Wargame {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  publisher: string;

  @Prop()
  minPlayers: number;

  @Prop()
  maxPlayers: number;

  @Prop()
  year: number;
}

export const WargameSchema = SchemaFactory.createForClass(Wargame);
