import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createOrder(orderDto: any) {
    // In real life we might validate or save to DB first
    // Here we just emit an event
    console.log('emit order_created 11');
    this.client.emit('order_created','');
    return { status: 'Order accepted', order: orderDto };
  }
  deleteOrder() {
    this.client.emit('order_deleted', {});
    return { status: 'Order deleted' };
  }
}