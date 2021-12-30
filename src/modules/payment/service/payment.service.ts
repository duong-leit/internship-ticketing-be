import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
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
    private readonly bankService: BankService
  ) {}

  async handleCheckout(
    data: OrderRequestDto,
    buyerId: string,
    queryRunner: QueryRunner
  ) {
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

    const currentDate = new Date().toISOString();
    const newOrder = await this.orderService.createOrder(
      {
        eventId: data.eventId,
        ticketImage: event.ticketImageUrl || '',
        sellerId: event.userId,
        buyerId: buyerId,
        status: OrderStatusEnum.Done,
        orderDate: currentDate,
        paymentDate: currentDate,
        bankId: userBank.data.id,
        amount: data.amount,
      },
      queryRunner
    );
    return { orderId: newOrder.id };
  }
}
