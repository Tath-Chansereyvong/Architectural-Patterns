import { SetMetadata } from '@nestjs/common';

export const NOTIFY_KEY = 'NOTIFY_METADATA';

export const Notify = (feature: string, event: string) =>
  SetMetadata(NOTIFY_KEY, { feature, event });