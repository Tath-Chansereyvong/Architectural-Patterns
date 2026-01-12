import { PipeTransform, BadRequestException } from '@nestjs/common';

export class TrimPipe implements PipeTransform {
  constructor(private readonly rejectEmpty = true) {}

  transform(value: any): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Value must be a string');
    }

    const trimmed = value.trim();

    if (this.rejectEmpty && trimmed.length === 0) {
      throw new BadRequestException('Value cannot be empty');
    }

    return trimmed;
  }
}
