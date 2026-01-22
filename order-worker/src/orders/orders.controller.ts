import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Notify } from '../notifications/notify.decorator';
import { VerifyCustomerPipe } from 'src/modules/customers/pipes/verify-customer-pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Notify('orders', 'order_created')
  create(@Body(VerifyCustomerPipe) body: any) {
    console.log('controller create');
    return this.ordersService.createOrder(body);
  }

  @Delete()
  delete() {
    console.log("Delete order");
    return this.ordersService.deleteOrder();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    return { user: req.user, orders: [] };
  }
}