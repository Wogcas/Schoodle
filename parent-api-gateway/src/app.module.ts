import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

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
  providers: [AppService],
})
export class AppModule {}
