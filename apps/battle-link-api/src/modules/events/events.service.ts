import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEntity, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';

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

  async findAll(query: FindEventsQueryDto): Promise<{ items: EventDocument[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const baseFilter: Record<string, unknown> = { status: 'published' };
    if (query.excludeUserId) baseFilter['createdBy'] = { $ne: query.excludeUserId };

    // Geo-sorted path
    if (query.lat != null && query.lng != null) {
      const [result] = await this.eventModel.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [query.lng, query.lat] },
            distanceField: 'distance',
            spherical: true,
            query: baseFilter,
          },
        },
        {
          $facet: {
            items: [{ $skip: skip }, { $limit: limit }],
            total: [{ $count: 'count' }],
          },
        },
      ]);
      return {
        items: result.items as unknown as EventDocument[],
        total: (result.total[0]?.count as number) ?? 0,
      };
    }

    // Fallback: sort by startDate
    const [items, total] = await Promise.all([
      this.eventModel
        .find(baseFilter)
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec() as unknown as EventDocument[],
      this.eventModel.countDocuments(baseFilter),
    ]);
    return { items, total };
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
