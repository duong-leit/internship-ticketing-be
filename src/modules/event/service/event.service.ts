import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtUser } from 'src/modules/user/domain/interfaces/IUser.interface';
import { QueryRunner } from 'typeorm';
import { EventEntity } from '../domain/entities/event.entity';
// import { EventEntity } from '../domain/entities/event.entity';
import { EventDto, EventResponeDto } from '../dto/event.dto';
import { EventRepository } from '../infrastructure/event.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private readonly eventRepository: EventRepository // @Inject(forwardRef(() => TicketService)) // private readonly ticketService: TicketService
  ) {}

  // private transferEntityToDto(
  //   event: EventEntity[],
  //   ignore: { [key: string]: boolean } | undefined = undefined
  // ) {
  //   return event.map((_user) => ({
  //     // id: !ignore['id'] ? _user.id : undefined,
  //     // createdAt: !ignore['createdAt'] ? _user.createdAt : undefined,
  //     // updatedAt: !ignore['name'] ? _user.name : undefined,
  //     // name: !ignore['name'] ? _user.name : undefined,
  //     // email: !!ignore['email'] ? _user.email : undefined,
  //     // username: !ignore['username'] ? _user.username : undefined,
  //     // birthday: !ignore['birthday'] ? _user.birthday : undefined,
  //     // numberPhone: !ignore['phoneNumber'] ? _user.phoneNumber : undefined,
  //     // password: !ignore['password'] ? _user.password : undefined,
  //     // gender: !ignore['gender'] ? _user.gender : undefined,
  //     // avatarUrl: !ignore['avatarUrl'] ? _user.avatarUrl : undefined,
  //     // isSocial: !ignore['isSocial'] ? _user.isSocial : undefined,
  //     // role: !ignore['role'] ? _user.role?.name : undefined,
  //     // roleId: !ignore['roleId'] ? _user.roleId : undefined
  //   }));
  // }

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
    data: string,
    relations: { arrayRelation: string[] } | undefined = undefined,
    paging: { pageSize: number; pageIndex: number } | undefined = {
      pageSize: 10,
      pageIndex: 1,
    }
  ) {
    // const dataCheck = {
    //   [Object.keys(data)[0]]: data[Object.keys(data)[0]],
    // };
    const take = paging.pageSize || 10;
    const skip = paging.pageIndex ? paging.pageIndex - 1 : 0;

    const [result, total] = await this.eventRepository.findAndCount({
      relations: relations?.arrayRelation || undefined,
      where: {
        userId: data,
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

  async getEventsByCategory(categoryId: string) {
    return await this.eventRepository.findOne({
      relations: ['eventCategory'],
      where: { categoryId: categoryId },
    });
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

  private async responeSuccessMessage(
    statusCode: number,
    message: string,
    data: object
  ): Promise<EventResponeDto> {
    return {
      statusCode: statusCode,
      message: message,
      data: data,
    };
  }

  async createEvent(eventInfo: EventDto): Promise<EventResponeDto> {
    try {
      const newEvent = this.eventRepository.create(eventInfo);
      const event = await this.eventRepository.save(newEvent);
      // await this.ticketService.createTicketsByEvent({
      //   userId: eventInfo.userId,
      //   amount: eventInfo.totalTickets,
      //   eventId: event.id,
      // });
      return this.responeSuccessMessage(201, 'Event created successfully', {
        id: event.id,
      });
    } catch (error) {
      return this.responeErrorMessage(400, 'Cannot create new event');
    }
  }

  async updateAvailableTickets(
    eventId: string,
    ticketAmount: number,
    queryRunner: QueryRunner = undefined
  ): Promise<EventEntity> {
    try {
      const event = await this.getEventByID(eventId);
      if (!event) {
        return null;
      }
      if (event.availableTickets < -ticketAmount) {
        return null;
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
    } catch (error) {
      return null;
    }
  }

  async updateEvent(
    eventId: string,
    eventInfo: EventDto,
    user: IJwtUser
  ): Promise<EventResponeDto> {
    try {
      const event = await this.getEventByID(eventId);
      if (event.userId != user.userId) {
        return await this.responeErrorMessage(401, 'Permission denied');
      }
      //update Event
      this.eventRepository.save({
        ...event, //existed Info
        ...eventInfo, //Update Info
      });
      return this.responeSuccessMessage(201, 'Event updated successfully', {
        id: event.id,
      });
    } catch (error) {
      //console.log(error);
      return this.responeErrorMessage(400, 'Cannot update event');
    }
  }
}
