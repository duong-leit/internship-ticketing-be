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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { EventDto, EventResponeDto } from '../dto/event.dto';
import { transferResponse } from 'src/common/utils/transferResponse';
import { response } from 'express';


@ApiTags('Event')
//@Roles(RoleEnum.User)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: EventDto })
  async createEvent(
    @Body() eventInfo: EventDto,
    @Response() res: any,
    @Request() req: any
  ) {
    const response = await this.eventService.createEvent(eventInfo);
    transferResponse(res, response);
  }

  @Put('/:eventId')
  //@ApiBody()
  //Guard
  //Role
  async updateEvent(
    @Request() req: any,
    @Body() eventInfo: EventDto,
    @Query('eventId') eventId: string,
    @Response() res: any
  ) {
    // const user = {
    //   userId: '22e60f44-f4ed-4a70-923d-c76ed756a31d',
    //   email: '123@gmail.com',
    //   role: 'User',
    // };
    //
    const response = await this.eventService.updateEvent(
      eventId,
      eventInfo
    );
    transferResponse(res, response);
  }

  @Get()
  async getEventById(
    @Param('eventId') eventId: string,
    @Response() res: any
  ) {
    const eventDetail = await this.eventService.getEventByID(eventId);
    transferResponse(res, response)
  }

  @Get('/myEvent')
  async getMyEvent() {
    // const user = {
    //   userId: '22e60f44-f4ed-4a70-923d-c76ed756a31d',
    //   email: '123@gmail.com',
    //   role: 'User',
    // };
    const events = await this.eventService.getEventByCreator();
  }
}

