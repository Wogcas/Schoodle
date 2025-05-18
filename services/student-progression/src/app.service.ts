import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { SiteInfoDTO } from './dtos/site-info.dto';
import { enviroment } from './config/enviroment.config';

@Injectable()
export class AppService {

  //private readonly logger = new Logger(AppService.name);

  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async fetchMoodleSiteInfo(): Promise<SiteInfoDTO> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('/site-info'),
      );
      //this.logger.debug(`Response API Moodle: ${JSON.stringify(response.data)}`);
      return plainToClass(SiteInfoDTO, response.data);
    } catch (error) {
      throw new Error('Couldnt fetch Moodle site info');
    }
  }
}
