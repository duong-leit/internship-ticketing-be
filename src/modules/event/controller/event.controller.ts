import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Response,
} from '@nestjs/common';
import { EventService } from '../service/event.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventDto, PaginationDto } from '../dto/event.dto';
import { transferResponse } from 'src/common/utils/transferResponse';
import { Public, Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/modules/role/domain/enums/role.enum';
import { User } from 'src/modules/auth/decorators/user.decorator';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Get()
  @ApiQuery({ type: PaginationDto })
  async getAll(@Response() res: any, @Query() pagination: PaginationDto) {
    const events = await this.eventService.getAll(pagination);
    transferResponse(res, events);
  }

  @Roles(RoleEnum.User)
  @Get('/myEvent')
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto })
  async getMyEvent(
    @Query() pagination: PaginationDto,
    @Response() res: any,
    @User('id') userId: string
  ) {
    const events = await this.eventService.getEventByCreator(
      userId,
      pagination
    );
    transferResponse(res, { statusCode: 200, data: events });
  }

  @Public()
  @Get('/:id')
  async getEventById(@Param('id') eventId: string, @Response() res: any) {
    const eventDetail = await this.eventService.getEventByID(eventId);
    transferResponse(res, { statusCode: 200, data: eventDetail });
  }

  @Roles(RoleEnum.User)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: EventDto })
  async createEvent(
    @Body() eventInfo: EventDto,
    @Response() res: any,
    @User('userId') userId: string
  ) {
    console.log('userId', userId);
    const newEvent = await this.eventService.createEvent({
      ...eventInfo,
      userId,
    });
    transferResponse(res, newEvent);
  }

  @Roles(RoleEnum.User)
  @Put('/:eventId')
  @ApiBody({ type: EventDto })
  @ApiBearerAuth()
  async updateEvent(
    @Body() eventInfo: EventDto,
    @Query('eventId') eventId: string,
    @User('userId') userId: string,
    @Response() res: any
  ) {
    const response = await this.eventService.updateEvent(eventId, {
      ...eventInfo,
      userId,
    });
    transferResponse(res, response);
  }
}
