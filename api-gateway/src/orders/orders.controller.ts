import { Body, Controller, Delete, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
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