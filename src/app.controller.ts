import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from './interceptor/logging.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(LoggingInterceptor)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
