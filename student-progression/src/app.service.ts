import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { API_MOODLE } from './config/enviroment.config';
import { plainToClass } from 'class-transformer';
import { SiteInfoDTO } from './dtos/site-info.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  //private readonly logger = new Logger(AppService.name);

  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async fetchMoodleSiteInfo(): Promise<SiteInfoDTO> {
    try {
      const url =  `${API_MOODLE}/site-info`;
      const response = await firstValueFrom(
        this.httpService.get(url),
      );
      //this.logger.debug(`Response API Moodle: ${JSON.stringify(response.data)}`);
      return plainToClass(SiteInfoDTO, response.data);
    } catch (error) {
      throw new Error('No se pudo obtener la informacion del sitio de Moodle');
    }
  }
}
