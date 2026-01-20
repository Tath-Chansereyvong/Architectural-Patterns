import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Date must be a string');
    }

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(value)) {
      throw new BadRequestException('Date must be in dd/mm/yyyy format');
    }

    const [day, month, year] = value.split('/').map(Number);

    if (year >= 2010) {
      throw new BadRequestException('Year must be lower than 2010.');
    }

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new BadRequestException('Invalid calendar date');
    }

    return value;
  }
}
