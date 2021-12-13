import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventService } from 'src/modules/event/service/event.service';
import { TicketService } from 'src/modules/ticket/service/ticket.service';
import { BankService } from 'src/modules/user/service/bank.service';
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
    private readonly eventService: EventService,
    private readonly bankService: BankService
  ) {}

  async getOrderList(
    condition: { [field: string]: string | number },
    relations: { arrayRelation: string[] } | undefined = {
      arrayRelation: ['event'],
    },
    paging?: { take?: number; pageIndex?: number }
  ) {
    try {
      const orders = await this.orderRepository.find({
        relations: relations?.arrayRelation || undefined,
        where: condition,
        take: paging.take,
        skip: paging.pageIndex,
      });
      return { statusCode: 200, data: { orders } };
    } catch (error) {
      return { statusCode: error.statusCode, message: error.message };
    }
  }
  async getMyTicketOrder(buyerId: string, pageIndex = 0) {
    try {
      const condition = {
        buyerId: buyerId,
      };
      const paging = { take: 5, pageIndex: pageIndex };
      const ticketOrderList = await this.getOrderList(
        condition,
        { arrayRelation: ['event'] },
        paging
      );

      return { statusCode: 200, data: { OrderList: ticketOrderList } };
    } catch (error) {
      console.log(error);
      return { statusCode: error.statusCode, message: error.message };
    }
  }
  async getOrderDetails(userId: string, orderId: string, page?: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { buyerId: userId },
      });
      if (order?.id != orderId) {
        return {
          statusCode: 400,
          message: "User don't have permission on this order.",
        };
      }

      const orderDetails = await this.orderDetailRepository.find({
        where: { orderId },
        take: 5,
        skip: page ? (page - 1) * 5 : 0,
      });

      return { statusCode: 200, data: { orderDetails: orderDetails } };
    } catch (error) {
      return { statusCode: error.statusCode, message: error.message };
    }
  }

  async handleTicketPayment(data: {
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
      const result = await this.validateCheckout(
        data.userId,
        data.eventId,
        data.amount
      );
      if (result.status === true) {
        return { statusCode: 400, message: result.message };
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

      // const newAvailableTickets = event.availableTickets - data.amount;
      await this.eventService.updateAvailableTickets(event.id, data.amount);
      //update availableTicket Event
      const newOrder = await this.createOrder({
        eventId: data.eventId,
        buyerId: data.userId,
        status: OrderStatusEnum.Done,
        orderDate: Date(),
        paymentDate: Date(), //'2020-02-03',
        bankId: userBank.data.id,
        amount: data.amount,
      });
      await this.ticketService.transferTicketOwner({
        orderId: newOrder.id,
        eventId: data.eventId,
        amount: data.amount,
      });

      return { statusCode: 200 };
    } catch (error) {
      console.log(error);
      return { statusCode: error.statusCode, message: error.message };
    }
  }

  async createOrder(data: { [field: string]: string | number }): Promise<any> {
    const orderList: OrderEntity = await this.orderRepository.save(data);
    return orderList;
  }

  async createOrderDetail(data: IOrderDetail) {
    return await this.orderDetailRepository.insert(data);
  }

  async validateCheckout(buyerId: string, eventId: string, amount: number) {
    const event = await this.eventService.getEventByID(eventId);
    if (event.availableTickets < amount) {
      return { status: false, message: 'The number of ticket is invalid' };
    }

    // validate: check the total myticketsAtEvent purchased and amount to buy is over the limit
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
      return {
        status: false,
        message: 'Number of ticket is less or more than the limit.',
      };
    }
    return { status: true };
  }
}
