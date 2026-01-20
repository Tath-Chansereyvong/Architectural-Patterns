export type NotificationChannel = 'log' | 'email' | 'sms' | 'telegram';

export interface NotificationModuleOptions {
  appName: string;                 // global app name
  defaultChannel: NotificationChannel;
  enable: boolean;                 // master switch
}

export interface NotificationFeatureOptions {
  featureName: string;             // e.g., "orders", "receipts"
  prefix?: string;                 // e.g., "[ORDERS]"
  channels?: NotificationChannel[]; // override channels for this feature
  enable?: boolean;                // feature-specific enable/disable
}