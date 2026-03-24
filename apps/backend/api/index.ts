import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: '*' });
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

export default async function (req: any, res: any) {
  const app = await bootstrap();
  app(req, res);
}
