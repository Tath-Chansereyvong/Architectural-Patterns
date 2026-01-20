import { PipeTransform, BadRequestException } from '@nestjs/common';

export class PhoneNormalizePipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Phone number must be a string');
    }

    // 1. Remove spaces, -, (, )
    let phone = value.replace(/[\s\-()]/g, '');

    // 2. Reject non-numeric characters (except leading +)
    if (!/^(\+?\d+)$/.test(phone)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // 3. Convert local Cambodian number (starts with 0) → +855
    if (phone.startsWith('0')) {
      phone = '+855' + phone.substring(1);
    }

    // 4. Ensure it starts with +855
    if (!phone.startsWith('+855')) {
      throw new BadRequestException('Phone number must be Cambodian (+855)');
    }

    // 5. Validate final length: +855XXXXXXXXX (8–9 digits after country code)
    if (!/^\+855\d{8,9}$/.test(phone)) {
      throw new BadRequestException('Invalid Cambodian phone number length');
    }

    return phone;
  }
}
