import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EventDto, EventResponeDto } from '../dto/event.dto';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/create')
  @ApiBody({type: EventDto})
  createEvent(
    @Body() eventInfo: EventDto
  ): Promise<EventResponeDto>{
    return this.eventService.createEvent(eventInfo);
  }

  @Post('/update/:eventId')
  //@ApiBody()
  updateEvent(
    @Body() eventInfo: EventDto,
    @Query('eventId') eventId: string
  ): Promise<EventResponeDto>{
    return this.eventService.updateEvent(eventId, eventInfo);
  }
}
