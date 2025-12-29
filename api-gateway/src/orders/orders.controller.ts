import { Body, Controller, Delete, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Notify } from '../notifications/notify.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Notify('orders', 'order_created')
  create(@Body() body: any) {
    console.log('controller create');
    return this.ordersService.createOrder(body);
  }

  @Delete()
  delete() {
    console.log("Delete order");
    return this.ordersService.deleteOrder();
  }
}