import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: env().frontUrl });
  await app.listen(env().port, () =>
    console.log(
      `server runs on port ${env().port} in environment ${env().environment}`,
    ),
  );
}
bootstrap();
