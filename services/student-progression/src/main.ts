import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { readFileSync } from 'fs';
import { ServerCredentials } from '@grpc/grpc-js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'moodle',
      protoPath: join(__dirname, 'protos/moodle-info.proto'),
      url: 'localhost:50052',
      credentials: ServerCredentials.createSsl(
      readFileSync(join(__dirname, 'certs/ca.crt')), // CA para verificar clientes
      [{
        private_key: readFileSync(join(__dirname, '..', 'certs/server.key')),
        cert_chain: readFileSync(join(__dirname, '..', 'certs/server.crt'))
      }],
      true // Requerir autenticación del cliente
    )
    }
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
