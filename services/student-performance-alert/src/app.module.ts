import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { enviroment } from './config/enviroment.config';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: enviroment.apimoodle,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMQService],
})
export class AppModule {}
