import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventService } from 'src/modules/event/service/event.service';
import { TicketService } from 'src/modules/ticket/service/ticket.service';
import { OrderEntity } from '../domain/entities/order.entity';
import { OrderStatusEnum } from '../domain/enums/orderStatus.enum';
import { IOrderDetail } from '../domain/interfaces/IOrderDetail.interface';
import { OrderRepository } from '../infrastructure/order.repository';
import { OrderDetailRepository } from '../infrastructure/orderDetail.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderDetailRepository: OrderDetailRepository,
    @Inject(forwardRef(() => TicketService))
    private readonly ticketService: TicketService,
    private readonly eventService: EventService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async handleTicketPayment() {
    try {
      const buyerId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
      const eventId = '4fd369aa-75de-47d1-99ad-6e6cee11418e';
      const amount = 3;
      /**
       * Input: buyerId, eventId, nOTicket, bankInfo
       */
      // this.validateCheckout();
      //get list of user's bank account by bankInfo; if not exists, create
      //update availableTicket Event
      const newOrder = await this.createOrder({
        eventId: eventId,
        buyerId: buyerId,
        status: OrderStatusEnum.Done,
        orderDate: '2020-02-02',
        paymentDate: '2020-02-03',
        bankId: '71eeb732-79ae-4d20-9764-63acb8ec96ce',
        amount: amount,
      });
      await this.ticketService.transferTicketOwner(
        newOrder.id,
        eventId,
        amount
      );
      console.log('transfer done.');
      //  * transfer Ticket: {
      //  * getTicketbyAmount
      //  * create orderdetail
      //  * deleteTicketList() array
      //  * }
      //  * return {statusCode, message}
    } catch (error) {
      console.log('payment.service: line 50', error.message);
      return { statusCode: error.statusCode, message: error.message };
    }
  }

  async createOrder(data: {
    [field: string]: string | number;
  }): Promise<OrderEntity> {
    return await this.orderRepository.save(data);
  }

  async createOrderDetail(data: IOrderDetail) {
    return await this.orderDetailRepository.insert(data);
  }

  async validateCheckout(buyerId: string, eventId: string, amount: number) {
    //buyerId:string, eventId:string, amount:number

    /**
     * validate: check availabie ticket < amount
     * validate: check the total myticketsAtEvent purchased and amount to buy is over the limit
     * validate: check the info bank is not exists, if not: create new bank
     */
    const event = await this.eventService.getEventByID(eventId);
    if (event.availableTickets < amount) return false;
    const orderList = await this.orderRepository.find({
      buyerId: buyerId,
      eventId: eventId,
    });
    const totalAmount =
      orderList.reduce((total, element) => total + element.amount, 0) + amount;
    if (
      totalAmount > event.maxTicketOrder ||
      totalAmount < event.minTicketOrder
    ) {
      return false;
    }
    return true;
  }
}
