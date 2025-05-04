import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { plainToClass } from 'class-transformer';
import { firstValueFrom } from 'rxjs';
import { SiteInfoDTO } from './dtos/site-info.dto';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
  
  async fetchMoodleSiteInfo(): Promise<SiteInfoDTO> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('/site-info'),
      );
      this.logger.debug(`Response API Moodle: ${JSON.stringify(response.data)}`);
      return plainToClass(SiteInfoDTO, response.data);
    } catch (error) {
      this.logger.error('Couldnt fetch Moodle site info', error);
      throw new Error('Couldnt fetch Moodle site info');
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug('Ejecutando la tarea programada...');
    try {
      const siteInfo = await this.fetchMoodleSiteInfo();
      this.rabbitMQService.publish('#', siteInfo); 
      this.logger.debug(`Información publicada en RabbitMQ: ${JSON.stringify(siteInfo)}`);
    } catch (error) {
      this.logger.error('Error al ejecutar la tarea programada', error);
    }
  }
}