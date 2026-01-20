import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService
  ) {}

  hello() {
    console.log('Hello from Payment');
    return 'Hello from payment';
  }
}
