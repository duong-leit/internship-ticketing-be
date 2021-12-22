import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCodeEnum } from 'src/common/enums/errorCode';
import { EventService } from 'src/modules/event/service/event.service';
import { OrderService } from 'src/modules/order/service/order.service';
import { BankService } from 'src/modules/user/service/bank.service';
import { QueryRunner } from 'typeorm';
import { OrderStatusEnum } from '../../order/domain/enums/orderStatus.enum';
import { OrderRequestDto } from '../dto/payment.dto';
@Injectable()
export class PaymentService {
  constructor(
    private readonly orderService: OrderService,
    private readonly eventService: EventService,
    private readonly bankService: BankService
  ) {}

  async handleCheckout(data: OrderRequestDto, queryRunner: QueryRunner) {
    const isValid = await this.orderService.validateNewOrder(
      data.userId,
      data.eventId,
      data.amount
    );
    if (!isValid) {
      throw new BadRequestException(ErrorCodeEnum.INVALID_DATA);
    }
    let userBank: any = await this.bankService.getBank({
      ...data.bank,
    });
    if (!userBank.data) {
      userBank = await this.bankService.createBank(
        {
          ...data.bank,
        }
      );
    }
    const event = await this.eventService.getEventByID(data.eventId);
    if (!event) {
      throw new BadRequestException(ErrorCodeEnum.NOT_FOUND_EVENT);
    }

    const newOrder = await this.orderService.createOrder(
      {
        eventId: data.eventId,
        buyerId: data.userId,
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
