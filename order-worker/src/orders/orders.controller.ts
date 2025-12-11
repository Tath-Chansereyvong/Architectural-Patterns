import { Controller } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    
  private readonly logger = new Logger(OrdersService.name);
  private readonly processedOrders: any[] = []; // simple "DB"
    @EventPattern('order_created')
    handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
        this.logger.log(`Received order_created event: ${JSON.stringify(data)}`);
        this.processedOrders.push({
            ...data,
          processedAt: new Date().toISOString(),
    });

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
