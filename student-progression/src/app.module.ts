import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { enviroment } from './config/enviroment.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: enviroment.apimoodle,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
