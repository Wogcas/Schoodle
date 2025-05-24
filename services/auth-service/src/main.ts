import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { readFileSync } from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '..', 'server.key')),
    cert: readFileSync(join(__dirname, '..', 'server.crt')),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  
  await app.listen(process.env.PORT ?? 3005);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
