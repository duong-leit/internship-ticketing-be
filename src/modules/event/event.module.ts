import { forwardRef, Module } from '@nestjs/common';
import { EventController } from './controller/event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './infrastructure/event.repository';
import { EventCategoryRepository } from './infrastructure/eventCategory.repository';
import { EventService } from './service/event.service';
import { TicketModule } from '../ticket/ticket.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([EventRepository, EventCategoryRepository]),
    forwardRef(() => TicketModule),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [TypeOrmModule, EventService],
})
export class EventModule {}
