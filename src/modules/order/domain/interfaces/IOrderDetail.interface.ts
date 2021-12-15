import { OrderEntity } from '../entities/order.entity';
import { OrderDetailEntity } from '../entities/orderDetail.entity';

export interface IOrder {
  items: OrderEntity[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export interface IOrderDetail {
  items: OrderDetailEntity[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
  };
}
