import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor() {}

  create(createCustomerDto: CreateCustomerDto) {
    return {
      message: 'Customer created successfully',
      data: createCustomerDto,
    };
  }
  private readonly blockedPhones = [
    '+855123456789',
    '+85598765432',
  ];

  private readonly blockedNationalIds = [
    'NID12345',
    'NID999999',
  ];

  private readonly blockedNames = [
    'Hello',
    'Hi',
  ];

  // 📞 Phone block check
  isBlockedPhone(phone: string): boolean {
    return this.blockedPhones.includes(phone);
  }

  // 🆔 National ID block check (optional)
  isBlockedNationalId(nationalId?: string): boolean {
    if (!nationalId) return false;
    return this.blockedNationalIds.includes(nationalId);
  }

  // 👤 Name block check (normalized comparison)
  isBlockedName(fullName: string): boolean {
    return this.blockedNames.includes(fullName);
  }
}

