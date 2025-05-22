import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MoodleInfoService } from './services/moodle-info.service';
import { ParentalApprovalService } from './services/parental-approval.service';
import { AppService } from './app.service';
import { readFileSync } from 'fs';
import { ChannelCredentials } from '@grpc/grpc-js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STUDENT_PROGRESS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'moodle',
          protoPath: join(__dirname, 'protos/moodle-info.proto'),
          url: 'localhost:50052',
          credentials: ChannelCredentials.createSsl(
            readFileSync(join(__dirname, '..', 'certs/ca.crt')), // CA para verificar servidor
            readFileSync(join(__dirname, '..', 'certs/client.key')), // Clave cliente
            readFileSync(join(__dirname, '..', 'certs/client.crt')),  // Certificado cliente
            {
              checkServerIdentity: () => undefined, // Ignora la verificación del hostname
            }
          )
        }
      },
      {
        name: 'PARENTAL_APPROVAL_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'parentalapprovalmanagement',
          protoPath: join(__dirname, 'protos/tasks-parental-approval-management.proto'),
          url: 'localhost:50051',
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [MoodleInfoService, ParentalApprovalService, AppService],
})
export class AppModule { }
