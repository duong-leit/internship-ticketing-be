import { Controller, Get } from '@nestjs/common';
import { EventService } from '../service/event.service';

@Controller('event')
export class EventController {
  constructor(private readonly appService: EventService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
