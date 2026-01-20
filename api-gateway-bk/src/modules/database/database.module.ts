import { DynamicModule, Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATA_SOURCE } from './database.constants';

@Global() // so you don't need to import it everywhere (research why)
@Module({
  imports: [ConfigModule],
})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DATA_SOURCE,
          inject: [ConfigService], // NestJS will wait for ConfigModule to be ready
          useFactory: async (configService: ConfigService) => {
            const ds = new DataSource({
              type: 'postgres',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USER'),
              password: configService.get<string>('DB_PASS'),
              database: configService.get<string>('DB_NAME'),
              entities: [__dirname + '/../**/*.entity{.ts,.js}'],
              synchronize: true,
            });

            return ds.initialize();
          },
        },
        // Provide the DataSource class as an alias for internal TypeORM use
        {
          provide: DataSource,
          useExisting: DATA_SOURCE,
        },
      ],
      exports: [DATA_SOURCE, DataSource],
    };
  }

  static forFeature(entities: any[]): DynamicModule {
    const repoProviders = entities.map((entity) => ({
      provide: `${entity.name.toUpperCase()}_REPO`,
      useFactory: (ds: DataSource) => ds.getRepository(entity),
      inject: [DATA_SOURCE],
    }));

    return {
      module: DatabaseModule,
      providers: repoProviders,
      exports: repoProviders,
    };
  }
}
