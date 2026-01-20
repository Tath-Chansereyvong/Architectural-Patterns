import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

export interface VerifyCustomerRequest {
  fullName: string;
  dob: string;
  phone: string;
  nationalId?: string;
}

@Injectable()
export class VerifyCustomerPipe implements PipeTransform {
  transform(value: any): VerifyCustomerRequest {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Request body is required');
    }

    let { fullName, dob, phone, nationalId } = value;

    /**
     * 1️⃣ fullName: trim + not empty
     */
    if (typeof fullName !== 'string') {
      throw new BadRequestException('fullName must be a string');
    }

    fullName = fullName.trim();
    if (!fullName) {
      throw new BadRequestException('fullName cannot be empty');
    }

    /**
     * 2️⃣ dob: valid date & year < 2010
     * Accept: YYYY-MM-DD or DD-MM-YYYY
     */
    if (typeof dob !== 'string') {
      throw new BadRequestException('dob must be a string');
    }

    let year: number;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      year = parseInt(dob.split('-')[0], 10);
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
      year = parseInt(dob.split('-')[2], 10);
      const [d, m, y] = dob.split('-');
      dob = `${y}-${m}-${d}`; // normalize format
    } else {
      throw new BadRequestException('dob format is invalid');
    }

    if (year >= 2010) {
      throw new BadRequestException('dob must be before year 2010');
    }

    /**
     * 3️⃣ phone: normalize (Cambodia)
     */
    if (typeof phone !== 'string') {
      throw new BadRequestException('phone must be a string');
    }

    phone = phone.replace(/[\s\-()]/g, '');

    if (phone.startsWith('0')) {
      phone = '+855' + phone.substring(1);
    }

    if (!/^\+855\d{8,9}$/.test(phone)) {
      throw new BadRequestException('Invalid Cambodian phone number');
    }

    /**
     * 4️⃣ nationalId: optional pattern check
     */
    if (nationalId !== undefined) {
      if (
        typeof nationalId !== 'string' ||
        !/^NID\d{6,10}$/.test(nationalId)
      ) {
        throw new BadRequestException('Invalid nationalId format');
      }
    }

    /**
     * ✅ Return transformed object
     */
    return {
      fullName,
      dob,
      phone,
      nationalId,
    };
  }
}
