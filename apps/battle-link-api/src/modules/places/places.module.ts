import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { Place, PlaceSchema } from './schemas/place.schema';
import { UsersModule } from '../users/users.module';
import { AdminGuard } from '../../common/guards/admin.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    UsersModule,
  ],
  controllers: [PlacesController],
  providers: [PlacesService, AdminGuard],
})
export class PlacesModule {}
