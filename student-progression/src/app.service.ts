import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { API_MOODLE } from './config/enviroment.config';
import { plainToClass } from 'class-transformer';
import { SiteInfoDTO } from './dtos/site-info.dto';

@Injectable()
export class AppService {

  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async fetchMoodleSiteInfo(): Promise<SiteInfoDTO> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${API_MOODLE}/site-info`),
      );
      console.log("AAAAA",response.data);
      return plainToClass(SiteInfoDTO, response.data);
    } catch (error) {
      throw new Error('No se pudo obtener la informacion del sitio de Moodle');
    }
  }
}
