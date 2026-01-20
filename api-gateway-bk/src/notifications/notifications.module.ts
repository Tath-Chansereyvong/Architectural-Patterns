import { DynamicModule, Module } from '@nestjs/common';
import {
  NOTIFICATION_FEATURE_OPTIONS,
  NOTIFICATION_OPTIONS,
} from './notifications.constant';
import {
  NotificationModuleOptions,
  NotificationFeatureOptions,
} from './notifications.interface';
import { NotificationsService } from './notifications.service';
import { NotificationFeatureRegister } from './notifications-feature.registry';
import { NotificationsRegistryModule } from './notifications-registry.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotifyInterceptor } from './notify.interceptor';

@Module({
  imports: [NotificationsRegistryModule], // ✅ registry always available
})
export class NotificationsModule {
  static forRoot(options: NotificationModuleOptions): DynamicModule {
    return {
      module: NotificationsModule,
      global: true, // optional
      providers: [
        { provide: NOTIFICATION_OPTIONS, useValue: options },
        NotificationsService,
        {
          provide: APP_INTERCEPTOR,
          useClass: NotifyInterceptor,
        },
      ],
      exports: [NotificationsService],
    };
  }

  static forFeature(feature: NotificationFeatureOptions): DynamicModule {
    return {
      module: NotificationsModule,
      providers: [
        { provide: NOTIFICATION_FEATURE_OPTIONS, useValue: feature },
        NotificationFeatureRegister,
      ],
    };
  }
}