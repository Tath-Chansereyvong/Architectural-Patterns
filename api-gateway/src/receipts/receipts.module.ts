import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from 'src/database/entities/receipts.entity'
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
    imports: [TypeOrmModule.forFeature([Receipt]), NotificationsModule],
    providers:[ReceiptsService],
    controllers:[ReceiptsController],
})
export class ReceiptsModule {}