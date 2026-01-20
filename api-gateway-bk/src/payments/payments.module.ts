import {forwardRef, Module} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
    imports: [forwardRef(() => OrdersModule)],
    providers: [PaymentsService],
    controllers: [],
    exports: [PaymentsService],
})
export class PaymentsModule {}