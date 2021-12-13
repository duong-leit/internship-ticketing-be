import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EventService } from 'src/modules/event/service/event.service';
import { QueryRunner } from 'typeorm';
import { OrderEntity } from '../domain/entities/order.entity';
import { ICreateOrderDetails } from '../domain/interfaces/ITicket.interface';
import { OrderRepository } from '../infrastructure/repositories/order.repository';

@Injectable()
export class OrderService {
  orderDetailRepository: any;
  constructor(
    @InjectQueue('generate-ticket-token') private generateTiket: Queue,
    private readonly orderRepository: OrderRepository,
    private readonly eventService: EventService
  ) {}
  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async getOrders(
    condition?: { [field: string]: string | number },
    relations: string[] | undefined = ['event'],
    paging?: { take?: number; pageIndex?: number }
  ) {
    try {
      const orders = await this.orderRepository.find({
        relations: relations || undefined,
        where: condition,
        take: paging.take,
        skip: paging.pageIndex ? (paging.pageIndex - 1) * 5 : 0,
      });
      return { statusCode: 200, data: { orders } };
    } catch (error) {
      return { statusCode: error.statusCode, message: error.message };
    }
  }

  async getOrderDetails(
    userId: string,
    orderId: string,
    take = 5,
    page?: number
  ) {
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
        take: take,
        skip: page ? (page - 1) * 5 : 0,
      });

      return { statusCode: 200, data: { orderDetails: orderDetails } };
    } catch (error) {
      return { statusCode: error.statusCode, message: error.message };
    }
  }

  async createOrder(
    data: { [field: string]: string | number },
    queryRunner: QueryRunner
  ): Promise<OrderEntity> {
    try {
      const updatedEvent = await this.eventService.updateAvailableTickets(
        String(data.eventId),
        -Number(data.amount),
        queryRunner
      );
      if (!updatedEvent) {
        queryRunner.rollbackTransaction();
        throw new Error('invalid available ticket');
      }

      const order = await queryRunner.manager.save(OrderEntity, data);
      this.createOrderDetails({
        amount: Number(data.amount),
        orderId: String(order.id),
      });
      return order;
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw new Error('cannot create new order.');
    }
  }

  async createOrderDetails(data: ICreateOrderDetails): Promise<void> {
    //IOrderDetail
    for (let count = 0; count < data.amount; count++) {
      console.log(data);
      await this.generateTiket.add('generate', {
        orderId: data.orderId,
        id: (Math.random() * Math.random() * 1000000).toString(), // fake token
      });
    }
  }

  async validateNewOrder(buyerId: string, eventId: string, amount: number) {
    const event = await this.eventService.getEventByID(eventId);
    if (event.availableTickets < amount) {
      return { status: false, message: 'The number of ticket is invalid' };
    }

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

  // async getTicketList(
  //   condition: { [field: string]: string },
  //   takeNumber?: number,
  //   page?: number
  // ): Promise<TicketEntity[]> {
  //   const ticket = await this.ticketRepository.find({
  //     where: condition,
  //     take: takeNumber,
  //     skip: (page - 1) * takeNumber,
  //   });
  //   return ticket;
  // }
}
