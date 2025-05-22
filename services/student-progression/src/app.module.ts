import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { enviroment } from './config/enviroment.config';
import { MapperService } from './mapper/mapper.service';
import * as https from 'https';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: enviroment.apimoodle,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService, MapperService],
})
export class AppModule { }
