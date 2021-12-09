import { Body, Controller, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
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

  @Put('/update/:eventId')
  //@ApiBody()
  //Guard
  //Role

  updateEvent(
    @Request() req: any, 
    @Body() eventInfo: EventDto,
    @Query('eventId') eventId: string
  ): Promise<EventResponeDto>{
    console.log("Request info", req);
    return this.eventService.updateEvent(eventId, eventInfo);
  }
}
