import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '..', 'server.key')),
    cert: readFileSync(join(__dirname, '..', 'server.crt')),
  };

  const app = await NestFactory.create(AppModule,{ httpsOptions });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  
}
bootstrap();
