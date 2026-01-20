import { Body, Controller, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { DateValidationPipe } from './pipes/dob-format-year-pipe';
import { PhoneNormalizePipe } from './pipes/phone-normalize-pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { CustomerNotBlockedPipe } from './pipes/customer-not-blocked-pipe';
import { VerifyCustomerPipe } from './pipes/verify-customer-pipe';
import type { VerifyCustomerRequest } from './pipes/verify-customer-pipe';

@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Post()
  create(
    @Body('dob', DateValidationPipe) dob: string,
    @Body('phone', PhoneNormalizePipe) phone: string,
    @Body('fullName', TrimPipe) fullName: string,
    @Body(CustomerNotBlockedPipe) createCustomerDto: CreateCustomerDto,
  ) {
    const finalCustomerData = {
      ...createCustomerDto,
      dob,
      phone,
      fullName,
    };
    return this.service.create(finalCustomerData);
  }
  @Post('verify')
  verifyCustomer(
    @Body(VerifyCustomerPipe) body: VerifyCustomerRequest) {
    return {
    ok: true,
    normalized: body,
  };
}
}