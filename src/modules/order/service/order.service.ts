import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Queue } from 'bull';
import { EventService } from 'src/modules/event/service/event.service';
import { QueryRunner } from 'typeorm';
import { OrderEntity } from '../domain/entities/order.entity';
import { OrderDetailEntity } from '../domain/entities/orderDetail.entity';
import {
  // IOrder,
  IOrderDetail,
} from '../domain/interfaces/IOrderDetail.interface';
import { ICreateOrderDetails } from '../domain/interfaces/ITicket.interface';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { OrderDetailRepository } from '../infrastructure/repositories/orderDetail.repository';
// import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectQueue('generate-ticket-token') private generateTiket: Queue,
    private readonly orderRepository: OrderRepository,
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly eventService: EventService
  ) {}
  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async getOrders(
    condition?: { [field: string]: string | number },
    relations: string[] | undefined = ['event', 'orderDetail'],
    page?: number,
    limit?: number
  ): Promise<any> {
    const [orders, totalItems] = await this.orderRepository.findAndCount({
      relations: relations || undefined,
      where: { ...condition },
      take: limit,
      skip: page ? (page - 1) * limit : 0,
    });
    return {
      items: orders,
      meta: {
        totalItems: totalItems,
        itemsPerPage: Number(limit),
        currentPage: Number(page),
      },
    };
  }

  async getOrderDetails(
    userId: string,
    orderId: string,
    page: number,
    limit: number
  ): Promise<IOrderDetail> {
    const order = await this.orderRepository.findOne({
      where: { buyerId: userId, id: orderId },
    });
    if (!order) {
      throw new NotFoundException("User don't have this order");
    }

    const [orderDetails, totalItems] =
      await this.orderDetailRepository.findAndCount({
        where: { orderId: orderId },
        take: limit,
        skip: page ? (page - 1) * limit : 0,
      });

    return {
      items: orderDetails,
      meta: {
        totalItems: totalItems,
        itemsPerPage: limit,
        currentPage: page,
      },
    };
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
    //tạo 1 row trong table order
    const order = await queryRunner.manager.save(OrderEntity, data);
    //tạo detail trong table orderDetail
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
