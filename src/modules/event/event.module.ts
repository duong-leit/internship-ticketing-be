import { Module } from '@nestjs/common';
import { EventController } from './controller/event.controller';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [],
})
export class AppModule {}
