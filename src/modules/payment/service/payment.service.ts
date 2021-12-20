import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ErrorCodeEnum } from 'src/common/enums/errorCode';
import { EventService } from 'src/modules/event/service/event.service';
import { OrderService } from 'src/modules/order/service/order.service';
import { BankService } from 'src/modules/user/service/bank.service';
import { QueryRunner } from 'typeorm';
import { OrderStatusEnum } from '../../order/domain/enums/orderStatus.enum';
import { OrderRequestDto } from '../dto/payment.dto';
@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    private readonly orderService: OrderService,
    private readonly eventService: EventService,
    private readonly bankService: BankService,
    @Inject(REQUEST) private readonly request
  ) {}

  async handleCheckout(data: OrderRequestDto, queryRunner: QueryRunner) {
    const buyerId =
      this.request?.user?.userId || '8c8c134e-d9d4-413f-933d-b622e91127d8';
    const isValid = await this.orderService.validateNewOrder(
      buyerId,
      data.eventId,
      data.amount
    );
    if (!isValid) {
      throw new BadRequestException(ErrorCodeEnum.INVALID_DATA);
    }
    const userBank: any = await this.bankService.getBank({
      id: data.bankId,
    });
    if (!userBank.data) {
      throw new NotFoundException(ErrorCodeEnum.NOT_FOUND_BANK);
    }

    const event = await this.eventService.getEventByID(data.eventId);
    if (!event) {
      throw new BadRequestException(ErrorCodeEnum.NOT_FOUND_EVENT);
    }

    const newOrder = await this.orderService.createOrder(
      {
        eventId: data.eventId,
        buyerId: buyerId,
        status: OrderStatusEnum.Done,
        orderDate: new Date().toISOString(),
        paymentDate: new Date().toISOString(),
        bankId: userBank.data.id,
        amount: data.amount,
      },
      queryRunner
    );
    return { orderId: newOrder.id };
  }
}
