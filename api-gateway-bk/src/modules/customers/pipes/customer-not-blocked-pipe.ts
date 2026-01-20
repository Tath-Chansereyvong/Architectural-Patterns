import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CustomersService } from '../customers.service';

@Injectable()
export class CustomerNotBlockedPipe implements PipeTransform {
  constructor(private readonly customersService: CustomersService) {}

  transform(value: any) {
    if (typeof value === 'object' || value !== null) {
      const rawPhone = value.phone?.toString() || '';
      const cleanPhone = rawPhone.replace(/\s/g, '').replace(/^0+/, '+855');
      const cleanName = value.fullName?.toString().trim() || '';
      const cleanId = value.nationalId?.toString() || '';
      if (this.customersService.isBlockedPhone(cleanPhone)) {
        throw new ForbiddenException('This phone number is blacklisted');
      }
      if (this.customersService.isBlockedName(cleanName)) {
        throw new ForbiddenException('This user is blocked from the system');
      }
      if (this.customersService.isBlockedNationalId(cleanId)) {
        throw new ForbiddenException('National ID is blocked');
      }
    }

    return value;
  }
}
