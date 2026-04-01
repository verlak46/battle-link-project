import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEntity, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateEventDto, userId: string): Promise<EventDocument> {
    const event = new this.eventModel({
      ...dto,
      createdBy: userId,
      participants: [userId],
      currentPlayers: 1,
    });
    return event.save();
  }

  async findAll(): Promise<EventDocument[]> {
    return this.eventModel
      .find({ status: 'published' })
      .sort({ startDate: 1 })
      .lean()
      .exec() as unknown as EventDocument[];
  }

  async findByUser(userId: string): Promise<EventDocument[]> {
    return this.eventModel
      .find({ createdBy: userId })
      .sort({ startDate: -1 })
      .lean()
      .exec() as unknown as EventDocument[];
  }

  async findById(id: string): Promise<EventDocument> {
    const event = await this.eventModel.findById(id).lean().exec() as unknown as EventDocument;
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException('Evento no encontrado');
    if (event.createdBy !== userId) throw new ForbiddenException('No tienes permiso para eliminar este evento');
    await event.deleteOne();
  }
}
