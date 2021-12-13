import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { EventService } from '../service/event.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EventDto, EventResponeDto } from '../dto/event.dto';
import { transferResponse } from 'src/common/utils/transferResponse';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/create')
  @ApiBody({ type: EventDto })
  async createEvent(
    @Body() eventInfo: EventDto,
    @Response() res: any,
    @Request() req: any
  ) {
    // console.log(req.user);
    const response = await this.eventService.createEvent(eventInfo);
    transferResponse(res, response);
  }

  @Put('/update/:eventId')
  //@ApiBody()
  //Guard
  //Role
  async updateEvent(
    @Request() req: any,
    @Body() eventInfo: EventDto,
    @Query('eventId') eventId: string,
    @Response() res: any
  ) {
    const user = {
      userId: '22e60f44-f4ed-4a70-923d-c76ed756a31d',
      email: '123@gmail.com',
      role: 'User',
    };
    //
    const response = await this.eventService.updateEvent(
      eventId,
      eventInfo,
      user
    );
    transferResponse(res, response);
  }

  @Get('/myEvent')
  async getMyEvent() {
    const user = {
      userId: '22e60f44-f4ed-4a70-923d-c76ed756a31d',
      email: '123@gmail.com',
      role: 'User',
    };
    //console.log(await this.eventService.getEventByCreator(user.userId));
  }
}
