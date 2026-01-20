/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Query, Resolver } from '@nestjs/graphql';
import { ReceiptsService } from './receipts.service';

@Resolver('Receipt')
export class ReceiptResolver {
  constructor(private readonly receiptService: ReceiptsService) {}
  @Query('receipts')
  receipts() {
    // MUST return an array (even empty array), never null/undefined
    return this.receiptService.findAll();
  }
}