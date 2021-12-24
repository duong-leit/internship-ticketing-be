import { Module } from '@nestjs/common';
import { AxiosService } from './service/axios.sesrvice';
import { TatumService } from './service/tatum.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TatumService, AxiosService],
  exports: [TatumService],
})
export class ShareModule {}
