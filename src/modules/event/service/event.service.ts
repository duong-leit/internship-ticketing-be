import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtUser } from 'src/modules/user/domain/interfaces/IUser.interface';
import { EventDto, EventResponeDto } from '../dto/event.dto';
import { EventRepository } from '../infrastructure/event.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private readonly eventRepository: EventRepository
  ) {}

  async getEventByID(eventId: string){
    return await this.eventRepository.findOne({
      where: {id: eventId}})
  }

  async getEventByCreator(
    data: { [key: string]: string | number } | undefined = undefined,
    relations: { arrayRelation: string[] } | undefined = undefined,
    paging: { pageSize: number; pageIndex: number } | undefined = {
      pageSize: undefined,
      pageIndex: undefined
    }
  ) {
    const dataCheck = {
      [Object.keys(data)[0]]: data[Object.keys(data)[0]],
    };
    const take = paging.pageSize || 10;
    const skip = paging.pageIndex ? paging.pageIndex - 1 : 0;
    //console.log(dataCheck);
    
    
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

    //console.log(Object.getOwnPropertyNames(UserResponseDto));
    console.log(result);
    
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

  async getEventsByCategory(categoryId: string){
    return await this.eventRepository.findOne({
      relations: ['eventCategory'],
      where: {categoryId: categoryId}})
  }

  private async responeErrorMessage(statusCode: number, message: string): Promise<EventResponeDto>{
    return {
      statusCode: statusCode,
      message: message
    }
  }

  private async responeSuccessMessage(statusCode: number, message: string, data: object): Promise<EventResponeDto>{
    return {
      statusCode: statusCode,
      message: message,
      data: data
    }
  }

  async createEvent(eventInfo: EventDto): Promise<EventResponeDto>{
    try {
      const newEvent = this.eventRepository.create(eventInfo);
      const event = await this.eventRepository.save(newEvent);
      return this.responeSuccessMessage(200, "Event created successfully", {id: event.id})
    } catch (error) {
      return this.responeErrorMessage(400, "Cannot create new event", )
    }
  }

  async updateEvent(eventId: string, eventInfo: EventDto, user: IJwtUser): Promise<EventResponeDto>{
    try {
      const event = await this.getEventByID(eventId);
      if((event).userId != user.userId) {
        return await this.responeErrorMessage(401, "Permission denied");
      }
      //update Event
      this.eventRepository.save({
        ...event, //existed Info
        ...eventInfo //Update Info
      })
      return this.responeSuccessMessage(200, "  Event updated successfully", {id: event.id})
    } catch (error) {
      //console.log(error);
      return this.responeErrorMessage(400, "Cannot update event");
    }
  }
}
