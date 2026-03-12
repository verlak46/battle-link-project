import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venue, VenueDocument } from './schemas/venue.schema';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

export enum VenueStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Injectable()
export class VenuesService {
  constructor(
    @InjectModel(Venue.name) private readonly venueModel: Model<VenueDocument>,
  ) {}

  findApproved(): Promise<VenueDocument[]> {
    return this.venueModel.find({ status: VenueStatus.APPROVED }).lean().exec() as unknown as Promise<VenueDocument[]>;
  }

  findPending(): Promise<VenueDocument[]> {
    return this.venueModel.find({ status: VenueStatus.PENDING }).lean().exec() as unknown as Promise<VenueDocument[]>;
  }

  async findById(id: string): Promise<VenueDocument> {
    const venue = await this.venueModel.findById(id).lean().exec();
    if (!venue) throw new NotFoundException('Venue no encontrada');
    return venue as unknown as VenueDocument;
  }

  create(dto: CreateVenueDto, userId: string): Promise<VenueDocument> {
    return this.venueModel.create({ ...dto, createdBy: userId, status: VenueStatus.PENDING }) as unknown as Promise<VenueDocument>;
  }

  async update(id: string, dto: UpdateVenueDto, userId: string): Promise<VenueDocument> {
    const venue = await this.venueModel.findById(id).exec();
    if (!venue) throw new NotFoundException('Venue no encontrada');
    if (venue.createdBy !== userId) throw new ForbiddenException('No tienes permiso para editar esta venue');
    if (venue.status === VenueStatus.APPROVED) throw new ForbiddenException('No puedes editar una venue aprobada');
    const updated = await this.venueModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean()
      .exec();
    return updated as unknown as VenueDocument;
  }

  async approve(id: string): Promise<VenueDocument> {
    const venue = await this.venueModel
      .findByIdAndUpdate(id, { $set: { status: VenueStatus.APPROVED } }, { new: true })
      .lean()
      .exec();
    if (!venue) throw new NotFoundException('Venue no encontrada');
    return venue as unknown as VenueDocument;
  }

  async reject(id: string): Promise<VenueDocument> {
    const venue = await this.venueModel
      .findByIdAndUpdate(id, { $set: { status: VenueStatus.REJECTED } }, { new: true })
      .lean()
      .exec();
    if (!venue) throw new NotFoundException('Venue no encontrada');
    return venue as unknown as VenueDocument;
  }

  async remove(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const venue = await this.venueModel.findById(id).exec();
    if (!venue) throw new NotFoundException('Venue no encontrada');
    if (!isAdmin && venue.createdBy !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta venue');
    }
    await this.venueModel.findByIdAndDelete(id).exec();
  }
}
