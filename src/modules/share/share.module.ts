import { Module } from '@nestjs/common';
import { TatumService } from './service/tatum.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TatumService],
  exports: [TatumService],
})
export class ShareModule {}
