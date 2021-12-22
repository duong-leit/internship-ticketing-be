import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCodeEnum } from 'src/common/enums/errorCode';
import { QueryRunner } from 'typeorm';
import { EventEntity } from '../domain/entities/event.entity';
// import { EventEntity } from '../domain/entities/event.entity';
import { EventDto, EventResponeDto, PaginationDto } from '../dto/event.dto';
import { EventRepository } from '../infrastructure/event.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private readonly eventRepository: EventRepository
  ) {}

  private transferEntityToDto(
    event: EventEntity[],
    ignore: { [key: string]: boolean } | undefined = undefined
  ) {
    return event.map((_event) => ({
      id: !ignore['id'] ? _event.id : undefined,
    }));
  }

  async getEventByID(
    eventId: string,
    queryRunner: QueryRunner = null
  ): Promise<EventEntity> {
    if (queryRunner !== null) {
      return await queryRunner.manager.findOne('event', eventId);
    }
    return await this.eventRepository.findOne({
      where: { id: eventId },
    });
  }

  async getEventByCreator(
    userId: string,
    paging: PaginationDto | undefined = {
      pageSize: 10,
      pageIndex: 1,
    }
  ) {
    if (paging.pageIndex == 0) paging.pageIndex = 1;
    if (paging.pageSize == 0) paging.pageSize = 10;

    const take = paging.pageSize || 10;
    const skip = paging.pageIndex ? paging.pageIndex - 1 : 0;

    const [result, total] = await this.eventRepository.findAndCount({
      relations: ['category'],
      where: {
        userId: userId,
        isDeleted: false,
      },
      // order: { name: 'DESC' },
      take: take,
      skip: skip === 0 ? 0 : skip * take,
    });

    return {
      statusCode: 200,
      data: result,
      //data: UserService.transferEntityToDto(result),
      pagination: {
        _totalPage: Math.ceil(total / take),
        _pageSize: take,
        _pageIndex: skip + 1,
      },
    };
  }

  async getEventsByCategory(
    categoryId: string,
    //relations: { arrayRelation: string[] } | undefined = undefined,
    paging: PaginationDto | undefined = {
      pageSize: 10,
      pageIndex: 1,
    }
  ) {
    const take = paging.pageSize || 10;
    const skip = paging.pageIndex ? paging.pageIndex - 1 : 0;
    //console.log(dataCheck);

    const [result, total] = await this.eventRepository.findAndCount({
      //relations: relations?.arrayRelation || undefined,
      relations: ['category'],
      where: {
        categoryId: categoryId,
        isDeleted: false,
      },
      // order: { name: 'DESC' },
      take: take,
      skip: skip === 0 ? 0 : skip * take,
    });
    return {
      statusCode: 200,
      data: result,
      //data: UserService.transferEntityToDto(result),
      pagination: {
        _totalPage: Math.ceil(total / take),
        _pageSize: take,
        _pageIndex: skip + 1,
      },
    };
  }

  async getAll(
    paging: PaginationDto = {
      pageSize: 10,
      pageIndex: 1,
    }
  ) {
    const take = paging.pageSize || 10;
    const skip = paging.pageIndex ? paging.pageIndex - 1 : 0;

    const [result, total] = await this.eventRepository.findAndCount({
      //relations: relations?.arrayRelation || undefined,
      relations: ['category'],
      where: {
        isDeleted: false,
      },
      // order: { name: 'DESC' },
      take: take,
      skip: skip === 0 ? 0 : skip * take,
    });
    return {
      statusCode: 200,
      data: result,
      //data: UserService.transferEntityToDto(result),
      pagination: {
        _totalPage: Math.ceil(total / take),
        _pageSize: take,
        _pageIndex: skip + 1,
      },
    };
  }

  private async responeErrorMessage(
    statusCode: number,
    message: string
  ): Promise<EventResponeDto> {
    return {
      statusCode: statusCode,
      message: message,
    };
  }

  async createEvent(eventInfo: EventDto): Promise<EventResponeDto> {
    const newEvent = this.eventRepository.create(eventInfo);
    const event = await this.eventRepository.save(newEvent);
    if (!event) return; //this.responeErrorMessage(400, 'Cannot create new event');
    return {
      statusCode: 200,
      data: {
        id: event.id,
      },
    };
  }

  async updateAvailableTickets(
    eventId: string,
    ticketAmount: number,
    queryRunner: QueryRunner = undefined
  ): Promise<EventEntity> {
    const event = await this.getEventByID(eventId);
    if (!event) {
      throw new BadRequestException(ErrorCodeEnum.NOT_FOUND_EVENT);
    }
    if (event.availableTickets < -ticketAmount) {
      throw new BadRequestException(ErrorCodeEnum.INVALID_NUMBER_TICKET);
    }
    const availableTickets = event.availableTickets + ticketAmount;
    if (queryRunner) {
      return queryRunner.manager.save(EventEntity, {
        ...event,
        availableTickets: availableTickets,
      });
    }
    return this.eventRepository.save({
      ...event,
      availableTickets: availableTickets,
    });
  }

  async updateEvent(
    eventId: string,
    eventInfo: EventDto
  ): Promise<EventResponeDto> {
    const event = await this.getEventByID(eventId);
    if (!event) {
      return this.responeErrorMessage(404, 'Event not Found');
    }

    if (event.userId != eventInfo.userId) {
      return this.responeErrorMessage(401, 'Permission denied');
    }

    //update Event
    const updatedEvent = await this.eventRepository.save({
      ...event, //existed Info
      ...eventInfo, //Update Info
    });
    return { statusCode: 200, data: { id: updatedEvent.id } };
    //this.responeSuccessMessage(201, "Event updated successfully", {id: event.id})
    //console.log(error);
    //this.responeErrorMessage(400, "Cannot update event");
  }
}
