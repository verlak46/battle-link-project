import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from './schemas/place.schema';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

export enum PlaceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<PlaceDocument>,
  ) {}

  findApproved(): Promise<PlaceDocument[]> {
    return this.placeModel.find({ status: PlaceStatus.APPROVED }).lean().exec() as unknown as Promise<PlaceDocument[]>;
  }

  findPending(): Promise<PlaceDocument[]> {
    return this.placeModel.find({ status: PlaceStatus.PENDING }).lean().exec() as unknown as Promise<PlaceDocument[]>;
  }

  async findById(id: string): Promise<PlaceDocument> {
    const place = await this.placeModel.findById(id).lean().exec();
    if (!place) throw new NotFoundException('Place no encontrada');
    return place as unknown as PlaceDocument;
  }

  create(dto: CreatePlaceDto, userId: string): Promise<PlaceDocument> {
    return this.placeModel.create({ ...dto, createdBy: userId, status: PlaceStatus.PENDING }) as unknown as Promise<PlaceDocument>;
  }

  async update(id: string, dto: UpdatePlaceDto, userId: string): Promise<PlaceDocument> {
    const place = await this.placeModel.findById(id).exec();
    if (!place) throw new NotFoundException('Place no encontrada');
    if (place.createdBy !== userId) throw new ForbiddenException('No tienes permiso para editar esta place');
    if (place.status === PlaceStatus.APPROVED) throw new ForbiddenException('No puedes editar una place aprobada');
    const updated = await this.placeModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean()
      .exec();
    return updated as unknown as PlaceDocument;
  }

  async approve(id: string): Promise<PlaceDocument> {
    const place = await this.placeModel
      .findByIdAndUpdate(id, { $set: { status: PlaceStatus.APPROVED } }, { new: true })
      .lean()
      .exec();
    if (!place) throw new NotFoundException('Place no encontrada');
    return place as unknown as PlaceDocument;
  }

  async reject(id: string): Promise<PlaceDocument> {
    const place = await this.placeModel
      .findByIdAndUpdate(id, { $set: { status: PlaceStatus.REJECTED } }, { new: true })
      .lean()
      .exec();
    if (!place) throw new NotFoundException('Place no encontrada');
    return place as unknown as PlaceDocument;
  }

  async remove(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const place = await this.placeModel.findById(id).exec();
    if (!place) throw new NotFoundException('Place no encontrada');
    if (!isAdmin && place.createdBy !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta place');
    }
    await this.placeModel.findByIdAndDelete(id).exec();
  }
}
