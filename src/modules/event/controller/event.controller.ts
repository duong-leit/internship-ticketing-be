import { Controller, Get } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly appService: EventService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
