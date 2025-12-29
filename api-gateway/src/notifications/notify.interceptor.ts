import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs/operators';
import { NotificationsService } from './notifications.service';
import { NOTIFY_KEY } from './notify.decorator';

@Injectable()
export class NotifyInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private notificationsService: NotificationsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const metadata = this.reflector.get<{ feature: string; event: string }>(
      NOTIFY_KEY,
      context.getHandler(),
    );

    if (!metadata) return next.handle();

    return next.handle().pipe(
      tap((data) => {
        this.notificationsService.notify(
          metadata.feature,
          metadata.event,
          data,
        );
      }),
    );
  }
}