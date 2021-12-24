import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../domain/entities/order.entity';
import { OrderDto } from '../dto/order.dto';
import { EventEntity } from 'src/modules/event/domain/entities/event.entity';
import { EventHeaderDto } from 'src/modules/event/dto/event.dto';
import { CommonBankResponseDto } from 'src/modules/user/dto/bank.dto';
import { BankEntity } from 'src/modules/user/domain/entities/bank.entity';
import { OrderDetailDto } from '../dto/orderDetail.dto';
import { OrderDetailEntity } from '../domain/entities/orderDetail.entity';

@Injectable()
export class OrderProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(OrderEntity, OrderDto);
      mapper.createMap(EventEntity, EventHeaderDto);
      mapper.createMap(BankEntity, CommonBankResponseDto);
      mapper.createMap(OrderDetailEntity, OrderDetailDto);
    };
  }
}
