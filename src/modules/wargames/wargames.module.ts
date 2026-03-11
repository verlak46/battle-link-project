import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WargamesController } from './wargames.controller';
import { WargamesService } from './wargames.service';
import { Wargame, WargameSchema } from './schemas/wargame.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wargame.name, schema: WargameSchema }]),
  ],
  controllers: [WargamesController],
  providers: [WargamesService],
})
export class WargamesModule {}
