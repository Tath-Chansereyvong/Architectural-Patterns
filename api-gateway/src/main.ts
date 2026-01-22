import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(require('express').json({ limit: '2mb' }));

  const config = app.get(ConfigService);
  const port = config.get<number>('GATEWAY_PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();