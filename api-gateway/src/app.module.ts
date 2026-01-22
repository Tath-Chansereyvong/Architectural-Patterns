import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GatewayController } from './gateway.controller';
import { ProxyService } from './proxy.service';
import { AuthIntrospectionService } from './auth-introspection.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
  ],
  controllers: [GatewayController],
  providers: [ProxyService, AuthIntrospectionService],
})
export class AppModule {}