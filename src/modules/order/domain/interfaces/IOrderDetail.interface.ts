import { OrderDto } from '../../dto/order.dto';
import { OrderDetailEntity } from '../entities/orderDetail.entity';

export interface IOrder {
  items: OrderDto[];
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
