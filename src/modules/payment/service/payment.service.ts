import { Injectable } from '@nestjs/common';
import { EventService } from 'src/modules/event/service/event.service';
import { OrderService } from 'src/modules/order/service/order.service';
import { BankService } from 'src/modules/user/service/bank.service';
import { OrderStatusEnum } from '../../order/domain/enums/orderStatus.enum';

@Injectable()
export class PaymentService {
  constructor(
    // @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly eventService: EventService,
    private readonly bankService: BankService
  ) {}

  async handleCheckout(data: {
    userId: string;
    eventId: string;
    amount: number;
    bank: {
      name: string;
      cardHolderName: string;
      creditNumber: string;
    };
  }) {
    try {
      const isValid = await this.orderService.validateNewOrder(
        data.userId,
        data.eventId,
        data.amount
      );
      if (isValid.status === true) {
        return { statusCode: 400, message: isValid.message };
      }

      let userBank: any = await this.bankService.getOneBank(data.bank);
      if (!userBank.data) {
        userBank = await this.bankService.createBank({
          ...data.bank,
          userId: data.userId,
        });
      }

      const event = await this.eventService.getEventByID(data.eventId);
      if (!event) return { statusCode: 400, message: 'Event is not found.' };

      const newOrder = await this.orderService.createOrder({
        eventId: data.eventId,
        buyerId: data.userId,
        status: OrderStatusEnum.Done,
        orderDate: Date(),
        paymentDate: Date(), //'2020-02-03',
        bankId: userBank.data.id,
        amount: data.amount,
      });
      return { statusCode: 200, data: { orderId: newOrder.id } };
    } catch (error) {
      console.log(error);
      return { statusCode: error.statusCode, message: error.message };
    }
  }
}
