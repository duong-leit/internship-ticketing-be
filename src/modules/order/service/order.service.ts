import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Queue } from 'bull';
import { EventService } from 'src/modules/event/service/event.service';
import { QueryRunner } from 'typeorm';
import { OrderEntity } from '../domain/entities/order.entity';
import { OrderDetailEntity } from '../domain/entities/orderDetail.entity';
import { IOrderDetail } from '../domain/interfaces/IOrderDetail.interface';
import { ICreateOrderDetails } from '../domain/interfaces/ITicket.interface';
import { OrderDto } from '../dto/order.dto';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { OrderDetailRepository } from '../infrastructure/repositories/orderDetail.repository';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectQueue('generate-ticket-token') private generateTiket: Queue,
    private readonly orderRepository: OrderRepository,
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly eventService: EventService,
    @InjectMapper()
    private readonly mapper: Mapper
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
    const ordersMapper = orders.map((item: OrderEntity) => {
      return this.mapper.map(item, OrderDto, OrderEntity);
    });
    console.log('orders', orders);
    return {
      items: ordersMapper,
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

    const order = await queryRunner.manager.save(OrderEntity, data);

    this.createOrderDetails(
      {
        amount: Number(data.amount),
        orderId: order.id as string,
        ticketImage: data.ticketImage as string,
        sellerId: data.sellerId as string,
        buyerId: data.buyerId as string,
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
        ticketImage: data.ticketImage,
        orderDetailId: orderDetails[count],
        sellerId: data.sellerId,
        buyerId: data.buyerId,
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
