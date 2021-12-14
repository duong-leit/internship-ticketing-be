import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EventService } from 'src/modules/event/service/event.service';
import { QueryRunner } from 'typeorm';
import { OrderEntity } from '../domain/entities/order.entity';
import { OrderDetailEntity } from '../domain/entities/orderDetail.entity';
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
    const orders = await this.orderRepository.find({
      relations: relations || undefined,
      where: condition,
      take: paging.take,
      skip: paging.pageIndex ? (paging.pageIndex - 1) * 5 : 0,
    });
    return orders;
  }

  async getOrderDetails(
    userId: string,
    orderId: string,
    take = 5,
    page?: number
  ): Promise<OrderDetailEntity> {
    const order = await this.orderRepository.findOne({
      where: { buyerId: userId },
    });
    if (order?.id != orderId) {
      throw "User don't have this order";
    }

    const orderDetails = await this.orderDetailRepository.find({
      where: { orderId },
      take: take,
      skip: page ? (page - 1) * 5 : 0,
    });

    return orderDetails;
  }

  async createOrder(
    data: { [field: string]: string | number },
    queryRunner: QueryRunner
  ): Promise<OrderEntity> {
    await this.eventService.updateAvailableTickets(
      String(data.eventId),
      -Number(data.amount),
      queryRunner
    );
    const order = await queryRunner.manager.save(OrderEntity, data);
    this.createOrderDetails(
      {
        amount: Number(data.amount),
        orderId: String(order.id),
      },
      queryRunner
    );
    return order;
  }

  async createOrderDetails(
    data: ICreateOrderDetails,
    queryRunner: QueryRunner
  ): Promise<void> {
    const orderDetails: string[] = [];
    for (let count = 0; count < data.amount; count++) {
      const orderDetail = await queryRunner.manager.insert(OrderDetailEntity, {
        orderId: data.orderId,
      });
      orderDetails.push(orderDetail.identifiers[0].id);
    }

    for (let count = 0; count < data.amount; count++) {
      await this.generateTiket.add('generate', {
        orderId: data.orderId,
        orderDetailId: orderDetails[count],
      });
    }
  }

  async validateNewOrder(
    buyerId: string,
    eventId: string,
    amount: number
  ): Promise<boolean> {
    const event = await this.eventService.getEventByID(eventId);
    if (event.availableTickets < amount) {
      return false;
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
      return false;
    }
    return true;
  }
}
