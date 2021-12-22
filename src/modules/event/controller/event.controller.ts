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
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventDto, PaginationDto } from '../dto/event.dto';
import { transferResponse } from 'src/common/utils/transferResponse';
import { Public, Roles } from 'src/modules/auth/roles.decorator';
import { RoleEnum } from 'src/modules/role/domain/enums/role.enum';

@ApiTags('Event')
@Controller('event')
@Public()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiQuery({ type: PaginationDto })
  async getAll(@Response() res: any, @Query() pagination: PaginationDto) {
    const events = await this.eventService.getAll(pagination);
    transferResponse(res, events);
  }

  @Get('/:id')
  @Public()
  async getEventById(@Param('id') eventId: string, @Response() res: any) {
    const eventDetail = await this.eventService.getEventByID(eventId);
    transferResponse(res, { statusCode: 200, data: eventDetail });
  }

  @Get('/myEvent')
  @ApiBearerAuth()
  async getMyEvent(@Body() pagination: PaginationDto, @Response() res: any) {
    // const user = {
    //   userId: '22e60f44-f4ed-4a70-923d-c76ed756a31d',
    //   email: '123@gmail.com',
    //   role: 'User',
    // };
    const events = await this.eventService.getEventByCreator(pagination);
    transferResponse(res, { statusCode: 200, data: events });
  }

  @Post()
  @ApiBearerAuth()
  // @Public()
  @Roles(RoleEnum.User)
  @ApiBody({ type: EventDto })
  async createEvent(
    @Body() eventInfo: EventDto,
    @Response() res: any,
    @Request() req: any
  ) {
    console.log(req);
    //console.log(eventInfo);
    //console.log(req.headers);
    const newEvent = await this.eventService.createEvent(eventInfo);
    //console.log(response);
    //return response;
    transferResponse(res, newEvent);
    //console.log(res);
  }

  @Put('/:eventId')
  //@ApiBody()
  @ApiBearerAuth()
  @Roles(RoleEnum.User)
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
    const response = await this.eventService.updateEvent(eventId, eventInfo);
    transferResponse(res, response);
  }
}
