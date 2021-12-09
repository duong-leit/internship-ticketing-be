import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEvent } from '../domain/interfaces/IEvent.interface';
import { EventDto, EventResponeDto } from '../dto/event.dto';
import { EventRepository } from '../infrastructure/event.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private readonly eventRepository: EventRepository
  ) {}

  async getEventByID(eventId: string){
    return this.eventRepository.findOne({
      where: {id: eventId}})
  }

  async getEventByCreator(userId: string){
    return this.eventRepository.findOne({
      where: {userId: userId}})
  }

  async getEventByCategory(categoryId: string){
    return this.eventRepository.findOne({
      where: {categoryId: categoryId}})
  }

  private async responeMessage(statusCode: number, message: string, data?: object): Promise<EventResponeDto>{
    return {
      statusCode: statusCode,
      message: message
    }
  }

  private async manualMapper(eventInfo: EventDto): Promise<EventResponeDto>{
    return
    // return{
    //   name: eventInfo.name,
    //   eventAddress: eventInfo.eventAddress,
    //   totalTickets: eventInfo.totalTickets,
    //   categoryId: eventInfo.categoryId,
    //   userId: eventInfo.userId,
    //   ticketPrice: eventInfo.ticketPrice,
    //   eventStartDate: eventInfo.eventStartDate,
    //   eventEndDate: eventInfo.eventEndDate,
    //   saleStartDate: eventInfo.saleStartDate,
    //   saleEndDate: eventInfo.saleEndDate,
    //   //availableTicket: number;
    //   maxTicketOrder: eventInfo.maxTicketOrder,
    //   minTicketOrder: eventInfo.minTicketOrder,
    //   logoUrl: eventInfo.logoUrl,
    //   bannerUrl: eventInfo.bannerUrl,
    //   description: eventInfo.description,
    //   eventPlacename: eventInfo.eventPlacename,
    //   ticketImageUrl: eventInfo.ticketImageUrl,
    //   organizationInfo: eventInfo.organizationInfo,
    //   organizationEmail: eventInfo.organizationEmail,
    //   organizationPhone: eventInfo.organizationPhone,
    //   organizationAddress: eventInfo.organizationAddress,
    // }
  }

  async createEvent(eventInfo: EventDto): Promise<EventResponeDto>{
    //Mapping
    //const newEvent = await this.manualMapper(eventInfo);
    const newEvent = this.eventRepository.create(eventInfo);
    console.log(newEvent);
  
    try {
      const event = await this.eventRepository.save(newEvent);
      return this.responeMessage(200, "Event created successfully")
    } catch (error) {
      console.log(error);
      return this.responeMessage(400, "Cannot create new event")
    }
  }

  async updateEvent(eventId: string, eventInfo: EventDto): Promise<EventResponeDto>{
    try {
      const event = this.getEventByID(eventId);
      
    } catch (error) {
      
    }
    return
  }
}
