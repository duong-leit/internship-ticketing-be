import { Injectable } from '@nestjs/common';
import { EventService } from 'src/modules/event/service/event.service';
import { OrderService } from 'src/modules/order/service/order.service';
import { BankService } from 'src/modules/user/service/bank.service';
import { Connection } from 'typeorm';
import { OrderStatusEnum } from '../../order/domain/enums/orderStatus.enum';
import { OrderRequestDto } from '../dto/payment.dto';
@Injectable()
export class PaymentService {
  constructor(
    private readonly orderService: OrderService,
    private readonly eventService: EventService,
    private readonly bankService: BankService,
    private connection: Connection
  ) {}

  async handleCheckout(data: OrderRequestDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isValid = await this.orderService.validateNewOrder(
        data.userId,
        data.eventId,
        data.amount
      );
      if (!isValid.status) {
        return { statusCode: 400, message: isValid.message };
      }
      let userBank: any = await this.bankService.getOneBank({
        ...data.bank,
      });
      if (!userBank.data) {
        userBank = await this.bankService.createBank(
          {
            ...data.bank,
            userId: data.userId,
          },
          queryRunner
        );
      }
      const event = await this.eventService.getEventByID(data.eventId);
      if (!event) return { statusCode: 400, message: 'Event is not found.' };

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
      queryRunner.commitTransaction();
      return { statusCode: 200, data: { orderId: newOrder } };
    } catch (error) {
      queryRunner.rollbackTransaction();
      console.log('payment error');
      return { statusCode: error.statusCode, message: error.message };
    }
  }
}
