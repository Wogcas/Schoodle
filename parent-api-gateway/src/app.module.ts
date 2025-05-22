import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MoodleInfoService } from './services/moodle-info.service';
import { ParentalApprovalService } from './services/parental-approval.service';
import { AppService } from './app.service';
import { readFileSync } from 'fs';
import { ChannelCredentials } from '@grpc/grpc-js';
import { HttpModule } from '@nestjs/axios';
import { enviroment } from './config/enviroment.config';
import * as https from 'https';
import { AuthenticationService } from './services/authentication.service';


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
    ]),
    HttpModule.register({
      baseURL: enviroment.authservice,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Ignora errores de certificados autofirmados
      })
    })
  ],
  controllers: [AppController],
  providers: [MoodleInfoService, ParentalApprovalService, AuthenticationService, AppService],
})
export class AppModule { }
